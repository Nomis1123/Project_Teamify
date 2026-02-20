# import pytest
import requests
import sys
import http.client
import re

# from flask import Flask, request, jsonify
# from flask_bcrypt import Bcrypt
# from controller.AuthenticationController import register, login, auth_verify, get_me, logout, update_me, bcrypt


ENDPOINT = "http://localhost:5173"
# HOST = "localhost"
# PORT = 5173

# Responses: 200 OK         400 Bad Request     404 DNE
#            201 Created    401 Unauthorized    409 Duplicate


# Mac cannot install pywinty cuz its useless, the equivalent is just pipwin:
# pip install pipwin 
# Also for some reason Flask-JWT-Extended==4.7.1 isn't listed in requirements.txt either

# def test_call_endpoint():
#     response = requests.get(ENDPOINT)
#     # print("endpoint response: ", response) 
#     assert response.status_code == 200
#     pass

# def send_request(method, path, body=None):
#     conn = http.client.HTTPConnection(HOST, PORT)
#     headers = {"Content-Type": "application/json"}

#     if body:
#         body = json.dumps(body)

#     conn.request(method, path, body=body, headers=headers)
#     response = conn.getresponse()

#     data = response.read().decode()
#     print(f"{method} {path} -> {response.status}")
#     if data:
#         print(data)

#     conn.close()


def parse_create(parts):
    if len(parts) != 5:
        print("Insufficient arguments to register")
        return False
    else:
        _, username, email, password, status_code = parts
        payload = {
            "username": username,
            "email": email,
            "password": password
        }

        response = requests.post(ENDPOINT + "/api/auth/register", json=payload)
        if response.status_code == int(status_code):
            return True
        else:
            print("Response:", response.status_code, "Expected:", status_code)
            return False


def parse_login(parts):
    if len(parts) != 4:
        print("Insufficient arguments to login")
        return False
    else:
        _, email, password, status_code = parts
        payload = {
            "email": email,
            "password": password
        }
        response = requests.post(ENDPOINT + "/api/auth/login", json=payload)
        if response.status_code == int(status_code):
            return True
        else:
            print("Response:", response.status_code, "Expected:", status_code)
            return False


def parse_profile(parts):
    # Currently, not functional
    if len(parts) != 2:
        print("Insufficient arguments to get profile")
        return False
    else:
        _, status_code = parts
        # header = {
        #     "Authorization": f"Bearer {token}"
        # }
        # print(header)
        response = requests.get(ENDPOINT + "/api/user/me")
        if response.status_code == int(status_code):
            return True
        else:
            print("Response:", response.status_code, "Expected:", status_code)
            return False


def parse_update(parts):
    # Currently, not functional
    if len(parts) < 2:
        print("Insufficient arguments for update")
        return False
    else:
        target = parts[1]
        if target == "password":
            if len(parts) == 5:
                _, _, _, new_pass, status_code = parts
                payload = {
                    "old password": target,
                    "new password": new_pass,
                    "confirm new password": new_pass
                }
                response = requests.put(ENDPOINT + "/api/user/me", json=payload)
                if response.status_code == int(status_code):
                    return True
                else:
                    print("Response:", response.status_code, "Expected:", status_code)
                    return False
            else:
                print("Insufficient arguments for updating password")
                return False
        else:
            if len(parts) == 4:
                _, _, new_target, status_code = parts
                if target == "username":
                    payload = {
                        "username": target
                    }
                else:
                    payload = {
                        "email": target
                    }
                response = requests.put(ENDPOINT + "/api/user/me", json=payload)
                if response.status_code == int(status_code):
                    return True
                else:
                    print("Response:", response.status_code, "Expected:", status_code)
                    return False
                
            else:
                print("Insufficient arguments for updating username/email")
                return False


def parse_validate(parts):
    # Currently, not functional
    return

def parse_line(line):
    parts = line.strip().split()
    if not parts:
        return

    command = parts[0]

    if command == "create":
        return parse_create(parts)
    elif command == "login":
        return parse_login(parts)
    elif command == "profile":
        return parse_profile(parts)
    elif command == "update":
        return parse_update(parts)
    else:
        print(f"Unknown command: {command}")
        return False


# # --- Routes ---

# # 1. Auth Operations
# app.add_url_rule('/api/auth/register', view_func=register,  methods=['POST'])
# app.add_url_rule('/api/auth/login',view_func=login, methods=['POST'])
# app.add_url_rule('/api/auth/verify/<token>', view_func=auth_verify, methods=['GET'])


# # 2. Logout (Added to match Reference Sheet)
# app.add_url_rule('/api/auth/logout',  view_func=logout, methods=['POST'])

# # 3. User Info & Profile Update
# app.add_url_rule('/api/user/me',  view_func=get_me, methods=['GET'])


# # 4. Update User Profile (Added to match Reference Sheet)
# app.add_url_rule('/api/user/me', view_func=update_me,  methods=['PUT'])
# user_data = {"username": "Bob", "email": "bob123@gmail.com", "password": "1234"}

# response = requests.get(ENDPOINT)
# data = response.json
# print("data: ", data)

def main():
    line_num = 0
    total_passed = 0
    if len(sys.argv) != 2:
        print("Usage: python test_BackendApi.py payload_file.txt")
        return

    payload_file = sys.argv[1]

    with open(payload_file, "r") as file:
        for line in file:
            line_num += 1
            if parse_line(line):
                total_passed += 1
                print("line: ", line_num, " passed")
                
    print("total passed tests:", total_passed, " out of:", line_num)


if __name__ == '__main__':
    main()
    print("Finished running tests")
