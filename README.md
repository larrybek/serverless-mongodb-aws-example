# Serverless Framework, Node.js, MongoDB & AWS Example

This project is just an example of simple Single Repo Multi Service 
Serverless Framework configuration with usage of MongoDB, Node.js,
Serverless Bundle.

## Local Running

To run functionality locally I have used Serverless Offline plugin. 
It helps fast and reliable run your functions and test it before deployment.

Remember to have installed AWS CLI and give access to S3 so your files
can be uploaded.

To run service just enter to service folder:

```sh
cd services/core
# Run Serverless Offline
sls offline
```

## Deploying Code to AWS

To deploy code to AWS you can use or deploying by calling 
serverless deploy at each service through terminal.

But I suggest to use [Seed.Run](https://seed.run/). Its optimized for single repo
multi service Serverless Framework applications to make deployments easy.
 
