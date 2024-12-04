# Makefile
#--------------------------------------------------#
# dev-notes
# -------------------------------------------------#
#--------------------------------------------------#
# variables
# -------------------------------------------------#
GREEN=\033[0;32m
RESET=\033[0m
MNG_FILE=./webapp/manage.py

#--------------------------------------------------#
# rules
#--------------------------------------------------#
all: run

run:
	@reset
	@echo "$(GREEN)[MSG] RUNNING SERVER$(RESET)"
	@python3 $(MNG_FILE) runsslserver

setup:
	python3 $(MNG_FILE) makemigrations && python3 $(MNG_FILE) migrate && python3 $(MNG_FILE) createsuperuser

re: clean all

clean:
	rm -f run

git-reset:
	rm -rf ./* && git restore .
