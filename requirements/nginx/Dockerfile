FROM debian:bullseye

RUN apt-get update -y \
	&& apt-get upgrade -y \
	&& apt-get install -y nginx \
	&& apt-get install -y openssl \
	&& rm -rf /var/lib/apt/lists/*

RUN mkdir -p /etc/nginx/ssl/private/ /etc/nginx/ssl/certs/ \
	&& openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
	-keyout /etc/nginx/ssl/private/ftpong.42.kl.key \
	-out /etc/nginx/ssl/certs/ftpong.42.kl.crt \
	-subj "/C=MY/ST=KL/L=SJ/O=42/OU=42MY/CN=ftpong.com"

COPY ./nginx.conf /etc/nginx/conf.d/

EXPOSE 1100

CMD ["nginx", "-g", "daemon off;"]
