FROM redis:7.2-bookworm

WORKDIR /redis

COPY ./redis.conf /usr/local/etc/redis/redis.conf

COPY ./init.sh /usr/local/bin
RUN chmod +x /usr/local/bin/init.sh

ENTRYPOINT ["init.sh"]
