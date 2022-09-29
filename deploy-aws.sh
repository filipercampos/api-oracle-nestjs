# NOTE: You should know about AWS before use this code)
# Remember: Run this code generate a cost

# Adjust cloud-formation-new-environment.yaml with your AWS config

# Run and wait for the stack to be created (check it out progress AWS)

# create a new environment (It's gonna take while)
aws cloudformation create-stack --stack-name project-env-prd \
--capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM  CAPABILITY_AUTO_EXPAND \
--template-body file://./cloud-formation-new-environment.yml

# create stack for service 
aws cloudformation create-stack --stack-name project-service001-prd \
--capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM  CAPABILITY_AUTO_EXPAND \
--template-body file://./cloud-formation.yml \
--parameters ParameterKey=ApplicationBaseName,ParameterValue=project \
            ParameterKey=Environment,ParameterValue=prd \
            ParameterKey=ImageName,ParameterValue=<ACCOUNT_ID>.dkr.ecr.<AWS_REGION>.amazonaws.com/project-service001:v1 \
            ParameterKey=ListenerPort,ParameterValue=8000 \
            ParameterKey=ServiceName,ParameterValue=service001 \
            ParameterKey=ServicePort,ParameterValue=3000 \
            ParameterKey=StackNameAndCluster,ParameterValue=project-env-prd

# delete stack
# aws cloudformation delete-stack --stack-name project-service001-prd