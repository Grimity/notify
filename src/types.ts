export type LikeEvent = {
  type: 'LIKE';
  actorId: string;
  feedId: string;
};

export type FollowEvent = {
  type: 'FOLLOW';
  actorId: string;
  userId: string;
};

export type CommentEvent = {
  type: 'COMMENT';
  actorId: string;
  feedId: string;
  parentCommentId?: string | null;
};
