import { SQSHandler, SQSEvent } from 'aws-lambda';

export const handler: SQSHandler = async (event: SQSEvent) => {
  const body = event.Records[0]!.body;
  const message = JSON.parse(body);
  console.log('Message:', message);
};
