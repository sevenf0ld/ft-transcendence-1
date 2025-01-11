#!/bin/bash

#until $(curl -s -o /dev/null -w '%{http_code}' http://kibana:5601/api/status | grep -q "200"); do
#    echo "Waiting for Kibana..."
#    sleep 5
#done

#curl -X POST "http://kibana:5601/api/saved_objects/index-pattern" \
#    -H "Content-Type: application/json" \
#    -H "kbn-xsrf: true" \
#	-H "kbn-version: 6.1.0" \
#    -d '{"attributes": {"title": "trans-logstash-*", "timeFieldName": "@timestamp"}}'

curl -X POST "http://localhost:5601/api/saved_objects/index-pattern" \
    -H "Content-Type: application/json" \
	-H "kbn-version: 6.1.0" \
    -d '{"attributes": {"title": "trans-logstash-*", "timeFieldName": "@timestamp"}}'
