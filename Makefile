APP_NAME := kidcharts

.PHONY: build run clean run-ui

build:
	go build -o bin/$(APP_NAME) ./cmd

run: build
	./bin/$(APP_NAME)

run-ui:
	npm --prefix ./static run dev

clean:
	rm -rf bin
