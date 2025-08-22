FROM golang:1.24.4-alpine

RUN apk add --no-cache git ca-certificates

WORKDIR /app

# Copy go mod files ก่อน (สำหรับ caching)
COPY go.mod go.sum ./

# Download dependencies (จะ cache layer นี้ถ้า go.mod ไม่เปลี่ยน)
RUN if [ ! -f go.mod ]; then go mod init wongnok; fi
RUN go mod tidy || true
RUN go mod download || true

# ติดตั้ง goose (จะ cache layer นี้)
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

# Copy source code ทีหลัง (เฉพาะส่วนนี้จะ rebuild เมื่อ code เปลี่ยน)
COPY . .

EXPOSE 8080

# ใช้ shell command โดยตรงแทน script file
CMD ["sh", "-c", "echo 'Running migrations...' && goose up && echo 'Starting Go server...' && exec go run cmd/server/main.go"]