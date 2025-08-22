FROM golang:1.24.4-alpine

RUN apk add --no-cache git ca-certificates

WORKDIR /app

COPY . .

RUN if [ ! -f go.mod ]; then go mod init wongnok; fi
RUN go mod tidy || true
RUN go mod download || true

# ติดตั้ง goose
RUN go install github.com/pressly/goose/v3/cmd/goose@latest

EXPOSE 8080

# ใช้ entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]