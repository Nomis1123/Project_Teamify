from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
import psycopg2
from flask import jsonify
import os

jwt = JWTManager()
bcrypt = Bcrypt()

DB_CONFIG = {
    "dbname": "teamify_db",
    "user": "postgres",
    "password": "password",
    "host": "localhost",
    "port": 5432
}

DB_CONFIG["dbname"] = os.environ.get("DB_NAME")
DB_CONFIG["user"] = os.environ.get("DB_USER")
DB_CONFIG["password"] = os.environ.get("DB_PASSWORD")
DB_CONFIG["host"] = os.environ.get("DB_HOST")
DB_CONFIG["port"] = os.environ.get("DB_PORT")


def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)


# Custom function overrides when there are token errors.
@jwt.invalid_token_loader
def custom_invalid_token_callback(error_string):
    return jsonify({
        "status": f"Invalid token signature or format: {error_string}",
    }), 401

# This catches tokens that have timed out
@jwt.expired_token_loader
def custom_expired_token_callback(jwt_header, jwt_payload):
    return jsonify({
        "status": "Token has expired, please login again.",
    }), 401

# This catches requests with no "Authorization" header at all
@jwt.unauthorized_loader
def custom_unauthorized_callback(error_string):
    return jsonify({
        "status": f"Authorization header missing: {error_string}",
    }), 401
