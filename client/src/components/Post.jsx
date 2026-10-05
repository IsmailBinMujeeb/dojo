import { Heart, Bookmark, MessageSquareText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { ShareDialog } from "./ShareDialog";
import PostPoll from "./PostPoll";
import { PostImages, PostDocuments } from "./PostAttachments";

dayjs.extend(relative);

const Post = ({ post }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(post?.isLiked);
    const [isBookmarked, setIsBookmarked] = useState(post?.isBookmarked);

    async function handleLike(e) {
        e.stopPropagation();
        try {
            await fetch(
                `${import.meta.env.VITE_API_ENDPOINT}/like/${post?._id}`,
                {
                    credentials: "include",
                    method: "POST",
                },
            );
            setIsLiked((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleBookmark(e) {
        e.stopPropagation();
        try {
            await fetch(
                `${import.meta.env.VITE_API_ENDPOINT}/bookmark/${post?._id}`,
                {
                    credentials: "include",
                    method: "POST",
                },
            );
            setIsBookmarked((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    }

    const handlePostClick = () => {
        navigate(`/post/${post?._id}`);
    };

    return (
        <article className="post-card bg-card p-6 pb-2 pr-2 rounded-xl transition-all mb-2 shadow-xs">
            <div className="flex gap-4">
                <div className="flex flex-col items-center">
                    <img
                        alt="Author"
                        className="w-12 h-12 rounded-lg object-cover"
                        src={post?.author?.avatar}
                    />
                    <div className="w-px h-full bg-outline-variant mt-2 opacity-20"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-card-foreground">
                                {post?.author?.name}
                            </span>
                            <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                                @{post?.author?.username}
                            </span>
                        </div>
                        <span className="text-xs text-card-foreground font-label">
                            {dayjs(post?.createdAt).fromNow()}
                        </span>
                    </div>

                    {post?.content && (
                        <p className="text-body-lg text-card-foreground leading-relaxed mb-4 break-words">
                            {post.content.split("\n").map((para, index) => (
                                <span key={index}>
                                    {para}
                                    <br />
                                </span>
                            ))}
                        </p>
                    )}

                    {post?.images?.length > 0 && (
                        <div className="mb-4">
                            <PostImages images={post.images} />
                        </div>
                    )}

                    {post?.poll && (
                        <div className="mb-4">
                            <PostPoll postId={post._id} poll={post.poll} />
                        </div>
                    )}

                    {post?.documents?.length > 0 && (
                        <div className="mb-4">
                            <PostDocuments documents={post.documents} />
                        </div>
                    )}

                    <div className="flex justify-between items-center text-on-surface-variant">
                        <div className="flex gap-6">
                            <button
                                className="flex items-center gap-1 p-2 rounded-md cursor-pointer transition-colors hover:bg-secondary/10"
                                onClick={handlePostClick}
                            >
                                <span
                                    className="material-symbols-outlined text-[20px]"
                                    data-icon="chat_bubble"
                                >
                                    <MessageSquareText />
                                </span>
                                <span className="text-xs font-bold">
                                    {post?.commentsCount}
                                </span>
                            </button>
                            <button
                                className="flex items-center gap-1 p-2 rounded-md cursor-pointer transition-colors hover:bg-secondary/10"
                                onClick={handleLike}
                            >
                                <span
                                    className="material-symbols-outlined text-[20px]"
                                    data-icon="favorite"
                                >
                                    <Heart
                                        className={
                                            isLiked
                                                ? "fill-red-500 stroke-red-500"
                                                : "fill-transparent stroke-black dark:stroke-white"
                                        }
                                    />
                                </span>
                                <span className="text-xs font-bold">
                                    {post?.likesCount}
                                </span>
                            </button>
                            <ShareDialog
                                link={`${window.location.origin}/post/${post?._id}`}
                            />
                        </div>
                        <button
                            className="p-2 rounded-md cursor-pointer hover:bg-secondary/10"
                            onClick={handleBookmark}
                        >
                            <span
                                className="material-symbols-outlined text-[20px]"
                                data-icon="bookmark"
                            >
                                <Bookmark
                                    className={
                                        isBookmarked
                                            ? "fill-blue-500 stroke-blue-500"
                                            : "fill-transparent stroke-black dark:stroke-white"
                                    }
                                />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Post;
