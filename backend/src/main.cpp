/*
 * main.cpp
 * Entry point — uses the JWT functions from jwt.h
 */

#include <iostream>
#include <string>
#include "jwt.h"

int main() {
    std::string header  = R"({"alg":"HS256","typ":"JWT"})";
    std::string payload = R"({"sub":"user123","name":"Alice","admin":true,"iat":1706000000})";
    std::string secret  = "my-secret-key";

    std::cout << "=== JWT Demo ===\n\n";

    // Raw JSON
    std::cout << "Header  (raw) : " << header  << "\n";
    std::cout << "Payload (raw) : " << payload << "\n";
    std::cout << "Secret        : " << secret  << "\n\n";

    // Encoded parts
    std::cout << "Header  (b64) : " << base64url_encode(header)  << "\n";
    std::cout << "Payload (b64) : " << base64url_encode(payload) << "\n\n";

    // Create token
    std::string token = create_jwt(header, payload, secret);
    std::cout << "Generated JWT :\n  " << token << "\n\n";

    // Verify — valid token
    std::cout << "Verification  : " << (verify_jwt(token, secret) ? "PASS" : "FAIL") << "\n";

    // Verify — tampered token
    std::string tampered = token;
    tampered[20] = (tampered[20] == 'A') ? 'B' : 'A';
    std::cout << "Tampered JWT  :\n  " << tampered << "\n";
    std::cout << "Verification  : " << (verify_jwt(tampered, secret) ? "PASS" : "FAIL") << "\n\n";

    // Verify — wrong secret
    std::cout << "Wrong secret  : " << (verify_jwt(token, "wrong-key") ? "PASS" : "FAIL") << "\n";

    return 0;
}
