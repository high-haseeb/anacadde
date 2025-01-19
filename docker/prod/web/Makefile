#TODO: DOCKERFILE BUILD FUNCTIONS
############################################################################################################
build:
	echo "dev_build çalıştı."
	{ \
		echo "TAG='$(TAG)'"; \
	} > ./.env.prod
	docker-compose stop vitejs
	docker system prune -a -f --all
	docker system prune -a -f --volumes
	docker login -u "$(DEV_DEPLOY_USERNAME)" -p "$(DEV_DEPLOY_PASSWORD)" "registry.gitlab.com"
	docker-compose --env-file ./.env.prod up -d --build vitejs


#TODO: FIRST BUILD FUNCTIONS
############################################################################################################
build_first:
	echo "dev_build_first çalıştı."
	make build


#TODO: REBUILD BUILD FUNCTIONS
############################################################################################################
rebuild:
	echo "dev_rebuild çalıştı."
	make build


#TODO: REMOVE FUNCTIONS
############################################################################################################
remove_container:
	echo "dev_remove_container çalıştı."
	docker-compose down --rmi all -v
	docker system prune -a -f --all
	docker system prune -a -f --volumes
