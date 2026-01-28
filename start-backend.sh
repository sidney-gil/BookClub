#!/bin/bash
# Railway start script for backend

cd backend
./mvnw clean package -DskipTests
java -jar target/*.jar --server.port=$PORT
