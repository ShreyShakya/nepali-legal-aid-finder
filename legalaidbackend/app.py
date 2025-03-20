from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pymysql
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os
import base64
import jwt
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import re

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Configuration for file uploads
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'legalaid_db',
    'cursorclass': pymysql.cursors.DictCursor
}

# Load SECRET_KEY from environment variable
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here')  # Fallback for development
if SECRET_KEY == 'your-secret-key-here':
    print("WARNING: Using default SECRET_KEY. Set the SECRET_KEY environment variable in production.")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def hash_password(password, salt=None):
    if salt is None:
        salt = os.urandom(16)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=310000,  # Increased iterations for better security
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return salt + key if salt else key

def verify_password(stored_password, provided_password):
    salt = stored_password[:16]
    stored_key = stored_password[16:]
    provided_key = hash_password(provided_password, salt)
    return stored_key == provided_key[16:]

def validate_email(email):
    email_pattern = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
    return bool(email_pattern.match(email))

def validate_password_strength(password):
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one digit"
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, "Password must contain at least one special character"
    return True, ""

@app.route('/api/register-lawyer', methods=['POST'])
def register_lawyer():
    try:
        data = request.form  # Use form data for text fields
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        name = data.get('name')
        specialization = data.get('specialization')
        location = data.get('location')
        availability = data.get('availability')
        bio = data.get('bio')
        email = data.get('email')
        password = data.get('password')
        email_notifications = data.get('email_notifications', 1)
        availability_status = data.get('availability_status', 'Available')
        working_hours_start = data.get('working_hours_start', '09:00')
        working_hours_end = data.get('working_hours_end', '17:00')
        preferred_contact = data.get('preferred_contact', 'Email')

        if not all([name, email, password]):
            return jsonify({'error': 'Name, email, and password are required'}), 400

        # Validate email
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        # Validate password strength
        is_valid, password_error = validate_password_strength(password)
        if not is_valid:
            return jsonify({'error': password_error}), 400

        hashed_bytes = hash_password(password)
        hashed_password = base64.b64encode(hashed_bytes).decode('utf-8')

        profile_picture = None
        if 'profile_picture' in request.files:
            file = request.files['profile_picture']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                profile_picture = filename

        conn = pymysql.connect(**db_config)
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO lawyers (name, specialization, location, availability, bio, email, password, 
                    email_notifications, availability_status, working_hours_start, working_hours_end, 
                    preferred_contact, profile_picture)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (name, specialization, location, availability, bio, email, hashed_password,
                                 email_notifications, availability_status, working_hours_start, working_hours_end,
                                 preferred_contact, profile_picture))
            conn.commit()
        conn.close()
        return jsonify({'message': 'Lawyer registered successfully'}), 201

    except pymysql.err.IntegrityError:
        return jsonify({'error': 'Email already exists'}), 409
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/login-lawyer', methods=['POST'])
def login_lawyer():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'error': 'Email and password are required'}), 400

        # Validate email
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        conn = pymysql.connect(**db_config)
        with conn.cursor() as cursor:
            sql = "SELECT * FROM lawyers WHERE email = %s"
            cursor.execute(sql, (email,))
            lawyer = cursor.fetchone()

        conn.close()

        if not lawyer:
            return jsonify({'error': 'Invalid email or password'}), 401

        stored_password = base64.b64decode(lawyer['password'])
        if verify_password(stored_password, password):
            expiration_time = datetime.utcnow() + timedelta(hours=24)
            token_payload = {
                'lawyer_id': lawyer['id'],
                'email': lawyer['email'],
                'exp': int(expiration_time.timestamp())
            }
            token = jwt.encode(token_payload, SECRET_KEY, algorithm='HS256')

            lawyer_response = lawyer.copy()
            if isinstance(lawyer['working_hours_start'], timedelta):
                lawyer_response['working_hours_start'] = str(lawyer['working_hours_start'])
            if isinstance(lawyer['working_hours_end'], timedelta):
                lawyer_response['working_hours_end'] = str(lawyer['working_hours_end'])
            if lawyer['profile_picture']:
                lawyer_response['profile_picture'] = f"/uploads/{lawyer['profile_picture']}"

            return jsonify({
                'message': 'Login successful',
                'token': token,
                'lawyer': lawyer_response
            }), 200
        else:
            return jsonify({'error': 'Invalid email or password'}), 401

    except Exception as e:
        print(f"Error during login: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/lawyer-profile', methods=['GET'])
def lawyer_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token.split(' ')[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        lawyer_id = decoded['lawyer_id']

        conn = pymysql.connect(**db_config)
        with conn.cursor() as cursor:
            sql = """
                SELECT id, name, email, specialization, location, availability, bio, email_notifications, 
                       availability_status, working_hours_start, working_hours_end, preferred_contact, profile_picture
                FROM lawyers WHERE id = %s
            """
            cursor.execute(sql, (lawyer_id,))
            lawyer = cursor.fetchone()

        conn.close()

        if not lawyer:
            return jsonify({'error': 'Lawyer not found'}), 404

        lawyer_response = lawyer.copy()
        if isinstance(lawyer['working_hours_start'], timedelta):
            lawyer_response['working_hours_start'] = str(lawyer['working_hours_start'])
        if isinstance(lawyer['working_hours_end'], timedelta):
            lawyer_response['working_hours_end'] = str(lawyer['working_hours_end'])
        if lawyer['profile_picture']:
            lawyer_response['profile_picture'] = f"/uploads/{lawyer['profile_picture']}"

        return jsonify({'lawyer': lawyer_response}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/lawyer-profile', methods=['PUT'])
def update_lawyer_profile():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token.split(' ')[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        lawyer_id = decoded['lawyer_id']

        # Check if the request is JSON or form data
        if request.is_json:
            data = request.json
        else:
            data = request.form

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        profile_picture = None
        if 'profile_picture' in request.files:
            file = request.files['profile_picture']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                profile_picture = filename

        conn = pymysql.connect(**db_config)
        with conn.cursor() as cursor:
            # Fetch current profile picture if not updating it
            if not profile_picture:
                cursor.execute("SELECT profile_picture FROM lawyers WHERE id = %s", (lawyer_id,))
                current = cursor.fetchone()
                profile_picture = current['profile_picture']

            # Convert email_notifications to 1/0 for the database
            email_notifications = 1 if data.get('email_notifications', 1) in [True, '1', 1] else 0

            sql = """
                UPDATE lawyers 
                SET specialization = %s, location = %s, availability = %s, bio = %s, 
                    email_notifications = %s, availability_status = %s, 
                    working_hours_start = %s, working_hours_end = %s, preferred_contact = %s,
                    profile_picture = %s
                WHERE id = %s
            """
            cursor.execute(sql, (
                data.get('specialization', ''),
                data.get('location', ''),
                data.get('availability', ''),
                data.get('bio', ''),
                email_notifications,
                data.get('availability_status', 'Available'),
                data.get('working_hours_start', '09:00'),
                data.get('working_hours_end', '17:00'),
                data.get('preferred_contact', 'Email'),
                profile_picture,
                lawyer_id
            ))
            conn.commit()

            cursor.execute("""
                SELECT id, name, email, specialization, location, availability, bio, email_notifications, 
                       availability_status, working_hours_start, working_hours_end, preferred_contact, profile_picture
                FROM lawyers WHERE id = %s
            """, (lawyer_id,))
            lawyer = cursor.fetchone()

        conn.close()

        lawyer_response = lawyer.copy()
        if isinstance(lawyer['working_hours_start'], timedelta):
            lawyer_response['working_hours_start'] = str(lawyer['working_hours_start'])
        if isinstance(lawyer['working_hours_end'], timedelta):
            lawyer_response['working_hours_end'] = str(lawyer['working_hours_end'])
        if lawyer['profile_picture']:
            lawyer_response['profile_picture'] = f"/uploads/{lawyer['profile_picture']}"

        return jsonify({'lawyer': lawyer_response, 'message': 'Profile updated successfully'}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    # Additional security check to prevent directory traversal
    filename = secure_filename(filename)
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/lawyer-cases', methods=['GET'])
def lawyer_cases():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token.split(' ')[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        lawyer_id = decoded['lawyer_id']

        conn = pymysql.connect(**db_config)
        with conn.cursor() as cursor:
            sql = """
                SELECT id, title, description, status, created_at, priority
                FROM cases
                WHERE lawyer_id = %s
            """
            cursor.execute(sql, (lawyer_id,))
            cases = cursor.fetchall()

        conn.close()
        return jsonify({'cases': cases}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/lawyer-case/<int:case_id>/update-status', methods=['PUT'])
def update_case_status(case_id):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token.split(' ')[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        lawyer_id = decoded['lawyer_id']

        data = request.json
        if not data or 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400

        new_status = data['status']
        if new_status not in ['pending', 'accepted', 'rejected', 'completed']:
            return jsonify({'error': 'Invalid status value'}), 400

        conn = pymysql.connect(**db_config)
        with conn.cursor() as cursor:
            # Verify the case belongs to the lawyer
            sql = "SELECT lawyer_id FROM cases WHERE id = %s"
            cursor.execute(sql, (case_id,))
            case = cursor.fetchone()
            if not case or case['lawyer_id'] != lawyer_id:
                return jsonify({'error': 'Case not found or unauthorized'}), 403

            # Update the status
            sql = "UPDATE cases SET status = %s WHERE id = %s"
            cursor.execute(sql, (new_status, case_id))
            conn.commit()

        conn.close()
        return jsonify({'message': 'Case status updated successfully'}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)