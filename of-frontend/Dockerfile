# Frontend
FROM nginx:latest
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl/cert.pem /etc/nginx/ssl/cert.pem
COPY ssl/key.pem /etc/nginx/ssl/key.pem
COPY ssl/dhparam.pem /etc/nginx/ssl/dhparam.pem
