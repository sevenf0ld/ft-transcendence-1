FROM docker.elastic.co/kibana/kibana:7.14.0

WORKDIR /usr/local/bin

USER root

COPY ./tools/init.sh /usr/local/bin/init.sh

RUN ["chmod", "+x", "/usr/local/bin/init.sh"]

#USER kibana_system

ENTRYPOINT ["/usr/local/bin/init.sh"]
