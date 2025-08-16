# Use Go official image
FROM golang:1.24.4-alpine

# Install git and ca-certificates
RUN apk add --no-cache git ca-certificates

# Set working directory
WORKDIR /app

# Copy source code first
COPY . .

# Initialize go module if go.mod doesn't exist
RUN if [ ! -f go.mod ]; then go mod init wongnok; fi

# Download dependencies and tidy up
RUN go mod tidy || true
RUN go mod download || true

# Expose port 8080
EXPOSE 8080

# Run Go application from cmd/server/main.go
CMD ["go", "run", "cmd/server/main.go"]