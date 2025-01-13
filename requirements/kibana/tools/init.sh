#!/bin/bash

until $(curl -s -o /dev/null -w '%{http_code}' http://kibana:5601/api/status | grep -q "200"); do
    echo "Waiting for Kibana initialization..."
    sleep 5
done

CURRENT_DATE=$(date +%Y.%m.%d)

# https://www.elastic.co/guide/en/kibana/7.17/index-patterns-api-create.html
curl -X POST "http://<kibana_host>:<port>/api/index_patterns/index_pattern" \
	-H "Content-Type: application/json" \
	-H "kbn-xsrf: true" \
	-H "kbn-version: 7.14.0" \
	-d '{
        "override": false,
        "refresh_fields": true,
        "index_pattern": {
          "title": "logs-*"
        }
      }'

# https://www.elastic.co/guide/en/kibana/7.17/index-patterns-api-default-set.html
curl -X POST "http://kibana:5601/api/saved_objects/index-pattern" \
	-H "Content-Type: application/json" \
	-H "kbn-xsrf: true" \
	-H "kbn-version: 7.14.0" \
	 -d '{
        "index_pattern_id": "logs-*",
        "force": true
      }'

# https://www.elastic.co/guide/en/kibana/7.17/saved-objects-api.html
#curl -X POST "http://kibana:5601/api/saved_objects/index-pattern" \
#    -H "Content-Type: application/json" \
#    -H "kbn-xsrf: true" \
#    -H "kbn-version: 7.14.0" \
#    -d "{\"attributes\": {\"title\": \"logs-$CURRENT_DATE\", \"timeFieldName\": \"@timestamp\"}}"
