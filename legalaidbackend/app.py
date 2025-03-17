from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
import hashlib
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',  # Default XAMPP MySQL username
    'password': '',  # Default XAMPP MySQL password (empty)
    'database': 'legalaid_db'
}

# Secret key for JWT encoding/decoding
SECRET_KEY = "your_secret_key_here"  # Replace with your own secret key

def create_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.args.get('token')
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
    return decorated_function

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    phone_number = data.get('phoneNumber')
    email = data.get('email')
    password = data.get('password')
    city = data.get('city')

    if not first_name or not last_name or not phone_number or not email or not password or not city:
        return jsonify({"error": "Missing fields"}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    connection = create_db_connection()
    if connection:
        cursor = connection.cursor()
        try:
            cursor.execute("INSERT INTO users (first_name, last_name, phone_number, email, password, city) VALUES (%s, %s, %s, %s, %s, %s)",
                           (first_name, last_name, phone_number, email, hashed_password, city))
            connection.commit()
            return jsonify({"message": "User registered successfully"}), 201
        except Error as e:
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            connection.close()
    else:
        return jsonify({"error": "Database connection failed"}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    connection = create_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email, hashed_password))
            user = cursor.fetchone()
            if user:
                # Generate JWT token
                payload = {
                    'user_id': user['id'],  # Assuming you have a user ID field
                    'email': user['email'],
                    'exp': datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
                }
                token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
                return jsonify({"message": "Login successful", "token": token}), 200
            else:
                return jsonify({"error": "Invalid email or password"}), 401
        except Error as e:
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            connection.close()
    else:
        return jsonify({"error": "Database connection failed"}), 500

@app.route('/dashboard', methods=['GET'])
@token_required
def dashboard():
    token = request.args.get('token')
    data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    email = data['email']

    connection = create_db_connection()
    if connection:
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            if user:
                return jsonify(user), 200
            else:
                return jsonify({"error": "User not found"}), 404
        except Error as e:
            print(f"Database error: {e}")
            return jsonify({"error": str(e)}), 500
        finally:
            cursor.close()
            connection.close()
    else:
        return jsonify({"error": "Database connection failed"}), 500

@app.route('/register_law_firm', methods=['POST'])
def register_law_firm():
    data = request.form
    user_id = data.get('user_id')
    firm_name = data.get('firmName')
    address = data.get('address')
    city = data.get('city')
    state = data.get('state')
    zip_code = data.get('zipCode')
    country = data.get('country')
    phone = data.get('phone')
    email = data.get('email')
    website = data.get('website')
    tax_id = data.get('taxId')
    established_year = data.get('establishedYear')
    description = data.get('description')
    logo = request.files.get('logo')

    if not user_id or not firm_name or not address or not city or not state or not zip_code or not country or not phone or not email:
        return jsonify({"error": "Missing fields"}), 400

    connection = create_db_connection()
    if connection:
        cursor = connection.cursor()
        try:
            cursor.execute("INSERT INTO law_firms (user_id, firm_name, address, city, state, zip_code, country, phone, email, website, tax_id, established_year, description, logo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                           (user_id, firm_name, address, city, state, zip_code, country, phone, email, website, tax_id, established_year, description, logo.read() if logo else None))
            connection.commit()
            return jsonify({"message": "Law firm registered successfully"}), 201
        except Error as e:
            return jsonify({"error": str(e)}), 400
        finally:
            cursor.close()
            connection.close()
    else:
        return jsonify({"error": "Database connection failed"}), 500

if __name__ == '__main__':
    app.run(debug=True)