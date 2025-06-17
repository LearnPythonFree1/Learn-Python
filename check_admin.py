import sqlite3
from werkzeug.security import generate_password_hash

def check_users():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Get all users
    cursor.execute('SELECT id, email, first_name, last_name, is_admin FROM users')
    users = cursor.fetchall()
    
    print("\nCurrent users in database:")
    print("------------------------")
    for user in users:
        print(f"ID: {user[0]}")
        print(f"Email: {user[1]}")
        print(f"Name: {user[2]} {user[3]}")
        print(f"Is Admin: {user[4]}")
        print("------------------------")
    
    # Check if any user is admin
    admin_exists = any(user[4] for user in users)
    
    if not admin_exists and users:
        # Set the first user as admin
        first_user_id = users[0][0]
        cursor.execute('UPDATE users SET is_admin = 1 WHERE id = ?', (first_user_id,))
        conn.commit()
        print(f"\nSet user {users[0][1]} as admin")
    
    conn.close()

if __name__ == '__main__':
    check_users() 