#======================================#
#======================================#
#======================================#
NAME = transcendence

COMPOSE_FILE = ./docker-compose.yml

CMD = docker compose -f

PDF = docker-compose up --build

run: $(NAME)

pdf: setup
	$(PDF)

setup:
	#mkdir -p $(HOME)/data/vol_django
	mkdir -p $(HOME)/data/vol_pg
	mkdir -p ./LOGGER

$(NAME): setup
	$(CMD) $(COMPOSE_FILE) up

down:
	$(CMD) $(COMPOSE_FILE) down

build:
	$(CMD) $(COMPOSE_FILE) build

fclean:
	$(CMD) $(COMPOSE_FILE) down -v --rmi all
	docker system prune -a -f --volumes

#======================================#
#============CHECK LOGS================#
#======================================#
ps:
	$(CMD) $(COMPOSE_FILE) ps

logs-django:
	$(CMD) $(COMPOSE_FILE) logs django

logs-postgres:
	$(CMD) $(COMPOSE_FILE) logs postgres

logs-nginx:
	$(CMD) $(COMPOSE_FILE) logs nginx

logs-elasticsearch:
	$(CMD) $(COMPOSE_FILE) logs elasticsearch

logs-logstash:
	$(CMD) $(COMPOSE_FILE) logs logstash

logs-kibana:
	$(CMD) $(COMPOSE_FILE) logs kibana

#======================================#
#===============RESTART================#
#======================================#
r-django:
	$(CMD) $(COMPOSE_FILE) restart django

r-postgres:
	$(CMD) $(COMPOSE_FILE) restart postgres

r-nginx:
	$(CMD) $(COMPOSE_FILE) restart nginx

r-elasticsearch:
	$(CMD) $(COMPOSE_FILE) restart elasticsearch

r-logstash:
	$(CMD) $(COMPOSE_FILE) restart logstash

r-kibana:
	$(CMD) $(COMPOSE_FILE) restart kibana

#======================================#
#===============SHELL==================#
#======================================#
django:
	docker exec -it django /bin/bash

postgres:
	docker exec -it postgres /bin/bash

nginx:
	docker exec -it nginx /bin/bash

elasticsearch:
	docker exec -it elasticsearch /bin/bash

logstash:
	docker exec -it logstash /bin/bash

kibana:
	docker exec -it kibana /bin/bash

#======================================#
#======================================#
#======================================#
eval:
	docker stop $$(docker ps -qa); \
		docker rm $$(docker ps -qa); \
		docker rmi -f $$(docker images -qa); \
		docker volume rm $$(docker volume logstash -q); \
		docker network rm $$(docker network logstash -q) 2>/dev/null
