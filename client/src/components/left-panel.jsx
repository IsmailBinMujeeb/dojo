import { Link } from "react-router-dom";
import {
    Home,
    Bell,
    Bookmark,
    Search,
    Settings,
    UserRound,
    EllipsisVertical,
    MessageCircle,
    Snowflake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { AuthContext } from "@/context/authContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

const NAVIGATION_ITEMS = [
    {
        label: "Home",
        icon: Home,
        path: "/feeds",
    },
    {
        label: "Explore",
        icon: Search,
        path: "/explore",
    },
    {
        label: "Notifications",
        icon: Bell,
        path: "/notifications",
    },
    {
        label: "Chat",
        icon: MessageCircle,
        path: "/messages",
    },
    // {
    //     label: "Dojo AI",
    //     icon: Snowflake,
    //     path: "/dojoai",
    // },
    {
        label: "Bookmarks",
        icon: Bookmark,
        path: "/bookmarks",
    },
    {
        label: "Profile",
        icon: UserRound,
        path: "/profile",
    },
    {
        label: "Settings",
        icon: Settings,
        path: "/settings",
    },
];

const CreatePost = () => {
    const [content, setContent] = useState({});
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

            navigate("/feeds");
        } catch (error) {
            console.log(error);
        } finally {
            setIsUpdating(false);
        }
    }

    function handleInput(e) {
        setContent(e.target.value);
    }

    return (
        <Dialog className="overflow-auto">
            <DialogTrigger asChild>
                <Button className="w-full my-10">
                    <span className="font-bold text-xl">Create Post</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                    <DialogDescription>
                        Whats In Your Mind? Share your thoughts, ideas, or
                        updates with the community.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Textarea
                            placeholder="An AWS outage caused thousands of websites to go offline temporarily 😬"
                            onChange={handleInput}
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <Button type="submit" onClick={submit}>
                        {isUpdating ? "Updating..." : "Post"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const LeftPanel = () => {
    const { user } = useContext(AuthContext);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();

    async function logout() {
        try {
            setIsLoggingOut(true);
            await fetch(`${import.meta.env.VITE_API_ENDPOINT}/user/logout`, {
                credentials: "include",
                method: "POST",
            });

            navigate("/login");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoggingOut(false);
        }
    }
    return (
        <div className="w-full h-full flex flex-col gap-4 items-center justify-between p-4">
            <div className="w-full">
                <div className="flex items-center gap-2 flex-row">
                    <img
                        src="/favicon.png"
                        alt="Image"
                        className="size-8 object-contain rotate-12"
                    />
                    <h2 className="text-3xl py-4 font-bold">Dojo</h2>
                </div>
                <ul>
                    {NAVIGATION_ITEMS.map((item) => (
                        <li key={item.label} className="mb-1">
                            <Link
                                className={`flex gap-4 text-2xl items-center p-2 hover:bg-primary/10 rounded-md ${item.path === location.pathname ? "border-r-4 border-r-primary bg-primary/20" : ""}`}
                                to={item.path}
                            >
                                <item.icon
                                // fill={
                                //     item.path === location.pathname
                                //         ? "currentColor"
                                //         : "none"
                                // }
                                />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <CreatePost />
            </div>
            <div className="flex flex-nowrap w-full justify-around">
                <div className="flex gap-4">
                    <Avatar className={"w-10 h-10"}>
                        <AvatarImage src={user?.avatar} alt={user?.username} />
                        <AvatarFallback>{user?.name}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-start">
                        <p className="text font-semibold">{user?.name}</p>
                        <p className="text-xs text-gray-500">
                            @{user?.username}
                        </p>
                    </div>
                </div>
                <Popover>
                    <PopoverTrigger>
                        <EllipsisVertical />
                    </PopoverTrigger>
                    <PopoverContent>
                        <Button
                            variant={"outline"}
                            className="cursor-pointer w-full"
                            onClick={logout}
                        >
                            {isLoggingOut ? "Logging out..." : "Logout"}
                        </Button>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default LeftPanel;
