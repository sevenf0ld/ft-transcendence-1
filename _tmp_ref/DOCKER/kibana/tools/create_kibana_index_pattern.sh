#!/bin/bash

until $(curl -s -o /dev/null -w '%{http_code}' http://kibana:5601/api/status | grep -q "200"); do
    echo "Waiting for Kibana..."
    sleep 5
done

curl -X PUT "http://elasticsearch:9200/_ilm/policy/log-retention-policy" \
    -H "Content-Type: application/json" \
    -u "elastic:${ELASTIC_PASSWORD}" \
    -d "@/usr/share/elasticsearch/config/ilm_policy.json"

curl -X PUT "http://elasticsearch:9200/_template/django-logs-template" \
    -H "Content-Type: application/json" \
    -d '{
      "index_patterns": ["django-logs-*"],
      "settings": {
        "index.lifecycle.name": "log-retention-policy",
        "index.lifecycle.rollover_alias": "django-logs"
      }
    }'

curl -X POST "http://kibana:5601/api/saved_objects/index-pattern" \
    -H "kbn-xsrf: true" \
    -H "Content-Type: application/json" \
    -d '{"attributes": {"title": "django-logs-*", "timeFieldName": "@timestamp"}}'
