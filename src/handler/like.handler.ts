import type { Database } from 'src/db/database';
import type { LikeEvent } from 'src/types';
import { v4 as uuid } from 'uuid';

export class LikeHandler {
  constructor(private db: Database) {}

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

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: feed[0].authorId,
        type: 'LIKE',
        actorId,
        actorName: actor[0].name,
        feedId,
      })
      .execute();

    return;
  }
}
