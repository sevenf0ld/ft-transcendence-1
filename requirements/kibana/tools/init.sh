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
curl -X POST "http://kibana:5601/api/saved_objects/_import?createNewCopies=true" \
	-H "kbn-xsrf: true" \
	--form file=@"/usr/share/kibana/saved_objects/dashboard.ndjson"

# https://www.elastic.co/guide/en/elasticsearch/reference/7.14/getting-started-index-lifecycle-management.html
curl -X PUT "http://elasticsearch:9200/_ilm/policy/logs_policy?pretty" \
	-H "Content-Type: application/json" \
	-d'
	{
	  "policy": {
	    "phases": {
	      "hot": {
	        "actions": {
	          "rollover": {
	            "max_primary_shard_size": "500MB",
	            "max_age": "10d"
	          }
	        }
	      },
	      "delete": {
	        "min_age": "20d",
	        "actions": {
	          "delete": {}
	        }
	      }
	    }
	  }
	}
	'

#curl -X PUT "http://elasticsearch:9200/_index_template/timeseries_template?pretty" \
#	-H "Content-Type: application/json" \
#	-d'
#	{
#	  "index_patterns": ["timeseries"],
#	  "data_stream": { },
#	  "template": {
#	    "settings": {
#	      "number_of_shards": 1,
#	      "number_of_replicas": 1,
#	      "index.lifecycle.name": "timeseries_policy"
#	    }
#	  }
#	}
#	'

#curl -X POST "http://elasticsearch:9200/timeseries/_doc?pretty" \
#	-H "Content-Type: application/json" \
#	-d'
#	{
#	  "message": "logged the request",
#	  "@timestamp": "1591890611"
#	}
#	'

curl -X PUT "http://elasticsearch:9200/_index_template/logs_template?pretty" \
	-H "Content-Type: application/json" \
	-d'
	{
	  "index_patterns": ["logs-*"],
	  "template": {
	    "settings": {
	      "number_of_shards": 1,
	      "number_of_replicas": 1,
	      "index.lifecycle.name": "logs_policy",
	      "index.lifecycle.rollover_alias": "logs"
	    }
	  }
	}
	'

curl -X PUT "http://elasticsearch:9200/logs-000001?pretty" \
	-H "Content-Type: application/json" \
	-d'
	{
	  "aliases": {
	    "logs": {
	      "is_write_index": true
	    }
	  }
	}
	'
