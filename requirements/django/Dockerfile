FROM python:3.11.5-slim-bullseye

WORKDIR /django

ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY ./webapp/ /django

RUN apt-get update && apt-get install -y netcat

RUN pip install --upgrade pip

#COPY ./requirements.txt /django
RUN pip install --no-cache-dir -r requirements.txt

#COPY ./entrypoint.sh /django/entrypoint.sh
RUN sed -i 's/\r$//g' /django/entrypoint.sh
RUN chmod +x /django/entrypoint.sh

#COPY ./webapp/ /django

ENTRYPOINT ["/django/entrypoint.sh"]
