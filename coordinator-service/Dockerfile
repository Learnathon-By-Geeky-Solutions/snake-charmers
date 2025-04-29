FROM golang:1.24.0-alpine AS dev

WORKDIR /app

# Install development tools and dependencies
RUN apk add --no-cache git make gcc libc-dev

COPY go.mod go.sum* ./

RUN go mod download

COPY . .

RUN go build -tags dev -o /app/bin/server ./cmd

EXPOSE 8080
# Use this as the default command for development
CMD ["go", "run", "./cmd/main"]



FROM alpine:3.19 AS prod

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy the compiled binary from the development stage
COPY --from=dev /app/bin/server /app/server

# # Copy any required assets (configs, templates, static files, etc.)
# COPY --from=dev /app/configs /app/configs
# COPY --from=dev /app/static /app/static

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Expose the port your application runs on
EXPOSE 8080

# Run the application
CMD ["/app/server"]