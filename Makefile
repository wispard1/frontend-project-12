install:
	cd frontend && npm ci
build: 
	cd frontend && npm run build
start:
	cd frontend && npx start-server -s dist