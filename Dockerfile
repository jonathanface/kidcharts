FROM node:22-alpine AS frontend-builder
WORKDIR /app/static
COPY static/package*.json ./
RUN npm ci
COPY static/ ./
RUN npm run build

FROM golang:1.24-alpine AS backend-builder
WORKDIR /src
ENV CGO_ENABLED=0 GOOS=linux
COPY go.mod go.sum ./
RUN go mod download
COPY cmd/ ./cmd/
COPY --from=frontend-builder /app/static/dist ./static/dist
RUN go build -ldflags="-s -w" -o /out/kidcharts ./cmd

FROM gcr.io/distroless/base-debian12
WORKDIR /app
COPY --from=backend-builder /out/kidcharts ./kidcharts
COPY --from=backend-builder /src/static/dist ./static/dist
ENV PORT=80
EXPOSE 80
CMD ["./kidcharts"]
