FROM docker.elastic.co/kibana/kibana:7.14.0

WORKDIR /usr/local/bin

USER root

COPY ./tools/create_kibana_index_pattern.sh /usr/local/bin/create_kibana_index_pattern.sh

RUN chmod +x /usr/local/bin/create_kibana_index_pattern.sh

ENTRYPOINT ["/usr/local/bin/create_kibana_index_pattern.sh"]
