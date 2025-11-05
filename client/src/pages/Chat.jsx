import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import PanelWrapper from "@/components/panel-wrapper";
import { Protected } from "@/components/Protected";
import { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import { AuthContext } from "@/context/authContext";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { io } from "socket.io-client";

dayjs.extend(relative);
const socket = io(`${import.meta.env.VITE_SERVER_URL}`);

const TopContainer = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-none w-full bg-zinc-800 p-2 items-center gap-2">
      <Button
        className="cursor-pointer hover:bg-zinc-700 bg-zinc-800 text-zinc-50"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="size-6" />
      </Button>
      <Avatar className="size-12">
        <AvatarImage src={user?.avatar} alt={user?.username} />
        <AvatarFallback>{user?.username}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="font-bold text-xl">{user?.name}</span>
        <span className="text-sm text-zinc-500">@{user?.username}</span>
      </div>
    </div>
  );
};

const Chat = () => {
  const [chat, setChat] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const { user } = useContext(AuthContext);
  const { chatId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/chat/${chatId}`,
          {
            credentials: "include",
          },
        );

        if (response.status === 404) {
          navigate("/not-found");
        }

        if (!response.ok) {
          console.error(response.statusText);
        }

        const json = await response.json();

        socket.emit("joinroom", json.data?._id);
        console.log(json.data);
        setChat(json.data);
        setMessages(json.data?.messages || []);

        socket.on("newmessage", ({ _id, message, senderId, receiverId }) => {
          setMessages((prevMessages) => [
            { _id, message, senderId, receiverId, chatId: json.data?._id },
            ...prevMessages,
          ]);
        });
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      socket.off("newmessage");
      socket.emit("leaveroom", chatId);
    };
  }, [chatId, navigate]);

  const handleSendMessage = async () => {
    try {
      const value = messageText;

      if (!value) return;

      const receiverId =
        user?._id === chat?.userOne?._id
          ? chat?.userTwo?._id
          : chat?.userOne?._id;

      socket.emit("sendmessage", {
        message: value,
        senderId: user?._id,
        receiverId,
        chatId: chat?._id,
      });

      setMessageText("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Protected>
      <PanelWrapper>
        <div className="flex flex-col h-full">
          {user?.username === chat?.userOne?.username ? (
            <TopContainer user={chat?.userTwo} />
          ) : (
            <TopContainer user={chat?.userOne} />
          )}
          <div className="flex-1 gap-2 flex w-full p-4 flex-col-reverse overflow-y-auto">
            {messages &&
              messages.map((m) =>
                user?._id === m?.senderId ? (
                  <div className="p-2 bg-zinc-100 text-zinc-900 rounded min-w-xs flex flex-col max-w-md ml-auto">
                    {m?.message}{" "}
                    <span className="text-xs text-zinc-500 ml-auto">
                      {dayjs(m?.createdAt).fromNow()}
                    </span>
                  </div>
                ) : (
                  <div className="p-2 bg-zinc-900 rounded min-w-xs flex flex-col max-w-md">
                    {m?.message}{" "}
                    <span className="text-xs text-zinc-500 ml-auto">
                      {dayjs(m?.createdAt).fromNow()}
                    </span>
                  </div>
                ),
              )}
          </div>
          <div className="flex flex-none w-full p-2">
            <Textarea
              placeholder="Type your message here..."
              className="resize-none rounded-r-none"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <Button
              className="cursor-pointer h-full rounded-l-none disabled:bg-zinc-500"
              disabled={messageText.trim().length === 0}
              onClick={handleSendMessage}
            >
              <Send />
            </Button>
          </div>
        </div>
      </PanelWrapper>
    </Protected>
  );
};

export default Chat;
