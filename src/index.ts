import * as dotenv from 'dotenv';
dotenv.config();
import { db } from './db/database';
import type { SQSHandler, SQSEvent } from 'aws-lambda';
import type { Event } from './types';
import { EventHandler } from './handler/event.handler';

const eventHandler = new EventHandler(db);

export const handler: SQSHandler = async (lambdaEvent: SQSEvent) => {
  const body = lambdaEvent.Records[0]!.body;
  const event = JSON.parse(body) as Event;

  try {
    if (event.type === 'FOLLOW') {
      await eventHandler.handleFollow(event);
    } else if (event.type === 'FEED_LIKE') {
      await eventHandler.handleFeedLike(event);
    } else if (event.type === 'FEED_COMMENT') {
      await eventHandler.handleFeedComment(event);
    } else if (event.type === 'FEED_REPLY') {
      await eventHandler.handleFeedReply(event);
    } else if (event.type === 'FEED_MENTION') {
      await eventHandler.handleFeedMention(event);
    } else if (event.type === 'POST_COMMENT') {
      await eventHandler.handlePostComment(event);
    } else if (event.type === 'POST_REPLY') {
      await eventHandler.handlePostReply(event);
    } else if (event.type === 'POST_MENTION') {
      await eventHandler.handlePostMention(event);
    }
    return;
  } catch (error) {
    console.error('Error processing event', event, error);
    return;
  }
};
