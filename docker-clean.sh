## BE VERY CAREFUL NEVER USE ON PRODUCTION
# To delete all containers including its volumes use
docker rm -vf $(docker ps -aq)

# To delete all the images
docker rmi -f $(docker images -aq)

# To delete all volumes using the following command: 
docker volume rm $(docker volume ls -qf dangling=true)

# delete everything
docker system prune -a --volumes