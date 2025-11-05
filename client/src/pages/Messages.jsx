import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PanelWrapper from "@/components/panel-wrapper";
import { Protected } from "@/components/Protected";
import { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import { AuthContext } from "@/context/authContext";
import { useNavigate } from "react-router-dom";

dayjs.extend(relative);

const Chat = ({ user, recentMessage }) => {
  return (
    <div className="p-4 border-y border-zinc-500 flex flex-nowrap gap-4">
      <Avatar className="size-12">
        <AvatarImage src={user?.avatar} />
        <AvatarFallback>{user?.username}</AvatarFallback>
      </Avatar>
      <div>
        <div>
          <span className="font-bold text-lg">{user?.name}</span>{" "}
          <span className="text-zinc-500 text-sm">
            ㆍ {dayjs(recentMessage?.createdAt).fromNow()}
          </span>
        </div>
        <div className="truncate w-lg">{recentMessage?.message}</div>
      </div>
    </div>
  );
};

const Messages = () => {
  const [chats, setChats] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/chat`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          console.error(response.statusText);
        }

        const json = await response.json();
        setChats(json.data);
        console.log(json.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <Protected>
      <PanelWrapper>
        <div className="flex flex-col">
          {chats &&
            chats.map((c) => (
              <div
                key={c?._id}
                className="hover:bg-zinc-900 cursor-pointer"
                onClick={() => navigate(`/chat/${c?._id}`)}
              >
                {user?._id === c?.userIdOne?._id ? (
                  <Chat user={c?.userIdTwo} recentMessage={c?.recentMessage} />
                ) : (
                  <Chat user={c?.userIdOne} recentMessage={c?.recentMessage} />
                )}
              </div>
            ))}
        </div>
      </PanelWrapper>
    </Protected>
  );
};

export default Messages;
