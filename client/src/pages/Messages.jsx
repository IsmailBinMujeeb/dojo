import { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import { AuthContext } from "@/context/authContext";
import { useNavigate } from "react-router-dom";

dayjs.extend(relative);

const Chat = ({ user, recentMessage, chatId, onChatThreadClick }) => {
    const isActiveChat = window.location.pathname.includes(chatId);
    if (!user) return null;
    return (
        <>
            <div
                className={`p-4 rounded-md cursor-pointer border-l-4 border-primary ${!isActiveChat ? "border-none hover:bg-white/60 bg-white/90" : "bg-white shadow-sm"}`}
                onClick={onChatThreadClick}
            >
                <div className="flex items-start gap-3">
                    <img
                        alt={user?.name}
                        className="w-12 h-12 rounded-full object-cover"
                        data-alt="portrait of a senior professor with a white beard and intelligent eyes"
                        src={user?.avatar}
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-bold text-secondary truncate">
                                {user?.name}
                            </h3>
                            <span className="text-[10px] font-bold text-secondary bg-secondary/20 py-1 px-2 rounded-md">
                                {dayjs(recentMessage?.createdAt).fromNow()}
                            </span>
                        </div>
                        <p className="text-xs font-bold text-tertiary truncate mt-0.5">
                            {user?.academicRank}
                        </p>
                        <p className="text-sm text-secondary/50 truncate mt-1">
                            {recentMessage?.message}
                        </p>
                    </div>
                </div>
            </div>
        </>
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
        <div className="flex flex-col p-6 gap-2">
            {chats &&
                chats.map((c) => (
                    <div
                        key={c?._id}
                        className="cursor-pointer"
                        onClick={() => navigate(`/chat/${c?._id}`)}
                    >
                        {user?._id === c?.userIdOne?._id ? (
                            <Chat
                                user={c?.userIdTwo}
                                recentMessage={c?.recentMessage}
                            />
                        ) : (
                            <Chat
                                user={c?.userIdOne}
                                recentMessage={c?.recentMessage}
                            />
                        )}
                    </div>
                ))}
            <div className="p-4 text-center text-zinc-500 font-semibold">
                This is all we have.
            </div>
        </div>
    );
};

export default Messages;
