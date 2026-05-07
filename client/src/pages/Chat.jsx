import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import { AuthContext } from "@/context/authContext";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CirclePlus,
    FileText,
    Paperclip,
    Send,
    SmilePlus,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { io } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Fragment } from "react";

dayjs.extend(relative);
const socket = io(`${import.meta.env.VITE_SERVER_URL}`);

const ChatThread = ({
    user,
    recentMessage,
    onChatThreadClick,
    isActiveChat = false,
}) => {
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
                            <span className="text-[10px] font-bold text-primary">
                                JUST NOW
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

const Chat = () => {
    const { chatId } = useParams();
    const { user } = useContext(AuthContext);
    const [chat, setChat] = useState([]);
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [currentChatId, setCurrentChatId] = useState(chatId);
    const navigate = useNavigate();

    useEffect(() => {
        (async function () {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_ENDPOINT}/chat/${currentChatId}`,
                    {
                        credentials: "include",
                    },
                );

                if (response.status === 404) {
                    navigate("/notfound");
                }

                if (!response.ok) {
                    console.error(response.statusText);
                }

                const json = await response.json();

                socket.emit("joinroom", json.data?._id);
                setChat(json.data);
                setMessages(json.data?.messages || []);

                socket.on(
                    "newmessage",
                    ({ _id, message, senderId, receiverId }) => {
                        setMessages((prevMessages) => [
                            {
                                _id,
                                message,
                                senderId,
                                receiverId,
                                chatId: json.data?._id,
                            },
                            ...prevMessages,
                        ]);
                    },
                );
            } catch (error) {
                console.error(error);
            }
        })();

        return () => {
            socket.off("newmessage");
            socket.emit("leaveroom", currentChatId);
        };
    }, [currentChatId, navigate]);

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
        <div className="flex flex-col h-full">
            <div className="flex-1 flex overflow-hidden">
                <section className="w-80 lg:w-96 shrink-0 bg-accent flex flex-col border-r-0">
                    <div className="p-6">
                        <h2 className="text-2xl font-black tracking-tight text-secondary mb-2">
                            Discussions
                        </h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-secondary">
                            8 Active Threads
                        </p>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 space-y-2">
                        {/* <!-- Active Thread -->*/}
                        {chats.map((c) => {
                            return (
                                <div
                                    key={c._id}
                                    onClick={() => setCurrentChatId(c._id)}
                                >
                                    {user?._id === c?.userIdOne?._id ? (
                                        <ChatThread
                                            user={c?.userIdTwo}
                                            recentMessage={c?.recentMessage}
                                            isActiveChat={
                                                c?._id === currentChatId
                                            }
                                        />
                                    ) : (
                                        <ChatThread
                                            user={c?.userIdOne}
                                            recentMessage={c?.recentMessage}
                                            isActiveChat={
                                                c?._id === currentChatId
                                            }
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
                {/* <!-- Right Column: Active Chat (60% width) -->*/}
                <section className="flex-1 flex flex-col bg-surface-container-lowest">
                    {/* <!-- Message Feed -->*/}
                    <div className="flex-1 bg-white border-r-4 border-accent rounded-md overflow-y-auto p-8 space-y-8 flex flex-col">
                        {/* <!-- Recipient Message -->*/}
                        {messages?.map((m) => {
                            return (
                                <Fragment key={m._id}>
                                    {user?._id === m.senderId ? (
                                        <div className="flex items-end gap-4 self-end max-w-[80%] flex-row-reverse">
                                            <img
                                                alt="Avatar"
                                                className="w-8 h-8 rounded-full mb-1 shrink-0"
                                                data-alt="portrait of a senior professor with a white beard and intelligent eyes"
                                                src={user?.avatar}
                                            />
                                            <div className="space-y-1 flex flex-col items-end">
                                                <div className="bg-primary p-5 rounded-2xl rounded-br-none text-secondary leading-relaxed text-sm shadow-sm">
                                                    {m?.message}
                                                </div>
                                                <span className="text-[10px] font-bold text-secondary uppercase pr-1">
                                                    {dayjs(
                                                        m?.createdAt,
                                                    ).fromNow()}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-end gap-4 max-w-[80%]">
                                            <img
                                                alt="Avatar"
                                                className="w-8 h-8 rounded-full mb-1 shrink-0"
                                                data-alt="portrait of a senior professor with a white beard and intelligent eyes"
                                                src={
                                                    user?._id !==
                                                    chat?.userOne?._id
                                                        ? chat?.userOne?.avatar
                                                        : chat?.userTwo?.avatar
                                                }
                                            />
                                            <div className="space-y-1">
                                                <div className="bg-accent p-5 rounded-2xl rounded-bl-none text-on-surface leading-relaxed text-sm shadow-sm">
                                                    {m?.message}
                                                </div>
                                                <span className="text-[10px] font-bold text-secondary uppercase pl-1">
                                                    {dayjs(
                                                        m?.createdAt,
                                                    ).fromNow()}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </Fragment>
                            );
                        })}
                    </div>
                    {/* <!-- Message Input -->*/}
                    <div className="px-8 py-6 bg-white border-t-4 border-r-4 border-accent rounded-md">
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-secondary hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">
                                    <CirclePlus />
                                </span>
                            </button>
                            <div className="flex-1 relative">
                                <Input
                                    className="w-full py-4 pr-6 text-sm placeholder:text-secondary focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="WRITE YOUR SCHOLARLY RESPONSE..."
                                    type="text"
                                    value={messageText}
                                    onChange={(e) =>
                                        setMessageText(e.target.value)
                                    }
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-3">
                                    <button className="text-secondary hover:text-primary">
                                        <span className="material-symbols-outlined">
                                            <SmilePlus />
                                        </span>
                                    </button>
                                    <button className="text-secondary hover:text-primary">
                                        <span className="material-symbols-outlined">
                                            <Paperclip />
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <Button
                                className="font-black rounded-md flex items-center gap-2"
                                onClick={handleSendMessage}
                            >
                                <span className="material-symbols-outlined text-sm">
                                    <Send />
                                </span>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
            {/* {user?.username === chat?.userOne?.username ? (
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
            </div>*/}
        </div>
    );
};

export default Chat;
