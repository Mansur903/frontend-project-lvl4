start-backend:
	npx start-server -p 5001
start-frontend:
	make -C frontend start
install:
	npm ci
	make -C frontend install
start:
	make start-backend & make start-frontend