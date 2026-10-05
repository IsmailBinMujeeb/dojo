import { useContext, useEffect, useRef, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import { Spinner } from "@/components/ui/spinner";
import { useParams, useSearchParams } from "react-router-dom";
import { Heart, Bookmark, ArrowLeft, SmilePlus, Image } from "lucide-react";
import Comment from "@/components/Comment";
import { ShareDialog } from "@/components/ShareDialog";
import PostPoll from "@/components/PostPoll";
import { PostImages, PostDocuments } from "@/components/PostAttachments";

const PostPage = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [post, setPost] = useState([]);
    const [replyText, setReplyText] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [bookmarksCount, setBookmarksCount] = useState(0);
    const pending = useRef({ like: false, bookmark: false });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isComment = searchParams.get("isComment") === "true";

    useEffect(() => {
        if (!user?._id) return;
        (async () => {
            try {
                const url = isComment
                    ? `${import.meta.env.VITE_API_ENDPOINT}/comment/${id}`
                    : `${import.meta.env.VITE_API_ENDPOINT}/post/${id}`;
                const data = await fetch(url, {
                    credentials: "include",
                });

                if (data.status === 404) {
                    navigate("/notfound");
                    return;
                }
                const json = await data.json();

                setPost(json.data);
                setIsLiked(!!json.data?.isLiked);
                setIsBookmarked(!!json.data?.isBookmarked);
                setLikesCount(json.data?.likesCount ?? 0);
                setBookmarksCount(json.data?.bookmarksCount ?? 0);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [id, user?._id, navigate, isComment]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner />
            </div>
        );
    }

    // Optimistic toggle: flip immediately, roll back if the request fails.
    async function toggle({ key, url, active, setActive, setCount }) {
        if (!post?._id || pending.current[key]) return;
        pending.current[key] = true;

        setActive(!active);
        setCount((c) => Math.max(0, c + (active ? -1 : 1)));

        try {
            const res = await fetch(url, {
                credentials: "include",
                method: "POST",
            });
            if (!res.ok) throw new Error("Request failed");
        } catch (error) {
            console.log(error);
            setActive(active);
            setCount((c) => Math.max(0, c + (active ? 1 : -1)));
        } finally {
            pending.current[key] = false;
        }
    }

    function handlePostLike(e) {
        e.stopPropagation();
        toggle({
            key: "like",
            url: isComment
                ? `${import.meta.env.VITE_API_ENDPOINT}/comment-like/${post._id}`
                : `${import.meta.env.VITE_API_ENDPOINT}/like/${post._id}`,
            active: isLiked,
            setActive: setIsLiked,
            setCount: setLikesCount,
        });
    }

    function handlePostBookmark(e) {
        e.stopPropagation();
        if (isComment) return; // only posts can be bookmarked
        toggle({
            key: "bookmark",
            url: `${import.meta.env.VITE_API_ENDPOINT}/bookmark/${post._id}`,
            active: isBookmarked,
            setActive: setIsBookmarked,
            setCount: setBookmarksCount,
        });
    }

    const handleCreateComment = async () => {
        // if (!post._id) return;

        const url = isComment
            ? `${import.meta.env.VITE_API_ENDPOINT}/comment/${post.postId}?parentCommentId=${post._id}`
            : `${import.meta.env.VITE_API_ENDPOINT}/comment/${post._id}`;

        const data = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: replyText }),
        });

        if (!data.ok) {
            console.error("Failed to create comment");
        }

        navigate(0);
    };

    return (
        <div>
            <div className="flex-1 bg-white border-x border-secondary/10 min-h-screen">
                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md px-4 py-3 flex items-center gap-6">
                    <button
                        className="p-2 hover:bg-secondary/10 rounded-md transition-colors cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        <span
                            className="material-symbols-outlined"
                            data-icon="arrow_back"
                        >
                            <ArrowLeft />
                        </span>
                    </button>
                    <h1 className="text-xl font-bold tracking-tight">Posts</h1>
                </div>
                <article className="px-4 pt-4 pb-2 paper-layer">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-3">
                            <img
                                className="w-12 h-12 rounded-md object-cover"
                                src={post?.author?.avatar}
                            />
                            <div className="flex flex-col">
                                <span className="font-bold text-black leading-tight hover:underline cursor-pointer">
                                    {post?.author?.name}
                                </span>
                                <span className="text-secondary">
                                    @{post?.author?.username}
                                </span>
                            </div>
                        </div>
                        <ShareDialog link={`${window.location.href}`} />
                    </div>

                    {post?.content && (
                        <div className="text-[21px] leading-[1.4] text-black mb-4 font-normal break-words">
                            {post.content.split("\n").map((line, index) => (
                                <Fragment key={index}>
                                    {line}
                                    <br />
                                </Fragment>
                            ))}
                        </div>
                    )}

                    {post?.images?.length > 0 && (
                        <div className="mb-4">
                            <PostImages images={post.images} />
                        </div>
                    )}

                    {post?.poll && (
                        <div className="mb-4">
                            <PostPoll
                                key={post._id}
                                postId={post._id}
                                poll={post.poll}
                            />
                        </div>
                    )}

                    {post?.documents?.length > 0 && (
                        <div className="mb-4">
                            <PostDocuments documents={post.documents} />
                        </div>
                    )}

                    <div className=" border-b border-secondary/10 flex items-center gap-6">
                        <div className="text-[15px]">
                            <span className="font-bold text-black">
                                {post?.commentsCount}
                            </span>{" "}
                            <span className="text-secondary">Comments</span>
                        </div>
                        <div className="text-[15px]">
                            <span className="font-bold text-black">
                                {likesCount}
                            </span>{" "}
                            <span className="text-secondary">Likes</span>
                        </div>
                        {!isComment && (
                            <div className="text-[15px]">
                                <span className="font-bold text-black">
                                    {bookmarksCount}
                                </span>{" "}
                                <span className="text-secondary">
                                    Bookmarks
                                </span>
                            </div>
                        )}
                        <div className="flex gap-8 justify-end px-2 py-1 text-secondary ml-auto">
                            <button
                                className="p-2 hover:bg-secondary/10 rounded-md transition-colors flex items-center group cursor-pointer"
                                onClick={handlePostLike}
                                aria-label={isLiked ? "Unlike" : "Like"}
                            >
                                <span
                                    className="material-symbols-outlined text-[20px]"
                                    data-icon="favorite"
                                >
                                    <Heart
                                        fill={isLiked ? "red" : "none"}
                                        color={isLiked ? "red" : "currentColor"}
                                    />
                                </span>
                            </button>
                            {!isComment && (
                                <button
                                    className="p-2 hover:bg-secondary/10 rounded-md transition-colors flex items-center group cursor-pointer"
                                    onClick={handlePostBookmark}
                                    aria-label={
                                        isBookmarked
                                            ? "Remove bookmark"
                                            : "Bookmark"
                                    }
                                >
                                    <span
                                        className="material-symbols-outlined text-[20px]"
                                        data-icon="bookmark"
                                    >
                                        <Bookmark
                                            fill={
                                                isBookmarked ? "blue" : "none"
                                            }
                                            color={
                                                isBookmarked
                                                    ? "blue"
                                                    : "currentColor"
                                            }
                                        />
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </article>
                {/* <!-- Reply Input -->*/}
                <div className="px-4 py-3 flex gap-3 border-b border-secondary/10 items-start">
                    <img
                        className="w-10 h-10 rounded-md object-cover"
                        src={user?.avatar}
                    />
                    <div className="flex-1">
                        <textarea
                            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-xl placeholder:text-secondary/40 resize-none pt-2 h-12"
                            placeholder="Post your reply"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                        ></textarea>
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex gap-1 text-secondary">
                                <button className="p-2 hover:bg-secondary/10 rounded-md transition-colors">
                                    <span
                                        className="material-symbols-outlined text-[20px]"
                                        data-icon="image"
                                    >
                                        <Image />
                                    </span>
                                </button>
                                <button className="p-2 hover:bg-secondary/10 rounded-md transition-colors">
                                    <span
                                        className="material-symbols-outlined text-[20px]"
                                        data-icon="sentiment_satisfied"
                                    >
                                        <SmilePlus />
                                    </span>
                                </button>
                            </div>
                            <button
                                className="bg-primary text-secondary font-bold px-5 py-2 cursor-pointer rounded-md disabled:opacity-50"
                                onClick={handleCreateComment}
                                disabled={!replyText.trim()}
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                </div>
                {/* <!-- Threaded Comments -->*/}
                <div className="flex flex-col">
                    {post?.comments?.map((comment) => (
                        <Fragment key={comment._id}>
                            <Comment comment={comment} postId={post._id} />
                        </Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostPage;
