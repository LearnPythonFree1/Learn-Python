import os
from app import app, db, User
from werkzeug.security import generate_password_hash

def init_db():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Check if admin user exists
        admin = User.query.filter_by(email='ibrahim0355b@gmail.com').first()
        if not admin:
            # Create admin user
            admin = User(
                email='ibrahim0355b@gmail.com',
                password=generate_password_hash('ibrahim2355'),
                first_name='Admin',
                last_name='User',
                is_admin=True
            )
            db.session.add(admin)
            db.session.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists!")

if __name__ == '__main__':
    # Create .env file if it doesn't exist
    if not os.path.exists('.env'):
        with open('.env', 'w') as f:
            f.write('''FLASK_ENV=development
SECRET_KEY=your-secure-secret-key-here
DATABASE_URL=sqlite:///database.db
''')
        print(".env file created successfully!")
    
    # Create logs directory if it doesn't exist
    if not os.path.exists('logs'):
        os.makedirs('logs')
        print("logs directory created successfully!")
    
    # Initialize database
    init_db()
    print("Setup completed successfully!") 