# NOTE

1. remove .env before submission (./DOCKER/.env)
1. put latest django_backend into ./DOCKER/web/ before submission
    - REASON : it doesn't work with '../../' paths, so can't put in root directory
1. ./DOCKER/web/config/requirments.txt is used and ref from django_backend/src/requirements.txt
    - so the django_backend/src/requirements.txt is not used
    - ./DOCKER/web/config/requirements.txt has added some prometheus and grafana stuff
- there is a new prometheus_urls.py in the django_backend/src/transcendence/ folder
- modified the django_backend/src/transcendence/urls.py, requirements.txt and settings.py to include the prometheus stuff
