import { Link } from "react-router-dom";
import {
  Home,
  Bell,
  Bookmark,
  Search,
  Settings,
  Mail,
  Sparkles,
  UserRound,
  EllipsisVertical,
  LockKeyhole,
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
        <Button className="p-4 rounded-full w-full my-10 cursor-pointer">
          Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Post</DialogTitle>
          <DialogDescription>
            Whats In Your Mind? Share your thoughts, ideas, or updates with the
            community.
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
            {isUpdating ? "Updating..." : "Save"}
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
      <div className="w-[75%]">
        <div>
          <h2 className="text-3xl py-4">Dojo</h2>
        </div>
        <ul>
          <li>
            <Link
              className="flex gap-2 text-2xl items-center p-2 hover:bg-zinc-800 rounded-full"
              to="/feeds"
            >
              <Home />
              Home
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-2 text-2xl items-center p-2 hover:bg-zinc-800 rounded-full"
              to="/explore/i"
            >
              <Search />
              Explore
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-2 text-2xl items-center p-2 hover:bg-zinc-800 rounded-full"
              to="/notifications"
            >
              <LockKeyhole />
              Notifications
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-2 text-2xl items-center p-2 hover:bg-zinc-800 rounded-full"
              to="/messages"
            >
              <LockKeyhole />
              Messages
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-2 text-2xl items-center p-2 hover:bg-zinc-800 rounded-full"
              to="/dojoai"
            >
              <LockKeyhole />
              Dojo AI
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-2 text-2xl items-center p-2 hover:bg-zinc-800 rounded-full"
              to="/profile"
            >
              <UserRound />
              Profile
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-2 text-2xl items-center p-2 hover:bg-zinc-800 rounded-full"
              to="/bookmarks"
            >
              <Bookmark />
              Bookmarks
            </Link>
          </li>
          <li>
            <Link
              className="flex gap-2 text-2xl items-center p-2 hover:bg-zinc-800 rounded-full"
              to="/settings"
            >
              <Settings />
              Settings
            </Link>
          </li>
        </ul>
        <CreatePost />
      </div>
      <div className="flex flex-nowrap w-full justify-around">
        <div className="flex gap-4">
          <Avatar className={"w-10 h-10"}>
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback>{user?.name}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center justify-start">
            <p className="text font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-500">@{user?.username}</p>
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
