start-backend:
	npx start-server -p 5001
start-frontend:
	make -C frontend start
install:
	npm ci --legacy-peer-deps
	make -C frontend install --legacy-peer-deps
start:
	make start-backend & make start-frontend