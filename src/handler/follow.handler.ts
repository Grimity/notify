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
      id: uuid(),
      userId,
      actorId,
      actorName: actor[0].name,
      type: 'FOLLOW',
      isRead: false,
      createdAt: Date.now(),
      expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    };

    const command = new PutCommand({
      TableName: 'Notification',
      Item: {
        userId: { S: notification.userId },
        createdAt: { N: notification.createdAt.toString() },
        id: { S: notification.id },
        type: { S: notification.type },
        isRead: { BOOL: notification.isRead },
        actorId: { S: notification.actorId },
        actorName: { S: notification.actorName },
        expiresAt: { N: notification.expiresAt.toString() },
      },
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
  createdAt: number;
  expiresAt: number;
};
