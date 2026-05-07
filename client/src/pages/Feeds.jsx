import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { Spinner } from "@/components/ui/spinner";
import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { ChartNoAxesColumn, Image, Paperclip } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PostComposer = ({ user }) => {
    const [content, setContent] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    async function submit() {
        try {
            setIsUpdating(true);

            await fetch(`${import.meta.env.VITE_API_ENDPOINT}/post`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content }),
            });

            setContent("");
            navigate(0);
        } catch (error) {
            console.log(error);
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <>
            <section className="mb-4 bg-white p-6 rounded-xl border-b-4 shadow-sm border-primary">
                <div className="flex gap-4">
                    <img
                        alt="User"
                        className="w-12 h-12 rounded-lg object-cover"
                        data-alt="Close-up portrait of a young male academic in a creative studio setting with warm natural sunlight"
                        src={user?.avatar}
                    />
                    <div className="flex-1">
                        <textarea
                            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-body-lg resize-none min-h-20"
                            placeholder="Synthesize your latest findings..."
                            rows="3"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-surface-container">
                            <div className="flex gap-2 text-primary">
                                <button className="p-2 hover:bg-secondary/10 rounded-md cursor-pointer text-secondary">
                                    <span
                                        className="material-symbols-outlined"
                                        data-icon="image"
                                    >
                                        <Image />
                                    </span>
                                </button>
                                <button className="p-2 hover:bg-secondary/10 rounded-md cursor-pointer text-secondary">
                                    <span
                                        className="material-symbols-outlined"
                                        data-icon="bar_chart"
                                    >
                                        <ChartNoAxesColumn />
                                    </span>
                                </button>
                                <button className="p-2 hover:bg-secondary/10 rounded-md cursor-pointer text-secondary">
                                    <span
                                        className="material-symbols-outlined"
                                        data-icon="attach_file"
                                    >
                                        <Paperclip />
                                    </span>
                                </button>
                            </div>
                            <Button
                                className="font-bold rounded-lg active:scale-95 transition-transform disabled:opacity-50"
                                onClick={submit}
                                disabled={isUpdating || !content.trim()}
                            >
                                {isUpdating ? "Posting..." : "Post"}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

const Feeds = () => {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!user?._id) return;
        (async () => {
            try {
                const data = await fetch(
                    `${import.meta.env.VITE_API_ENDPOINT}/post`,
                    {
                        credentials: "include",
                    },
                );
                const json = await data.json();

                setPosts(json.data);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [user?._id]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full px-12 py-8">
            <div>
                <PostComposer user={user} />
                {posts &&
                    posts.map((post) => (
                        <Post post={post} key={post._id}></Post>
                    ))}
                <div className="p-4 text-center text-zinc-500 font-semibold">
                    This is all we have.
                </div>
            </div>
        </div>
    );
};

export default Feeds;
