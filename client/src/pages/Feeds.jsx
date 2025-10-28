import { Protected } from "@/components/Protected";
import PanelWrapper from "@/components/panel-wrapper";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
import { Spinner } from "@/components/ui/spinner";
import Post from "@/components/Post";

const Feeds = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      try {
        const data = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/post`, {
          credentials: "include",
        });
        const json = await data.json();

        setPosts(json.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user?._id]);

  if (!user) {
    return (
      <Protected>
        <PanelWrapper>
          <div className="flex items-center justify-center h-full">
            <Spinner />
          </div>
        </PanelWrapper>
      </Protected>
    );
  }

  return (
    <Protected>
      <PanelWrapper>
        <div className="relative w-full h-full">
          <div className="border-t border-t-zinc-500">
            {posts &&
              posts.map((post) => <Post post={post} key={post._id}></Post>)}
          </div>
        </div>
      </PanelWrapper>
    </Protected>
  );
};

export default Feeds;
