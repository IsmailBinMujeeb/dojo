import { Protected } from "@/components/Protected";
import PanelWrapper from "@/components/panel-wrapper";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useContext, useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { MapPin, Link2, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import Post from "@/components/Post";

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [editedUser, setEditedUser] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) return;
    setEditedUser({
      name: user.name,
      website: user.website,
      location: user.location,
      bio: user.bio,
    });
  }, [user]);

  async function submit() {
    try {
      setIsUpdating(true);
      console.log(JSON.stringify(editedUser));
      const response = await fetch(`http://localhost:3000/api/user`, {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });

      const json = await response.json();
      const data = json.data;

      setUser((prev) => ({
        ...prev,
        name: data.name,
        bio: data.bio,
        location: data.location,
        website: data.website,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  }

  function handleInput(field, value) {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <Dialog className="overflow-auto">
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Change content to edit profile</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={editedUser?.name || "Loading..."}
              onChange={(e) => handleInput("name", e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              name="bio"
              value={editedUser?.bio || "Loading..."}
              onChange={(e) => handleInput("bio", e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={editedUser?.location || "Loading..."}
              onChange={(e) => handleInput("location", e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={editedUser?.website || "Loading..."}
              onChange={(e) => handleInput("website", e.target.value)}
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

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      try {
        const data = await fetch(
          `http://localhost:3000/api/user/posts/${user._id}`,
          {
            credentials: "include",
          },
        );
        const json = await data.json();
        console.log(json.data, "JSON");

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
          <AspectRatio ratio={3 / 1}>
            <img src={user.coverPhoto} alt={user.username} className="w-full" />
          </AspectRatio>
          <Avatar className="size-[135px] absolute top-[135px] left-1/40">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username}</AvatarFallback>
          </Avatar>
          <div className="float-right m-4">
            <EditProfile />
          </div>
          <div className="my-4">
            <div className="m-8 gap-2 flex flex-col">
              <div className="flex flex-col gap">
                <div className="text-2xl font-bold">{user.name}</div>
                <div className="text-zinc-500">@{user.username}</div>
              </div>
              <div className="font-light">{user.bio}</div>
              <div className="flex gap-6 text-zinc-500">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4" /> {user.location}
                </div>
                <div className="flex items-center gap-2">
                  <Link2 className="size-4" />{" "}
                  <a href={user.website} className="text-blue-400">
                    {user.website}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4" /> {user.joinedAt}
                </div>
              </div>
              <div className="text-zinc-500 flex gap-4 ">
                <Link to={`/followers/${user?._id}`}>
                  <span className="text-white font-semibold">
                    {user.followersCount}
                  </span>{" "}
                  Followers
                </Link>
                <Link to={`/following/${user?._id}`}>
                  <span className="text-white font-semibold">
                    {user.followingCount}
                  </span>{" "}
                  Following
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-t-zinc-500">
            {posts &&
              posts.map((post) => <Post post={post} key={post._id}></Post>)}
          </div>
        </div>
      </PanelWrapper>
    </Protected>
  );
};

export default Profile;
