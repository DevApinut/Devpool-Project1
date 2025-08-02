# go-app/Dockerfile
FROM golang:1.24

WORKDIR /app

# ติดตั้ง air และเพิ่มเข้า PATH
RUN go install github.com/air-verse/air@v1.60.0 && \
    ln -s /go/bin/air /usr/local/bin/air

COPY . .

EXPOSE 8080

CMD ["air"]
