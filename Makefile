start:
	rm -rf node_modules
	docker-compose up -d --build --force-recreate vitejs
	docker cp anasigorta-anacadde:/app/node_modules .
	docker cp anasigorta-anacadde:/app/package-lock.json .

stop:
	docker-compose down --rmi all -v
	docker system prune -a -f --all
	docker system prune -a -f --volumes
	rm -rf node_modules

copy:
	rm -rf node_modules
	docker cp anasigorta-anacadde:/app/node_modules .
	docker cp anasigorta-anacadde:/app/package.json .
	docker cp anasigorta-anacadde:/app/package-lock.json .

#############################################################################################
reload:
	docker-compose restart vitejs

exec :
	docker exec -it anasigorta-anacadde sh

logs:
	docker logs -f --tail 200 anasigorta-anacadde