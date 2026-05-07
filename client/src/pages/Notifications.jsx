import { Spinner } from "@/components/ui/spinner";
import { AuthContext } from "@/context/authContext";
import { Heart, MessageSquare, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";

const NotificationItem = ({ data }) => {
    const types = {
        like: {
            icon: <Heart />,
            title: "Got a like",
            time: "1 HOUR AGO",
            color: "text-rose-500 bg-rose-100",
            user: data?.like?.user,
            message: `Liked your post.`,
        },
        comment: {
            icon: <MessageSquare />,
            title: "New Comment",
            time: "1 HOUR AGO",
            color: "text-teal-500 bg-teal-100",
            user: data?.comment?.user,
            message: `Commented on your post.`,
        },
        follow: {
            icon: <UserPlus />,
            title: "New Follower",
            time: "1 HOUR AGO",
            color: "text-blue-500 bg-blue-100",
            user: data?.follower,
            message: `Followed you.`,
        },
    };

    return (
        <div className="relative bg-white cursor-pointer rounded-md p-6 shadow-sm border-l-4 border-primary transition-all hover:translate-x-1 group">
            <div className="rounded-md pr-2 transition-all hover:bg-white/50 group translate-x-4">
                <div className="flex gap-6 items-start">
                    <div
                        className={`w-14 h-14 rounded-md flex items-center justify-center ${types[data.notificationType].color}`}
                    >
                        <span className="material-symbols-outlined text-2xl">
                            {types[data.notificationType].icon}
                        </span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-on-surface-variant tracking-wide uppercase">
                                {types[data.notificationType].title}
                            </span>
                            <span className="text-[10px] text-on-surface-variant font-medium">
                                {data.createdAt}
                            </span>
                        </div>
                        <p className="text-on-surface text-base leading-relaxed">
                            <span className="font-bold">
                                {types[data.notificationType].user?.name}
                            </span>{" "}
                            {types[data.notificationType].message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user?._id) return;

        (async () => {
            try {
                const data = await fetch(
                    `${import.meta.env.VITE_API_ENDPOINT}/user/notifications/${user._id}`,
                    {
                        credentials: "include",
                    },
                );
                const json = await data.json();
                console.log(json.data, "JSON");

                setNotifications(json.data);
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
        <div className="mx-auto bg-accent px-6 py-4">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-5xl font-black tracking-tighter leading-none">
                        Notifications
                    </h2>
                </div>
            </div>
            <div className="space-y-2">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification._id}
                        data={notification}
                    />
                ))}
            </div>
        </div>
    );
};

export default Notifications;
