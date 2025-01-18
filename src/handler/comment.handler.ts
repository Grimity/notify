import type { Database } from 'src/db/database';
import type { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import type { CommentEvent } from 'src/types';
import { v4 as uuid } from 'uuid';

export class CommentHandler {
  constructor(private db: Database, private ddbClient: DynamoDBClient) {}

  async notify({ actorId, feedId, parentCommentId }: CommentEvent) {
    const actor = await this.db
      .selectFrom('User')
      .where('id', '=', actorId)
      .select('name')
      .execute();

    const author = await this.db
      .selectFrom('Feed')
      .where('id', '=', feedId)
      .select('authorId')
      .execute();

    if (!actor[0] || !author[0]) return;

    // 댓글 작성자가 피드 소유자가 아니면 일단 피드 소유자에게 알림
    if (actorId !== author[0].authorId) {
      const notification: CommentNotification = {
        id: uuid(),
        userId: author[0].authorId,
        actorId,
        actorName: actor[0].name,
        type: 'COMMENT',
        isRead: false,
        createdAt: Date.now(),
        feedId,
        expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
      };

      await this.saveNotification(notification);
    }

    // 대댓글이 아니면 여기서 끝
    if (!parentCommentId) return;

    const parentComment = await this.db
      .selectFrom('FeedComment')
      .where('id', '=', parentCommentId)
      .select('writerId')
      .execute();

    if (!parentComment[0]) return;

    // 대댓글 작성자가 댓글 작성자와 같으면 여기서 끝
    if (actorId === parentComment[0].writerId) return;

    const notification: CommentNotification = {
      userId: parentComment[0].writerId,
      createdAt: Date.now(),
      id: uuid(),
      type: 'COMMENT',
      isRead: false,
      actorId,
      actorName: actor[0].name,
      feedId,
      expiresAt: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    };

    await this.saveNotification(notification);
    return;
  }

  async saveNotification(notification: CommentNotification) {
    const command = new PutCommand({
      TableName: 'Notification',
      Item: notification,
    });

    await this.ddbClient.send(command);
  }
}

type CommentNotification = {
  id: string;
  userId: string;
  actorId: string;
  actorName: string;
  type: 'COMMENT';
  isRead: boolean;
  createdAt: number;
  feedId: string;
  expiresAt: number;
};
