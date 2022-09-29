# login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com

# build 
docker build -t project-service001 .

# tagged
docker tag project-service001:latest <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/project-service001:latest

# push
docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/project-service001:latest
