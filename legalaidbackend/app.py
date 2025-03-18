from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import os
import base64

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})  # CORS for React

# MySQL Configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'legalaid_db',
    'cursorclass': pymysql.cursors.DictCursor
}

# Password hashing function
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
    return salt + key if salt else key  # Returns bytes

# Verify password function
def verify_password(stored_password, provided_password):
    salt = stored_password[:16]  # Extract salt (first 16 bytes)
    stored_key = stored_password[16:]  # Extract key
    provided_key = hash_password(provided_password, salt)  # Hash with same salt
    return stored_key == provided_key[16:]  # Compare keys

# Registration endpoint
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

        # Hash password and encode to base64
        hashed_bytes = hash_password(password)  # Bytes: salt + key
        hashed_password = base64.b64encode(hashed_bytes).decode('utf-8')  # Base64 string

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

# Login endpoint
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

        # Decode stored base64 password to bytes
        stored_password = base64.b64decode(lawyer['password'])  # From base64 string to bytes

        if verify_password(stored_password, password):
            return jsonify({
                'message': 'Login successful',
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

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)