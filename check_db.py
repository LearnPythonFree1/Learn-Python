import sqlite3

def check_users():
    try:
        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users')
        users = cursor.fetchall()
        print("\nUsers in database:")
        for user in users:
            print(f"ID: {user[0]}")
            print(f"Email: {user[1]}")
            print(f"First Name: {user[3]}")
            print(f"Last Name: {user[4]}")
            print(f"Is Admin: {user[5]}")
            print("---")
        conn.close()
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    check_users() 