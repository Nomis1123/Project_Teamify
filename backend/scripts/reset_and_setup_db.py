import psycopg2
from psycopg2 import sql
import os

'''
IMPORTANT: 

1. run the following command to change the postgres password

    sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"

2. edit the file: /etc/postgresql/{version}/main/pg_hba.conf

    change the line
        local   all             all                                     peer

    to 

        local   all             all                                     scram-sha-256

    and then run


'''
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

DB_INIT_FILE = os.path.join(SCRIPT_DIR, '../model/create_db.sql')
TABLE_SCHEMA_FILE = os.path.join(SCRIPT_DIR, '../model/create_tables.sql')

# Settings
ADMIN_DB = "postgres"               # Default maintenance DB
ADMIN_USER = "postgres"             # Default superuser


def run_sql_file(cursor, filename):
    """Reads the entire .sql file and executes it as a single block."""
    print(f"--- Executing {filename} ---")
    try:
        with open(filename, 'r') as f:
            sql_content = f.read()

            # Ensure the file isn't empty before sending to Postgres
            if sql_content.strip():
                cursor.execute(sql_content)
            else:
                print(f"Warning: {filename} is empty, skipping.")

    except FileNotFoundError:
        print(f"Error: The file {filename} was not found.")
        raise 
    except Exception as e:
        print(f"Error executing {filename}: {e}")
        raise

def reset_and_setup_database():
    conn = None
    try:
        # STAGE 1: Create Database & User (Connect as Superuser)
        # We connect to 'postgres' to run the 'CREATE DATABASE' commands

        conn = psycopg2.connect(dbname=ADMIN_DB, 
                                user=ADMIN_USER, 
                                host="localhost",
                                password="password")

        conn.autocommit = True 

        with conn.cursor() as cur:

            print("Resetting database...")
            # You can run these as raw strings instead of a file if you prefer
            cur.execute("DROP DATABASE IF EXISTS teamify_db;")
            cur.execute("CREATE DATABASE teamify_db;")

        conn.close()

        # STAGE 2: Create Tables (Connect to the NEWLY created DB)
        # We'll assume your create_db.sql named the db 'my_flask_db'
        # and created a user 'my_flask_user'

        print("Connecting to new database to create tables...")
        conn = psycopg2.connect(
            dbname="teamify_db", 
            user="postgres", 
            host="localhost",
            password="password"
        )
        with conn.cursor() as cur:
            run_sql_file(cur, TABLE_SCHEMA_FILE)
        conn.commit()
        
        print("Database and Tables created successfully.")

    except Exception as e:
        print(f"Error during setup: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    reset_and_setup_database()
