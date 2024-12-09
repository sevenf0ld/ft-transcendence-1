all: create_dirs up

# Define variables
DOCKER_PATH := ./DOCKER
DB_PATH := ./DATABASE
DB_POSTGRES := ./DATABASE/postgres_data
DB_ES := ./DATABASE/esdata
DB_LOGS := ./DOCKER/logs
LOG_PATH := ./DOCKER/logs
STATIC_PATH := ./DATABASE/staticfiles

#======================================#
#======================================#
#======================================#
COMPOSE_FILE = ./docker-compose.yml

CMD = @docker compose -f

# Target to create directories
create_dirs:
	@if [ -d "$(DB_PATH)" ]; then \
		echo "Directory $(DB_PATH) exists."; \
	else \
		mkdir -p "$(DB_PATH)"; \
		echo "Directory $(DB_PATH) created."; \
	fi
	@if [ -d "$(DB_POSTGRES)" ]; then \
		echo "Directory $(DB_POSTGRES) exists."; \
	else \
		mkdir -p "$(DB_POSTGRES)"; \
		echo "Directory $(DB_POSTGRES) created."; \
	fi
	@if [ -d "$(DB_ES)" ]; then \
		echo "Directory $(DB_ES) exists."; \
	else \
		mkdir -p "$(DB_ES)"; \
		echo "Directory $(DB_ES) created."; \
	fi
	@if [ -d "$(DB_LOGS)" ]; then \
		echo "Directory $(DB_LOGS) exists."; \
	else \
		mkdir -p "$(DB_LOGS)"; \
		echo "Directory $(DB_LOGS) created."; \
	fi
	@if [ -d "$(STATIC_PATH)" ]; then \
		echo "Directory $(STATIC_PATH) exists."; \
	else \
		mkdir -p "$(STATIC_PATH)"; \
		echo "Directory $(STATIC_PATH) created."; \
	fi

up:
	@docker compose -f ./docker-compose.yml up --build

down:
	@docker compose -f ./docker-compose.yml down

git-reset:
	@rm -rf ./*; git restore .

re: fclean all

clean:
	@docker stop $$(docker ps -qa);\
	docker system prune -a

#======================================#
#======================================#
#======================================#
fclean:
	$(CMD) $(COMPOSE_FILE) down -v --rmi all
	docker system prune -a -f --volumes
	rm -rf $(LOG_PATH)

.PHONY: all re down clean fclean
