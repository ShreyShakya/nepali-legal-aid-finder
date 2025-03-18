from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os
import base64
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'legalaid_db',
    'cursorclass': pymysql.cursors.DictCursor
}

SECRET_KEY = "your-secret-key-here"  # Replace with a secure key in production

def hash_password(password, salt=None):
    if salt is None:
        salt = os.urandom(16)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return salt + key if salt else key

def verify_password(stored_password, provided_password):
    salt = stored_password[:16]
    stored_key = stored_password[16:]
    provided_key = hash_password(provided_password, salt)
    return stored_key == provided_key[16:]

@app.route('/api/register-lawyer', methods=['POST'])
def register_lawyer():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400

        name = data.get('name')
        specialization = data.get('specialization')
        location = data.get('location')
        availability = data.get('availability')
        bio = data.get('bio')
        email = data.get('email')
        password = data.get('password')

        if not all([name, email, password]):
            return jsonify({'error': 'Name, email, and password are required'}), 400

        hashed_bytes = hash_password(password)
        hashed_password = base64.b64encode(hashed_bytes).decode('utf-8')

        conn = pymysql.connect(**db_config)
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO lawyers (name, specialization, location, availability, bio, email, password)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (name, specialization, location, availability, bio, email, hashed_password))
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
            token_payload = {
                'lawyer_id': lawyer['id'],
                'email': lawyer['email'],
                'exp': datetime.utcnow() + timedelta(hours=24)
            }
            token = jwt.encode(token_payload, SECRET_KEY, algorithm='HS256')

            return jsonify({
                'message': 'Login successful',
                'token': token,
                'lawyer': {
                    'id': lawyer['id'],
                    'name': lawyer['name'],
                    'email': lawyer['email'],
                    'specialization': lawyer['specialization'],
                    'location': lawyer['location'],
                    'availability': lawyer['availability'],
                    'bio': lawyer['bio']
                }
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
            sql = "SELECT id, name, email, specialization, location, availability, bio FROM lawyers WHERE id = %s"
            cursor.execute(sql, (lawyer_id,))
            lawyer = cursor.fetchone()

        conn.close()

        if not lawyer:
            return jsonify({'error': 'Lawyer not found'}), 404

        return jsonify({'lawyer': lawyer}), 200

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

        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        conn = pymysql.connect(**db_config)
        with conn.cursor() as cursor:
            sql = """
                UPDATE lawyers 
                SET specialization = %s, location = %s, availability = %s, bio = %s 
                WHERE id = %s
            """
            cursor.execute(sql, (
                data.get('specialization', ''),
                data.get('location', ''),
                data.get('availability', ''),
                data.get('bio', ''),
                lawyer_id
            ))
            conn.commit()

            cursor.execute("SELECT id, name, email, specialization, location, availability, bio FROM lawyers WHERE id = %s", (lawyer_id,))
            lawyer = cursor.fetchone()

        conn.close()
        return jsonify({'lawyer': lawyer}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

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
            sql = "SELECT id, title, description, status, created_at FROM cases WHERE lawyer_id = %s"
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

@app.route('/api/lawyer-password', methods=['PUT'])
def update_lawyer_password():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is missing'}), 401

    try:
        if token.startswith('Bearer '):
            token = token.split(' ')[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        lawyer_id = decoded['lawyer_id']

        data = request.json
        if not data or 'new_password' not in data:
            return jsonify({'error': 'New password is required'}), 400

        new_password = data['new_password']
        hashed_bytes = hash_password(new_password)
        hashed_password = base64.b64encode(hashed_bytes).decode('utf-8')

        conn = pymysql.connect(**db_config)
        with conn.cursor() as cursor:
            sql = "UPDATE lawyers SET password = %s WHERE id = %s"
            cursor.execute(sql, (hashed_password, lawyer_id))
            conn.commit()

        conn.close()
        return jsonify({'message': 'Password updated successfully'}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# New endpoint: Accept a case
@app.route('/api/lawyer-case/<int:case_id>/accept', methods=['PUT'])
def accept_case(case_id):
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
            # Verify case belongs to lawyer and is pending
            sql = "SELECT status FROM cases WHERE id = %s AND lawyer_id = %s"
            cursor.execute(sql, (case_id, lawyer_id))
            case = cursor.fetchone()
            if not case:
                return jsonify({'error': 'Case not found or unauthorized'}), 404
            if case['status'] != 'pending':
                return jsonify({'error': 'Case cannot be accepted'}), 400

            sql = "UPDATE cases SET status = 'accepted' WHERE id = %s"
            cursor.execute(sql, (case_id,))
            conn.commit()

        conn.close()
        return jsonify({'message': 'Case accepted successfully'}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

# New endpoint: Reject a case
@app.route('/api/lawyer-case/<int:case_id>/reject', methods=['PUT'])
def reject_case(case_id):
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
            # Verify case belongs to lawyer and is pending
            sql = "SELECT status FROM cases WHERE id = %s AND lawyer_id = %s"
            cursor.execute(sql, (case_id, lawyer_id))
            case = cursor.fetchone()
            if not case:
                return jsonify({'error': 'Case not found or unauthorized'}), 404
            if case['status'] != 'pending':
                return jsonify({'error': 'Case cannot be rejected'}), 400

            sql = "UPDATE cases SET status = 'rejected' WHERE id = %s"
            cursor.execute(sql, (case_id,))
            conn.commit()

        conn.close()
        return jsonify({'message': 'Case rejected successfully'}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)