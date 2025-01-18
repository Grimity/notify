import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './db/database';
import type { SQSHandler, SQSEvent } from 'aws-lambda';
import type { LikeEvent, FollowEvent, CommentEvent } from './types';
import { LikeHandler } from './handler/like.handler';
import { FollowHandler } from './handler/follow.handler';
import { CommentHandler } from './handler/comment.handler';

export const handler: SQSHandler = async (lambdaEvent: SQSEvent) => {
  const body = lambdaEvent.Records[0]!.body;
  const event = JSON.parse(body) as LikeEvent | FollowEvent | CommentEvent;

  if (event.type === 'LIKE') {
    const handler = new LikeHandler(db);
    await handler.notify(event);
  } else if (event.type === 'FOLLOW') {
    const handler = new FollowHandler(db);
    await handler.notify(event);
  } else if (event.type === 'COMMENT') {
    const handler = new CommentHandler(db);
    await handler.notify(event);
  }
};
