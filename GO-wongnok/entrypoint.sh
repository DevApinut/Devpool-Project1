#!/bin/sh

# รัน goose up (แก้ไข connection string ให้ตรงกับ postgres ใน docker-compose)
goose up

# รัน Go server
exec go run cmd/server/main.go