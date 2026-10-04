import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { Spinner } from "@/components/ui/spinner";
import Post from "@/components/Post";
import PostComposer from "@/components/PostComposer";

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
