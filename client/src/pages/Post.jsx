import { Protected } from "@/components/Protected";
import PanelWrapper from "@/components/panel-wrapper";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MapPin, Link2, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import Post from "@/components/Post";
import { useParams } from "react-router-dom";
import {
  Sparkle,
  MessageCircle,
  Repeat2,
  Heart,
  Eye,
  Bookmark,
} from "lucide-react";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const [replyText, setReplyText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      try {
        const data = await fetch(`http://localhost:3000/api/post/${id}`, {
          credentials: "include",
        });

        if (data.status === 404) {
          navigate("/not-found");
          return;
        }
        const json = await data.json();
        console.log(json.data, "JSON");

        setPost(json.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [id, user?._id, navigate]);

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

  async function handlePostLike(e) {
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
    if (!post._id) return;
    const data = await fetch(`http://localhost:3000/api/comment/${post._id}`, {
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

    navigate("/feeds");
  };

  async function handleCommentLike(e, commentId) {
    e.stopPropagation();
    try {
      await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/comment-like/${commentId}`,
        {
          credentials: "include",
          method: "POST",
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Protected>
      <PanelWrapper>
        <div>
          <div className="p-4 flex flex-nowrap">
            <Avatar className="size-12">
              <AvatarImage
                src={post?.author?.avatar}
                alt={post?.author?.avatar}
              />
              <AvatarFallback>{post?.author?.username}</AvatarFallback>
            </Avatar>
            <div className="ml-2 flex flex-col flex-nowrap">
              <h2 className="text-lg font-bold">{post?.author?.name}</h2>
              <p className="text-sm text-zinc-500">@{post?.author?.username}</p>
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
            <span className="text-zinc-50 font-bold">{post?.views}</span> Views
          </div>
          <div className="py-2 w-full flex flex-nowrap justify-around text-zinc-500 border-t border-t-zinc-500 border-b border-b-zinc-500">
            <Button variant="ghost" className="cursor-pointer">
              <MessageCircle /> {post?.commentsCount}
            </Button>
            <Button
              variant="ghost"
              className="cursor-pointer hover:text-green-500"
            >
              <Repeat2 /> 0 {/* TODO: Add feature of reposts */}
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
                <AvatarImage
                  src={post?.author?.avatar}
                  alt={post?.author?.avatar}
                />
                <AvatarFallback>{post?.author?.username}</AvatarFallback>
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
                <div key={comment._id} className="border-y border-y-zinc-500">
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
                      <Button variant="ghost" className="cursor-pointer">
                        <MessageCircle /> {comment?.commentsCount}
                      </Button>
                      <Button
                        variant="ghost"
                        className="cursor-pointer hover:text-pink-500"
                        onClick={(e) => handleCommentLike(e, comment._id)}
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
          </div>
        </div>
      </PanelWrapper>
    </Protected>
  );
};

export default Profile;
