docker build -t node-app .
docker run -ti --name node-app --env-file production.env node-app
docker rm -f node-app
docker rmi $(docker images -f "dangling=true" -q)