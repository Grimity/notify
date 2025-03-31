import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Feed = {
    id: string;
    authorId: string;
    title: string;
    cards: string[];
    thumbnail: string;
    isAI: Generated<boolean>;
    createdAt: Generated<Timestamp>;
    viewCount: Generated<number>;
    likeCount: Generated<number>;
    content: Generated<string>;
};
export type FeedComment = {
    id: string;
    feedId: string;
    writerId: string;
    parentId: string | null;
    content: string;
    mentionedUserId: string | null;
    createdAt: Generated<Timestamp>;
    likeCount: Generated<number>;
};
export type FeedCommentLike = {
    feedCommentId: string;
    userId: string;
};
export type Follow = {
    followerId: string;
    followingId: string;
    createdAt: Generated<Timestamp>;
};
export type Like = {
    userId: string;
    feedId: string;
    createdAt: Generated<Timestamp>;
};
export type Notification = {
    id: string;
    userId: string;
    isRead: Generated<boolean>;
    createdAt: Generated<Timestamp>;
    link: string;
    image: string | null;
    message: string;
};
export type Post = {
    id: string;
    authorId: string;
    title: string;
    content: string;
    type: number;
    thumbnail: string | null;
    createdAt: Generated<Timestamp>;
    viewCount: Generated<number>;
    commentCount: Generated<number>;
};
export type PostComment = {
    id: string;
    postId: string;
    writerId: string | null;
    parentId: string | null;
    content: string;
    mentionedUserId: string | null;
    createdAt: Generated<Timestamp>;
    likeCount: Generated<number>;
    isDeleted: Generated<boolean>;
};
export type PostCommentLike = {
    postCommentId: string;
    userId: string;
};
export type PostLike = {
    postId: string;
    userId: string;
};
export type PostSave = {
    postId: string;
    userId: string;
    createdAt: Generated<Timestamp>;
};
export type RefreshToken = {
    userId: string;
    token: string;
    updatedAt: Generated<Timestamp>;
    type: string;
    device: string;
    model: string;
    ip: string;
};
export type Report = {
    id: string;
    type: number;
    userId: string;
    refType: string;
    refId: string;
    content: string | null;
    createdAt: Generated<Timestamp>;
};
export type Save = {
    userId: string;
    feedId: string;
    createdAt: Generated<Timestamp>;
};
export type Tag = {
    feedId: string;
    tagName: string;
};
export type User = {
    id: string;
    url: string;
    provider: string;
    providerId: string;
    email: string;
    name: string;
    image: string | null;
    description: Generated<string>;
    backgroundImage: string | null;
    links: Generated<string[]>;
    followerCount: Generated<number>;
    subscription: Generated<string[]>;
    createdAt: Generated<Timestamp>;
};
export type View = {
    userId: string;
    feedId: string;
    createdAt: Generated<Timestamp>;
};
export type DB = {
    Feed: Feed;
    FeedComment: FeedComment;
    FeedCommentLike: FeedCommentLike;
    Follow: Follow;
    Like: Like;
    Notification: Notification;
    Post: Post;
    PostComment: PostComment;
    PostCommentLike: PostCommentLike;
    PostLike: PostLike;
    PostSave: PostSave;
    RefreshToken: RefreshToken;
    Report: Report;
    Save: Save;
    Tag: Tag;
    User: User;
    View: View;
};
