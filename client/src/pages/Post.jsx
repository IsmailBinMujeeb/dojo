import { useContext, useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import { Spinner } from "@/components/ui/spinner";
import { useParams, useSearchParams } from "react-router-dom";
import {
    Heart,
    Bookmark,
    ArrowLeft,
    Share2,
    SmilePlus,
    Image,
} from "lucide-react";
import Comment from "@/components/Comment";
import { ShareDialog } from "@/components/ShareDialog";

const PostPage = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const [post, setPost] = useState([]);
    const [replyText, setReplyText] = useState("");
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
                console.log(json.data, "JSON");

                setPost(json.data);
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

    async function handlePostLike(e) {
        e.stopPropagation();
        const url = isComment
            ? `${import.meta.env.VITE_API_ENDPOINT}/comment-like/${post?._id}`
            : `${import.meta.env.VITE_API_ENDPOINT}/like/${post?._id}`;
        try {
            await fetch(url, {
                credentials: "include",
                method: "POST",
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function handlePostBookmark(e) {
        e.stopPropagation();
        try {
            await fetch(
                `${import.meta.env.VITE_API_ENDPOINT}/bookmark/${post?._id}`,
                {
                    credentials: "include",
                    method: "POST",
                },
            );
        } catch (error) {
            console.log(error);
        }
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
                                data-alt="Professional portrait of a woman in her 30s with an intelligent expression and natural lighting"
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
                    <div className="text-[21px] leading-[1.4] text-black mb-4 font-normal">
                        {post?.content?.split("\n")?.map((line, index) => (
                            <Fragment key={index}>
                                {line}
                                <br />
                            </Fragment>
                        ))}
                        {/* <span className="text-primary font-semibold hover:underline">
                            #NeuroEducation
                        </span>{" "}
                        <span className="text-primary font-semibold hover:underline">
                            #AcademicDojo
                        </span>*/}
                    </div>
                    {/* <div className="rounded-xl overflow-hidden mb-4 border border-outline-variant/10">
                        <img
                            className="w-full h-auto object-cover aspect-video"
                            data-alt="Complex architectural visualization of a futuristic research laboratory with clean lines and glowing digital displays"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDV7fClYZ2COxrouSeQOoxugOt8xlMY_lwrwl2stWVBDPRRz-Kcu0pCrO5DLaJAx4Gb0t7LlOBTHiR90tY54uDlK1FOVw9XjweL6BGSg8mHSJdzrG57U_QYFOkVI_mgyNBjSv7f3FvJc76b34wyf6nUzxDYMl_zLXZT1TrK67YatQKD-CkL6DBgg4TUfr4Jb-6wArCaxLppdYc2NYxdTdktRwOAVw0ZX0_3JBB-CmRdfnD5Hj444qOI82__CFBApAEIldA7WEUJxmNX"
                        />
                    </div>*/}
                    <div className=" border-b border-secondary/10 flex items-center gap-6">
                        <div className="text-[15px]">
                            <span className="font-bold text-black">
                                {post?.commentsCount}
                            </span>{" "}
                            <span className="text-secondary">Comments</span>
                        </div>
                        <div className="text-[15px]">
                            <span className="font-bold text-black">
                                {post?.likesCount}
                            </span>{" "}
                            <span className="text-secondary">Likes</span>
                        </div>
                        <div className="text-[15px]">
                            <span className="font-bold text-black">
                                {post?.bookmarksCount}
                            </span>{" "}
                            <span className="text-secondary">Bookmarks</span>
                        </div>
                        <div className="flex gap-8 justify-end px-2 py-1 text-secondary ml-auto">
                            <button className="p-2 hover:bg-secondary/10 rounded-md transition-colors flex items-center group">
                                <span
                                    className="material-symbols-outlined text-[20px] text-error"
                                    data-icon="favorite"
                                >
                                    <Heart />
                                </span>
                            </button>
                            <button className="p-2 hover:bg-secondary/10 rounded-md transition-colors flex items-center group">
                                <span
                                    className="material-symbols-outlined text-[20px]"
                                    data-icon="bookmark"
                                >
                                    <Bookmark />
                                </span>
                            </button>
                        </div>
                    </div>
                </article>
                {/* <!-- Reply Input -->*/}
                <div className="px-4 py-3 flex gap-3 border-b border-secondary/10 items-start">
                    <img
                        className="w-10 h-10 rounded-md object-cover"
                        data-alt="Close up portrait of a young male academic with glasses in a library"
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
                    {/* <!-- Comment 1 -->*/}
                    {post?.comments?.map((comment) => (
                        <Fragment key={comment._id}>
                            <Comment comment={comment} postId={post._id} />
                        </Fragment>
                    ))}
                    {/* <Post post={post} />*/}
                </div>
            </div>
            {/* <div className="p-4 flex flex-nowrap">
                <Avatar className="size-12">
                    <AvatarImage
                        src={post?.author?.avatar}
                        alt={post?.author?.avatar}
                    />
                    <AvatarFallback>{post?.author?.username}</AvatarFallback>
                </Avatar>
                <div className="ml-2 flex flex-col flex-nowrap">
                    <h2 className="text-lg font-bold">{post?.author?.name}</h2>
                    <p className="text-sm text-zinc-500">
                        @{post?.author?.username}
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="ml-auto cursor-pointer text-lg filter invert brightness-0 hover:text-blue-500"
                >
                    🔒
                </Button>
            </div>
            <div className="px-4 text-lg">{post?.content} </div>
            <div className="p-4 text-zinc-500">
                {post?.createdTime} · {post?.createdDate} ·{" "}
                <span className="text-zinc-50 font-bold">{post?.views}</span>{" "}
                Views
            </div>
            <div className="py-2 w-full flex flex-nowrap justify-around text-zinc-500 border-t border-t-zinc-500 border-b border-b-zinc-500">
                <Button variant="ghost" className="cursor-pointer">
                    <MessageCircle /> {post?.commentsCount}
                </Button>
                <Button
                    variant="ghost"
                    className="cursor-pointer hover:text-green-500"
                >
                    <Repeat2 /> 0
                </Button>
                <Button
                    variant="ghost"
                    className="cursor-pointer hover:text-pink-500"
                    onClick={handlePostLike}
                >
                    <Heart /> {post?.likesCount}
                </Button>
                <Button
                    variant="ghost"
                    className="cursor-pointer hover:text-yellow-500"
                >
                    <Eye /> {post?.views}
                </Button>
                <Button
                    variant="ghost"
                    className="cursor-pointer hover:text-blue-500"
                    onClick={handlePostBookmark}
                >
                    <Bookmark />
                </Button>
            </div>
            <div className="flex flex-col flex-nowrap gap-2 p-4">
                <div className="flex flex-nowrap gap-4">
                    <Avatar className="size-12">
                        <AvatarImage src={user?.avatar} alt={user?.avatar} />
                        <AvatarFallback>{user?.username}</AvatarFallback>
                    </Avatar>
                    <Textarea
                        placeholder="Post your reply..."
                        className="resize-none"
                        onChange={(e) => setReplyText(e.target.value)}
                        value={replyText}
                    />
                </div>
                <Button
                    className="cursor-pointer font-bold ml-auto disabled:bg-zinc-300 disabled:text-zinc-800"
                    disabled={replyText.trim()?.length === 0}
                    onClick={handleCreateComment}
                >
                    Reply
                </Button>
            </div>
            <div>
                {post?.comments &&
                    post?.comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="border-y border-y-zinc-500"
                        >
                            <div className="flex flex-col flex-nowrap gap-2 p-4">
                                <div className="flex flex-nowrap">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src={comment.author?.avatar}
                                            alt={comment.author?.username}
                                        />
                                        <AvatarFallback>
                                            {comment.author?.username}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="px-2 flex flex-col flex-nowrap">
                                        <span className="font-bold">
                                            {comment.author?.name}
                                        </span>{" "}
                                        <span className="text-zinc-500 text-sm">
                                            @{comment.author?.username}
                                        </span>
                                    </div>
                                </div>
                                <div className="px-4">{comment.content}</div>
                                <div className="w-full flex flex-nowrap justify-around text-zinc-500">
                                    <Button
                                        variant="ghost"
                                        className="cursor-pointer"
                                    >
                                        <MessageCircle />{" "}
                                        {comment?.commentsCount}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="cursor-pointer hover:text-pink-500"
                                        onClick={(e) =>
                                            handleCommentLike(e, comment._id)
                                        }
                                    >
                                        <Heart /> {comment?.likesCount}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="cursor-pointer hover:text-yellow-500"
                                    >
                                        <Eye /> 0
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>*/}
        </div>
    );
};

export default PostPage;
