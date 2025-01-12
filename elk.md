## ELK
- [taipei guide](https://github.com/twtrubiks/docker-elk-tutorial?tab=readme-ov-file#docker-logging--elk)
- [guide with references to official images](https://github.com/deviantony/docker-elk?tab=readme-ov-file#how-to-configure-elasticsearch)
- [similar to the above guides' yml configs but with explanations on what each line does](https://github.com/KnightChaser/docker-elk-winlogbeat)
- [without notes](https://github.com/deviantony/docker-elk?tab=readme-ov-file#how-to-configure-elasticsearch)

## PYTHON LOGGING

## ELASTICSEARCH
- [built in users](https://www.elastic.co/guide/en/elasticsearch/reference/current/built-in-users.html)

## LOGSTASH
- [custom logging handler which sends logstash messages](https://github.com/vklochan/python-logstash?tab=readme-ov-file)

## KIBANA
- access the script in container shell `docker run -it --entrypoint /bin/sh <kibana-image>`
- index patterns
    - [create index pattern programatically](https://stackoverflow.com/questions/71615665/how-to-create-index-pattern-in-elastic-seach-programmatically)
        > `curl -X POST "http://localhost:5601/api/saved_objects/index-pattern"     -H "Content-Type: application/json"      -H "kbn-version: 6.1.0"     -d '{"attributes": {"title": "logstash-*", "timeFieldName": "@timestamp"}}'`
    - [elasticsearch-based kibana index patterns](https://github.com/devopsmakers/kibana-index-pattern-creator)
    - [discussion on default pattern](https://discuss.elastic.co/t/how-to-create-a-default-index-pattern-via-kibana-api/238905/2)
    - [export saved object and populate in elasticsearch](https://discuss.elastic.co/t/running-kibana-in-docker-default-index-patterns/206300)
- [curl & depends_on in docker compose](https://thriveread.com/install-curl-in-docker-container/)
