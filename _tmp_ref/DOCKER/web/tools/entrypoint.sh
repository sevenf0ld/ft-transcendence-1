#!/bin/bash
# entrypoint.sh

# exit on any error
set -e 

# run django commands
python manage.py makemigrations # remove when deploying in submission
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000
