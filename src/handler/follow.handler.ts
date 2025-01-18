import type { Database } from 'src/db/database';
import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import type { FollowEvent } from 'src/types';
import { v4 as uuid } from 'uuid';

export class FollowHandler {
  constructor(private db: Database, private ddbClient: DynamoDBClient) {}

  async notify({ actorId, userId }: FollowEvent) {
    const actor = await this.db
      .selectFrom('User')
      .where('id', '=', actorId)
      .select('name')
      .execute();

    if (!actor[0]) return;

    const notification: FollowNotification = {
      userId,
      createdAt: Date.now().toString(),
      id: uuid(),
      type: 'FOLLOW',
      isRead: false,
      actorId,
      actorName: actor[0].name,
      expiresAt: (Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30).toString(),
    };

    const command = new PutCommand({
      TableName: 'Notification',
      Item: notification,
    });

    await this.ddbClient.send(command);
  }
}

type FollowNotification = {
  id: string;
  userId: string;
  actorId: string;
  actorName: string;
  type: 'FOLLOW';
  isRead: boolean;
  createdAt: string;
  expiresAt: string;
};
