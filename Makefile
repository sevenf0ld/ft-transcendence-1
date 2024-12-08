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
	@python3 $(MNG_FILE) runserver

re: clean all

clean:
	rm -f run main.o

git-reset:
	rm -rf ./* && git restore .
