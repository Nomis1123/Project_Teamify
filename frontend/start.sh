#!/bin/bash

# go to project directory
cd "$(dirname "$0")"

# install dependencies if needed
npm install

# start dev server
npm run dev