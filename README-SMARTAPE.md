# МКТУ SmartApe Deploy
## Commands:
docker build -t mktu .
docker run -d --name mktu --restart unless-stopped -p 80:3000 mktu
