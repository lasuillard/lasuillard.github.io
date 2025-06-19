import * as aws from '@pulumi/aws';

// Just a simple example to demonstration
console.log(
	await aws
		.getCallerIdentity()
		.then((identity) => {
			return `AWS Account ID: ${identity.accountId}`;
		})
		.catch((error) => {
			return `Error fetching AWS account ID: ${error.message}`;
		})
);
