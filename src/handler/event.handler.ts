import type { Database } from 'src/db/database';
import type {
  FollowEvent,
  FeedLikeEvent,
  FeedCommentEvent,
  FeedReplyEvent,
  FeedMentionEvent,
  PostReplyEvent,
  PostCommentEvent,
  PostMentionEvent,
} from 'src/types';
import { v4 as uuid } from 'uuid';

export class EventHandler {
  constructor(private db: Database) {}

  async handleFollow({ actorId, userId }: FollowEvent) {
    const [actor] = await this.db
      .selectFrom('User')
      .where('id', '=', actorId)
      .select(['id', 'name', 'image'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId,
        data: {
          type: 'FOLLOW',
          actor: {
            id: actor.id,
            name: actor.name,
            image: actor.image,
          },
        },
      })
      .execute();
  }

  async handleFeedLike({ feedId, likeCount }: FeedLikeEvent) {
    const [user] = await this.db
      .selectFrom('Feed')
      .innerJoin('User', 'User.id', 'Feed.authorId')
      .where('Feed.id', '=', feedId)
      .select(['User.id', 'subscription', 'thumbnail', 'title'])
      .execute();

    if (!user || !user.subscription.includes('FEED_LIKE')) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        data: {
          type: 'FEED_LIKE',
          feedId,
          likeCount,
          thumbnail: user.thumbnail,
          title: user.title,
        },
      })
      .execute();
  }

  async handleFeedComment({ feedId, actorId }: FeedCommentEvent) {
    const [user] = await this.db
      .selectFrom('Feed')
      .innerJoin('User', 'User.id', 'Feed.authorId')
      .where('Feed.id', '=', feedId)
      .select(['User.id', 'subscription'])
      .execute();

    if (
      !user ||
      user.id === actorId ||
      !user.subscription.includes('FEED_COMMENT')
    )
      return;

    const [actor] = await this.db
      .selectFrom('User')
      .where('id', '=', actorId)
      .select(['id', 'name', 'image'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        data: {
          type: 'FEED_COMMENT',
          feedId,
          actor: {
            id: actor.id,
            name: actor.name,
            image: actor.image,
          },
        },
      })
      .execute();
  }

  async handleFeedReply({ feedId, actorId, parentId }: FeedReplyEvent) {
    const [user] = await this.db
      .selectFrom('FeedComment')
      .innerJoin('User', 'User.id', 'FeedComment.writerId')
      .where('FeedComment.id', '=', parentId)
      .select(['User.id', 'subscription'])
      .execute();

    if (
      !user ||
      user.id === actorId ||
      !user.subscription.includes('FEED_REPLY')
    )
      return;

    const [actor] = await this.db
      .selectFrom('User')
      .where('id', '=', actorId)
      .select(['id', 'name', 'image'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        data: {
          type: 'FEED_REPLY',
          feedId,
          actor: {
            id: actor.id,
            name: actor.name,
            image: actor.image,
          },
        },
      })
      .execute();
  }

  async handleFeedMention({
    feedId,
    actorId,
    mentionedUserId,
  }: FeedMentionEvent) {
    const [user] = await this.db
      .selectFrom('User')
      .where('id', '=', mentionedUserId)
      .select(['id', 'subscription'])
      .execute();

    if (!user || user.id === actorId) return;

    const [actor] = await this.db
      .selectFrom('User')
      .where('id', '=', actorId)
      .select(['id', 'name', 'image'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        data: {
          type: 'FEED_MENTION',
          feedId,
          actor: {
            id: actor.id,
            name: actor.name,
            image: actor.image,
          },
        },
      })
      .execute();
  }

  async handlePostComment({ postId, actorId }: PostCommentEvent) {
    const [user] = await this.db
      .selectFrom('Post')
      .innerJoin('User', 'User.id', 'Post.authorId')
      .where('Post.id', '=', postId)
      .select(['User.id', 'subscription'])
      .execute();

    if (
      !user ||
      user.id === actorId ||
      !user.subscription.includes('POST_COMMENT')
    )
      return;

    const [actor] = await this.db
      .selectFrom('User')
      .where('id', '=', actorId)
      .select(['id', 'name', 'image'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        data: {
          type: 'POST_COMMENT',
          postId,
          actor: {
            id: actor.id,
            name: actor.name,
            image: actor.image,
          },
        },
      })
      .execute();
  }

  async handlePostReply({ postId, actorId, parentId }: PostReplyEvent) {
    const [user] = await this.db
      .selectFrom('PostComment')
      .innerJoin('User', 'User.id', 'PostComment.writerId')
      .where('PostComment.id', '=', parentId)
      .select(['User.id', 'subscription'])
      .execute();

    if (
      !user ||
      user.id === actorId ||
      !user.subscription.includes('POST_REPLY')
    )
      return;

    const [actor] = await this.db
      .selectFrom('User')
      .where('id', '=', actorId)
      .select(['id', 'name', 'image'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        data: {
          type: 'POST_REPLY',
          postId,
          actor: {
            id: actor.id,
            name: actor.name,
            image: actor.image,
          },
        },
      })
      .execute();
  }

  async handlePostMention({
    postId,
    actorId,
    mentionedUserId,
  }: PostMentionEvent) {
    const [user] = await this.db
      .selectFrom('User')
      .where('id', '=', mentionedUserId)
      .select(['id', 'subscription'])
      .execute();

    if (!user || user.id === actorId) return;

    const [actor] = await this.db
      .selectFrom('User')
      .where('id', '=', actorId)
      .select(['id', 'name', 'image'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        data: {
          type: 'POST_MENTION',
          postId,
          actor: {
            id: actor.id,
            name: actor.name,
            image: actor.image,
          },
        },
      })
      .execute();
  }
}
