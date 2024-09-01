#!/bin/bash

cd server
npm ci
npm run build
npm run start_cheap