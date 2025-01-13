## ELK
- [taipei guide](https://github.com/twtrubiks/docker-elk-tutorial?tab=readme-ov-file#docker-logging--elk)
- [guide with references to official images](https://github.com/deviantony/docker-elk?tab=readme-ov-file#how-to-configure-elasticsearch)
- [similar to the above guides' yml configs but with explanations on what each config line does](https://github.com/KnightChaser/docker-elk-winlogbeat)
- [without notes](https://github.com/deviantony/docker-elk?tab=readme-ov-file#how-to-configure-elasticsearch)
- [es and lg with minimal notes](https://medium.com/@quangdutran809/elasticsearch-docker-compose-with-pre-loaded-data-from-json-file-using-logstash-58e86ed6be05)
- non-docker related [es and kb using python with minimal notes](https://codezup.com/building-a-real-time-analytics-dashboard-with-elasticsearch-and-kibana/)

## PYTHON LOGGING

## ELASTICSEARCH
- [official docker compose guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-compose-file)
- [built in users](https://www.elastic.co/guide/en/elasticsearch/reference/current/built-in-users.html)
- [logstash to different elasticsearch indices](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-elasticsearch.html#_writing_to_different_indices_best_practices)
- get the logstash created elasticsearch indices `curl -X GET "http://localhost:9200/logs-*/_search?pretty=true&q=*:*"
`
- information on indices `curl -X GET "http://localhost:9200/_cat/indices?v"`
- [elasticsearch rabbithole](https://blog.patricktriest.com/text-search-docker-elasticsearch/)
- [security](https://www.elastic.co/guide/en/elasticsearch/reference/current/security-settings.html)
- [disable production mode and bootstrap checks](https://www.elastic.co/guide/en/elasticsearch/reference/current/bootstrap-checks.html)
- [scaling nodes](https://github.com/deviantony/docker-elk/wiki/Elasticsearch-cluster)
- [yellow health](https://stackoverflow.com/a/60819899)
- information on cluster health `curl http://localhost:9200/_cluster/health`

## LOGSTASH
- [official docker guide](https://www.elastic.co/guide/en/logstash/current/docker-config.html)
- [official monitoring API guide](https://www.elastic.co/guide/en/logstash/current/monitoring-logstash.html)
- [custom logging handler which sends logstash messages](https://github.com/vklochan/python-logstash?tab=readme-ov-file)
- input
    - [from a file](https://www.elastic.co/guide/en/logstash/current/plugins-inputs-file.html)
- data transformation and enrichment via filter
    - [date](https://github.com/logstash-plugins/logstash-filter-date/blob/main/docs/index.asciidoc)
    - [elasticsearch](https://github.com/logstash-plugins/logstash-filter-elasticsearch/blob/main/docs/index.asciidoc)
    - [http](https://github.com/logstash-plugins/logstash-filter-http/blob/main/docs/index.asciidoc)
    - [json](https://github.com/logstash-plugins/logstash-filter-json/blob/main/docs/index.asciidoc)
    - [metrics](https://github.com/logstash-plugins/logstash-filter-metrics/blob/main/docs/index.asciidoc)
    - [mutate](https://github.com/logstash-plugins/logstash-filter-mutate/blob/main/docs/index.asciidoc)
    - [transform](https://www.elastic.co/guide/en/logstash/current/core-operations.html)
    - [enrich](https://www.elastic.co/guide/en/logstash/current/lookup-enrichment.html)
- [parse nested JSONs](https://stackoverflow.com/a/43234427)
- [modify fields from logs](https://www.elastic.co/guide/en/logstash/current/plugins-filters-mutate.html)
    - applicable to pipeline metadata in output logs
    - @timestamp should not be removed as it will affect the elasticsearch indices naming
- output
    - [to a file](https://www.elastic.co/guide/en/logstash/current/plugins-outputs-file.html) temporarily for checking purposes

## KIBANA
- [official docker compose guide](https://www.elastic.co/guide/en/kibana/current/docker.html), single and multi elasticsearch nodes included
- [official kibana API](https://www.elastic.co/guide/en/kibana/7.17/api.html)
- access the script in container shell `docker run -it --entrypoint /bin/sh <kibana-image>`
- index patterns
    - [create index pattern programatically](https://stackoverflow.com/questions/71615665/how-to-create-index-pattern-in-elastic-seach-programmatically)
        > `curl -X POST "http://localhost:5601/api/saved_objects/index-pattern"     -H "Content-Type: application/json"      -H "kbn-version: 7.14.0"     -d '{"attributes": {"title": "logstash-*", "timeFieldName": "@timestamp"}}'`
    - [elasticsearch-based kibana index patterns](https://github.com/devopsmakers/kibana-index-pattern-creator)
    - [discussion on default pattern](https://discuss.elastic.co/t/how-to-create-a-default-index-pattern-via-kibana-api/238905/2)
    - [export saved object and populate in elasticsearch](https://discuss.elastic.co/t/running-kibana-in-docker-default-index-patterns/206300)
- [curl & depends_on in docker compose](https://thriveread.com/install-curl-in-docker-container/)
- logstash monitoring at `http://localhost:5601/app/monitoring`
- visualization
    - [NDJSON file](https://stackoverflow.com/a/69061674)
        - [example](https://forum.opensearch.org/t/can-we-use-kibana-rest-apis-to-create-the-dashboards-programmatically-in-opensearchdashboard/7397/3)
    - [reddit suggestions](https://www.reddit.com/r/elasticsearch/comments/13jg2kg/create_visualizations_and_add_them_in_dashboard/)
    - [2014 github issue](https://github.com/elastic/kibana/issues/1190)
    - [request data directly from elasticsearch](https://discuss.elastic.co/t/get-data-from-visualize-dashboard-using-the-api/83684/8)
    - [elastic stack](https://discuss.elastic.co/t/building-kibana-dashboard-dynamically/33713)
    - [search, visualization, dashboard](https://discuss.elastic.co/t/how-to-create-visualization-on-the-fly-using-a-script/31255/4)
    - [modifiable sizer to visualizer](https://github.com/mohclips/elastic_index_sizer/blob/main/src/get_size.py)
