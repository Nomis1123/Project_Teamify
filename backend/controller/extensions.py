from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
import psycopg2

jwt = JWTManager()
bcrypt = Bcrypt()

DB_CONFIG = {
    "dbname": "teamify_db",
    "user": "postgres",
    "password": "password",
    "host": "localhost",
    "port": 5432
}


def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)
