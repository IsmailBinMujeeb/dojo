import { Heart, MessageSquareText, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { ShareDialog } from "./ShareDialog";

dayjs.extend(relative);

const Comment = ({ comment, postId }) => {
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(comment?.isLiked);

    async function handleLike(e) {
        e.stopPropagation();
        try {
            await fetch(
                `${import.meta.env.VITE_API_ENDPOINT}/comment-like/${comment?._id}`,
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

    const handleCommentClick = () => {
        navigate(`/post/${comment?._id}?postId=${postId}&isComment=true`);
    };

    return (
        <article className="post-card bg-white hover:bg-accent cursor-pointer p-6 transition-all mb-2 shadow-xs">
            <div className="flex gap-4">
                <div className="flex flex-col items-center">
                    <img
                        alt="Author"
                        className="w-12 h-12 rounded-lg object-cover"
                        data-alt="Portrait of a female researcher in a modern laboratory setting with soft blue background lighting"
                        src={comment?.author?.avatar}
                    />
                    <div className="w-px h-full bg-outline-variant mt-2 opacity-20"></div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-secondary">
                                {comment?.author?.name}
                            </span>
                            <span className="text-[10px] bg-primary text-secondary px-2 py-0.5 rounded uppercase font-bold tracking-widest">
                                @{comment?.author?.username}
                            </span>
                        </div>
                        <span className="text-xs text-secondary font-label">
                            {dayjs(comment?.createdAt).fromNow()}
                        </span>
                    </div>
                    <p className="text-body-lg text-secondary leading-relaxed mb-4">
                        {comment?.content.split("\n").map((para, index) => (
                            <span key={index}>
                                {para}
                                <br />
                            </span>
                        ))}
                    </p>
                    {/* <div className="overflow-hidden mb-4 border border-secondary">
                        <img
                            alt="Brain Scan"
                            className="w-full h-64 object-cover"
                            data-alt="Abstract vibrant 3D visualization of neural networks and synaptic connections glowing with yellow and teal light"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDso95ys5CPRD7fjpb_IHUMEmhw_9-yX5pmyGFj2PD-qLvw7zoJG4Xjx0YxzFn6snPGkTNJzpPiFGPNBqnjoIBMDB016cAf1f7LsDMoFOMdDvjE8psu7l8XoAeNPIzbsjIDBHSj7az-bBpqe21My_oDBFQU3tAilaGN6l88xulGP-2jVRck7MG2P7AIht59HZP7RWalI6VH-VtkQsxXe6sIk6h-KvNRYSrgwjiNmjm6F90UDyRyn3o2ZCsYb-I33MAXbnOQwTqhfFEJ"
                        />
                    </div>*/}
                    <div className="flex justify-between items-center text-on-surface-variant">
                        <div className="flex gap-6">
                            <button
                                className="flex items-center gap-1 p-2 rounded-md cursor-pointer transition-colors hover:bg-secondary/10"
                                onClick={handleCommentClick}
                            >
                                <span
                                    className="material-symbols-outlined text-[20px]"
                                    data-icon="chat_bubble"
                                >
                                    <MessageSquareText />
                                </span>
                                <span className="text-xs font-bold">
                                    {comment?.commentsCount}
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
                                        fill={isLiked ? "red" : "white"}
                                        color={isLiked ? "red" : "black"}
                                    />
                                </span>
                                <span className="text-xs font-bold">
                                    {comment?.likesCount}
                                </span>
                            </button>
                        </div>
                        <ShareDialog
                            link={`${window.location.origin}/post/${comment?._id}?isComment=true`}
                        />
                    </div>
                </div>
            </div>
        </article>
    );
};

export default Comment;
