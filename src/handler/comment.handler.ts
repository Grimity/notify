import type { Database } from 'src/db/database';
import type { CommentEvent } from 'src/types';
import { v4 as uuid } from 'uuid';

export class CommentHandler {
  constructor(private db: Database) {}

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
      await this.db
        .insertInto('Notification')
        .values({
          id: uuid(),
          userId: author[0].authorId,
          actorId,
          actorName: actor[0].name,
          type: 'COMMENT',
          feedId,
        })
        .execute();
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

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: parentComment[0].writerId,
        type: 'COMMENT',
        actorId,
        actorName: actor[0].name,
        feedId,
      })
      .execute();

    return;
  }
}
