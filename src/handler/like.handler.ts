import type { Database } from 'src/db/database';
import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import type { LikeEvent } from 'src/types';
import { v4 as uuid } from 'uuid';

export class LikeHandler {
  constructor(private db: Database, private ddbClient: DynamoDBClient) {}

  async notify({ actorId, feedId }: LikeEvent) {
    const feed = await this.db
      .selectFrom('Feed')
      .where('id', '=', feedId)
      .select('authorId')
      .execute();

    const actor = await this.db
      .selectFrom('User')
      .where('id', '=', actorId)
      .select('name')
      .execute();

    if (!feed[0] || actorId === feed[0].authorId) return;
    if (!actor[0]) return;

    const notification: LikeNotification = {
      userId: feed[0].authorId,
      createdAt: Date.now(),
      id: uuid(),
      type: 'LIKE',
      isRead: false,
      actorId,
      actorName: actor[0].name,
      feedId,
      expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    };

    const command = new PutCommand({
      TableName: 'Notification',
      Item: notification,
    });

    await this.ddbClient.send(command);
  }
}

type LikeNotification = {
  id: string;
  userId: string;
  actorId: string;
  actorName: string;
  type: 'LIKE';
  isRead: boolean;
  createdAt: number;
  expiresAt: number;
  feedId: string;
};
