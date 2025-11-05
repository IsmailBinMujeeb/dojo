import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, Repeat2, Bookmark, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Post = ({ post }) => {
  const navigate = useNavigate();

  async function handleLike(e) {
    e.stopPropagation();
    try {
      await fetch(`${import.meta.env.VITE_API_ENDPOINT}/like/${post?._id}`, {
        credentials: "include",
        method: "POST",
      });
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
    } catch (error) {
      console.log(error);
    }
  }

  const handlePostClick = () => {
    navigate(`/post/${post?._id}`);
  };

  return (
    <div
      className="flex flex-col w-full border-b border-b-zinc-500 p-4 cursor-pointer hover:bg-zinc-900 transition-colors duration-100"
      key={post?._id}
      onClick={handlePostClick}
    >
      <div className="flex gap-4 flex-nowrap">
        <Avatar>
          <AvatarImage src={post?.author?.avatar} alt={post?.author?.avatar} />
          <AvatarFallback>{post?.author?.username}</AvatarFallback>
        </Avatar>
        <div className="flex flex-nowrap gap-2">
          <div className="font-bold">{post?.author?.name}</div>
          <div className="text-zinc-500">
            @{post?.author?.username} - {post?.createdAt}
          </div>
        </div>
      </div>
      <div className="my ml-6">{post?.content}</div>
      <div className="w-full flex flex-nowrap justify-around text-zinc-500 mt-2">
        <Button variant="ghost" className="cursor-pointer">
          <MessageCircle /> {post?.commentsCount}
        </Button>
        <Button variant="ghost" className="cursor-pointer hover:text-green-500">
          <Repeat2 /> 0 {/* TODO: Add feature of reposts */}
        </Button>
        <Button
          variant="ghost"
          className="cursor-pointer hover:text-pink-500"
          onClick={handleLike}
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
          onClick={handleBookmark}
        >
          <Bookmark />
        </Button>
      </div>
    </div>
  );
};

export default Post;
