#!/bin/bash

until $(curl -s -o /dev/null -w '%{http_code}' http://kibana:5601/api/status | grep -q "200"); do
    echo "Waiting for Kibana initialization..."
    sleep 5
done

CURRENT_DATE=$(date +%Y.%m.%d)
INDEX_PATTERN_TITLE="logs-${CURRENT_DATE}"
RESPONSE=$(curl -s -o /dev/null -w '%{http_code}' -X GET "http://kibana:5601/api/index_patterns/index_pattern/${INDEX_PATTERN_TITLE}")

# https://www.elastic.co/guide/en/kibana/7.17/index-patterns-api-create.html
if [ "$RESPONSE" -eq 200 ]; then
    echo "Index pattern '${INDEX_PATTERN_TITLE}' already exists."
else
    echo "Creating index pattern '${INDEX_PATTERN_TITLE}'..."

    curl -X POST "http://kibana:5601/api/index_patterns/index_pattern" \
        -H "Content-Type: application/json" \
        -H "kbn-xsrf: true" \
        -H "kbn-version: 7.14.0" \
        -d '{
                "override": false,
                "refresh_fields": true,
                "index_pattern": {
                    "title": "'"${INDEX_PATTERN_TITLE}"'",
                    "timeFieldName": "@timestamp"
                }
            }'

# https://www.elastic.co/guide/en/kibana/7.17/index-patterns-api-default-set.html
    curl -X POST "http://kibana:5601/api/index_patterns/default" \
        -H "Content-Type: application/json" \
        -H "kbn-xsrf: true" \
        -H "kbn-version: 7.14.0" \
        -d '{
                "index_pattern_id": "'"${INDEX_PATTERN_TITLE}"'",
                "force": true
            }'

    echo "Index pattern '${INDEX_PATTERN_TITLE}' created and set as default."
fi

# https://www.elastic.co/guide/en/kibana/7.17/saved-objects-api-export.html
# https://www.elastic.co/guide/en/kibana/7.17/saved-objects-api-import.html
# visualization
# dashboard
curl -X POST "http://kibana:5601/api/saved_objects/_import?createNewCopies=true" \
	-H "kbn-xsrf: true" \
	--form file=@"/usr/share/kibana/saved_objects/dashboard.ndjson"
