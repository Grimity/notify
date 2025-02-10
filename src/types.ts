export type FollowEvent = {
  type: 'FOLLOW';
  actorId: string;
  userId: string;
};

export type FeedLikeEvent = {
  type: 'FEED_LIKE';
  feedId: string;
  likeCount: number;
};

export type FeedCommentEvent = {
  type: 'FEED_COMMENT';
  feedId: string;
  actorId: string;
};

export type FeedAnswerEvent = {
  type: 'FEED_ANSWER';
  feedId: string;
  actorId: string;
  parentId: string;
};

export type FeedMentionEvent = {
  type: 'FEED_MENTION';
  feedId: string;
  actorId: string;
  mentionedUserId: string;
};

export type PostCommentEvent = {
  type: 'POST_COMMENT';
  postId: string;
  actorId: string;
};

export type PostAnswerEvent = {
  type: 'POST_ANSWER';
  postId: string;
  actorId: string;
  parentId: string;
};

export type PostMentionEvent = {
  type: 'POST_MENTION';
  postId: string;
  actorId: string;
  mentionedUserId: string;
};

export type Event =
  | FollowEvent
  | FeedLikeEvent
  | FeedCommentEvent
  | FeedAnswerEvent
  | FeedMentionEvent
  | PostCommentEvent
  | PostAnswerEvent
  | PostMentionEvent;

export type SubscriptionType =
  | 'FOLLOW'
  | 'FEED_LIKE'
  | 'FEED_COMMENT'
  | 'FEED_ANSWER'
  | 'POST_COMMENT'
  | 'POST_ANSWER';
