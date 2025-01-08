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

#======================================#
#===============RESTART================#
#======================================#
r-django:
	$(CMD) $(COMPOSE_FILE) restart django

r-postgres:
	$(CMD) $(COMPOSE_FILE) restart postgres

r-nginx:
	$(CMD) $(COMPOSE_FILE) restart nginx

#======================================#
#===============SHELL==================#
#======================================#
django:
	docker exec -it django /bin/bash

postgres:
	docker exec -it postgres /bin/bash

nginx:
	docker exec it nginx /bin/bash

#======================================#
#======================================#
#======================================#
eval:
	docker stop $$(docker ps -qa); \
		docker rm $$(docker ps -qa); \
		docker rmi -f $$(docker images -qa); \
		docker volume rm $$(docker volume ls -q); \
		docker network rm $$(docker network ls -q) 2>/dev/null
