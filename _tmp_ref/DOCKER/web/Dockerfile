FROM python:3.11.5-slim-bullseye

ENV PIP_DISABLE_PIP_VERSION_CHECK 1
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY ./conf/requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY ./django_backend/src /app

COPY ./tools/entrypoint.sh /app/entrypoint.sh

RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]
