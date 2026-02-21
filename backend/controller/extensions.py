from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
import psycopg2
from flask import jsonify

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
