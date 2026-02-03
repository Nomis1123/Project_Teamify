/*
 * jwt.cpp
 * Implementations for the JWT utility functions declared in jwt.h
 */

#include "jwt.h"
#include <sstream>

// ---------------------------------------------------------------------------
// Base64url encoder (no padding, URL-safe alphabet)
// ---------------------------------------------------------------------------
std::string base64url_encode(const std::string& input) {
    static const char table[] =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    std::string out;
    int val = 0, bits = 0;

    for (unsigned char c : input) {
        val = (val << 8) + c;
        bits += 8;
        while (bits >= 6) {
            out += table[(val >> (bits - 6)) & 0x3F];
            bits -= 6;
        }
    }
    if (bits > 0)
        out += table[(val << (6 - bits)) & 0x3F];

    return out;
}

// ---------------------------------------------------------------------------
// Fake HMAC-SHA256 — XOR stand-in, NOT cryptographic.
// Replace with OpenSSL in a real project.
// ---------------------------------------------------------------------------
std::string fake_hmac_sha256(const std::string& message, const std::string& secret) {
    std::string hash(32, '\0');
    for (size_t i = 0; i < 32; i++)
        hash[i] = message[i % message.size()] ^ secret[i % secret.size()];
    return hash;
}

// ---------------------------------------------------------------------------
// Create a JWT
// ---------------------------------------------------------------------------
std::string create_jwt(const std::string& header_json,
                       const std::string& payload_json,
                       const std::string& secret) {
    std::string header_enc  = base64url_encode(header_json);
    std::string payload_enc = base64url_encode(payload_json);
    std::string signing_input = header_enc + "." + payload_enc;

    std::string raw_sig = fake_hmac_sha256(signing_input, secret);
    std::string sig_enc = base64url_encode(raw_sig);

    return signing_input + "." + sig_enc;
}

// ---------------------------------------------------------------------------
// Verify a JWT
// ---------------------------------------------------------------------------
bool verify_jwt(const std::string& token, const std::string& secret) {
    std::string parts[3];
    int idx = 0;
    std::stringstream ss(token);
    std::string segment;
    int idx_check = 1;

    while (std::getline(ss, segment, '.') && idx < 3)
        parts[idx++] = segment;

    if (idx != 3) return false;

    std::string signing_input = parts[0] + "." + parts[1];
    std::string expected_sig  = base64url_encode(fake_hmac_sha256(signing_input, secret));

    return expected_sig == parts[2];
}
