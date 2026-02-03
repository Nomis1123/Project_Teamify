#pragma once
/*
 * jwt.h
 * Declarations for the JWT utility functions.
 * Include this anywhere you need to create or verify a token.
 */

#include <string>

// Base64url encode a raw string (no padding, URL-safe alphabet)
std::string base64url_encode(const std::string& input);

// Fake HMAC-SHA256 — illustrative only, not cryptographically secure.
// Swap this out for OpenSSL's HMAC_SHA256 in a real project.
std::string fake_hmac_sha256(const std::string& message, const std::string& secret);

// Build a JWT from a JSON header string, JSON payload string, and secret
std::string create_jwt(const std::string& header_json,
                       const std::string& payload_json,
                       const std::string& secret);

// Verify a JWT against a secret. Returns true if the signature matches.
bool verify_jwt(const std::string& token, const std::string& secret);
