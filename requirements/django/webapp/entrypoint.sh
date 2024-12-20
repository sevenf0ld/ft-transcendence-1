#!/bin/bash

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

#python manage.py flush --no-input # remove in production
#python manage.py makemigrations # remove in production
python manage.py migrate

#if [ "$DEBUG" = "True" ]
#then
#	echo "Skipping collectstatic..."
#else
#	python manage.py collectstatic --no-input
#fi
python manage.py collectstatic --no-input

#python manage.py shell --command="
#from django.contrib.auth import get_user_model;
#User = get_user_model();
#username = '$DJANGO_SUPERUSER_USERNAME';
#password = '$DJANGO_SUPERUSER_PASSWORD';
#if not User.objects.filter(username=username, is_superuser=True).exists():
#    User.objects.create_superuser(username=username, password=password)
#"

python manage.py createsuperuser --no-input

python manage.py shell --command="
from django.contrib.sites.models import Site;
site = Site.objects.get(id=1);
site.name = 'FT_PONG';
site.domain = 'ftpong.com';
site.save();
"

daphne pong.asgi:application -b 0.0.0.0 -p 8000
