import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContext";
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
import { ProfileDetails } from "@/components/ProfileDetailsCard";
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

            const response = await fetch(
                `${import.meta.env.VITE_API_ENDPOINT}/user`,
                {
                    credentials: "include",
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(editedUser),
                },
            );

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
                    <DialogDescription>
                        Change content to edit profile
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={editedUser?.name}
                            onChange={(e) =>
                                handleInput("name", e.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                            id="bio"
                            name="bio"
                            value={editedUser?.bio}
                            onChange={(e) => handleInput("bio", e.target.value)}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            value={editedUser?.location}
                            onChange={(e) =>
                                handleInput("location", e.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            name="website"
                            value={editedUser?.website}
                            onChange={(e) =>
                                handleInput("website", e.target.value)
                            }
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
                    `${import.meta.env.VITE_API_ENDPOINT}/user/posts/${user._id}`,
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
            <div className="flex items-center justify-center h-full">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <ProfileDetails
                user={user}
                isProfileOwner={true}
                postsCount={posts.length}
            />
            <div className="px-6">
                {posts &&
                    posts.map((post) => (
                        <Post post={post} key={post._id}></Post>
                    ))}
                <div className="p-4 text-center text-zinc-500 font-semibold">
                    This is all we have.
                </div>
            </div>
        </div>
    );
};

export default Profile;
