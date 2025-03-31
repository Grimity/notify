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

import { getImageUrl, getFeedLink, getProfileLink, getPostLink } from '../util';

export class EventHandler {
  constructor(private db: Database) {}

  async handleFollow({ actorId, userId }: FollowEvent) {
    const [actor] = await this.db
      .selectFrom('User')
      .where('id', '=', actorId)
      .select(['id', 'name', 'image', 'url'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId,
        image: getImageUrl(actor.image),
        link: getProfileLink(actor.url),
        message: `${actor.name}님이 나를 팔로우했어요`,
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
        image: getImageUrl(user.thumbnail),
        link: getFeedLink(feedId),
        message: `${user.title}에 좋아요가 ${likeCount}개 달렸어요`,
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
      .select(['id', 'name', 'image', 'url'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        image: getImageUrl(actor.image),
        link: getFeedLink(feedId),
        message: `${actor.name}님이 내 그림에 댓글을 남겼어요`,
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
      .select(['id', 'name', 'image', 'url'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        image: getImageUrl(actor.image),
        link: getFeedLink(feedId),
        message: `${actor.name}님이 내 댓글에 답글을 달았어요`,
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
      .select(['id', 'name', 'image', 'url'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        image: getImageUrl(actor.image),
        link: getFeedLink(feedId),
        message: `${actor.name}님이 내 답글에 답글을 달았어요`,
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
      .select(['id', 'name', 'image', 'url'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        image: getImageUrl(actor.image),
        link: getPostLink(postId),
        message: `${actor.name}님이 내 게시글에 댓글을 달았어요`,
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
      .select(['id', 'name', 'image', 'url'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        image: getImageUrl(actor.image),
        link: getPostLink(postId),
        message: `${actor.name}님이 내 댓글에 답글을 달았어요`,
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
      .select(['id', 'name', 'image', 'url'])
      .execute();

    if (!actor) return;

    await this.db
      .insertInto('Notification')
      .values({
        id: uuid(),
        userId: user.id,
        image: getImageUrl(actor.image),
        link: getPostLink(postId),
        message: `${actor.name}님이 내 답글에 답글을 달았어요 `,
      })
      .execute();
  }
}
