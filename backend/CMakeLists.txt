cmake_minimum_required(VERSION 3.10)
project(jwt_demo)

# Where to find the headers in include/
include_directories(include)

# Compile both source files into one executable
add_executable(jwt_demo
    src/main.cpp
    src/jwt.cpp
)
