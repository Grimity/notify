import type { Database } from 'src/db/database';
import type { FollowEvent } from 'src/types';
import { v4 as uuid } from 'uuid';

export class FollowHandler {
  constructor(private db: Database) {}

  async notify({ actorId, userId }: FollowEvent) {
    const actor = await this.db
      .selectFrom('User')
      .where('id', '=', actorId)
      .select('name')
      .execute();

    if (!actor[0]) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId,
        type: 'FOLLOW',
        actorId,
        actorName: actor[0].name,
      })
      .execute();

    return;
  }
}
