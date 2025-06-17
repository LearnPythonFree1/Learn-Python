from flask import Flask, request, jsonify, session, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import datetime
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='.')
CORS(app, supports_credentials=True)

# Production configurations
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True

# Initialize database
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, default=datetime.utcnow)

# Setup logging
if not app.debug:
    if not os.path.exists('logs'):
        os.mkdir('logs')
    file_handler = RotatingFileHandler('logs/pythonpro.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('PythonPro startup')

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

# Admin required decorator
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Please log in'}), 401
        
        user = User.query.get(session['user_id'])
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
            
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route('/')
def index():
    return send_from_directory('.', 'login.html')

@app.route('/login.html')
def login():
    return send_from_directory('.', 'login.html')

@app.route('/dashboard.html')
def dashboard():
    return send_from_directory('.', 'dashboard.html')

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'{field.replace("_", " ").title()} is required'}), 400

        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered'}), 400

        # Create new user
        user = User(
            email=data['email'],
            password=generate_password_hash(data['password']),
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'Account created successfully'}), 201

    except Exception as e:
        app.logger.error(f'Signup error: {str(e)}')
        return jsonify({'message': 'An error occurred during signup'}), 500

@app.route('/api/login', methods=['POST'])
def login_api():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['is_admin'] = user.is_admin

            # Update last login
            user.last_login = datetime.utcnow()
            db.session.commit()

            if user.is_admin:
                return jsonify({'redirect': '/admin/admin.html'})
            return jsonify({'redirect': '/dashboard.html'})
        else:
            return jsonify({'message': 'Invalid email or password'}), 401

    except Exception as e:
        app.logger.error(f'Login error: {str(e)}')
        return jsonify({'message': 'An error occurred during login'}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out successfully'})

@app.route('/api/admin/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([{
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_admin': user.is_admin,
        'created_at': user.created_at.isoformat(),
        'last_login': user.last_login.isoformat()
    } for user in users])

@app.route('/api/admin/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    try:
        data = request.get_json()
        user = User.query.get_or_404(user_id)
        user.is_admin = data.get('is_admin', user.is_admin)
        db.session.commit()
        return jsonify({'message': 'User updated successfully'})
    except Exception as e:
        app.logger.error(f'Update user error: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'})
    except Exception as e:
        app.logger.error(f'Delete user error: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/user', methods=['GET'])
def get_user_data():
    if not session.get('user_id'):
        return jsonify({'error': 'Unauthorized'}), 401

    user = User.query.get_or_404(session['user_id'])
    return jsonify({
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_admin': user.is_admin,
        'created_at': user.created_at.isoformat(),
        'last_login': user.last_login.isoformat()
    })

@app.route('/admin/admin.html')
@admin_required
def admin_dashboard():
    return send_from_directory('admin', 'admin.html')

if __name__ == '__main__':
    if os.getenv('FLASK_ENV') == 'production':
        app.run(host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
    else:
        app.run(debug=True) 