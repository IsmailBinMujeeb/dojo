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
import { Book, ScrollText, Star, UsersRound } from "lucide-react";
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

// const ProfileDetails = ({ user }) => {
//     return (
//         <div class="max-w-6xl mx-auto p-6">
//             <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
//                 {/* <!-- Identity Card -->*/}
//                 <div class="md:col-span-8 bg-white p-8 rounded-xl shadow-sm border-l-8 border-primary relative overflow-hidden">
//                     <div class="flex flex-col md:flex-row gap-8 items-start relative z-10">
//                         <div class="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl rotate-3 shrink-0">
//                             <img
//                                 class="w-full h-full object-cover"
//                                 data-alt="professional academic woman in her 40s smiling warmly in a bright modern workspace"
//                                 src={user.avatar}
//                             />
//                         </div>
//                         <div class="flex-1">
//                             <span class="bg-tertiary/20 text-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
//                                 {user.academicRank}
//                             </span>
//                             <h2 class="text-4xl md:text-6xl font-black tracking-tighter text-on-surface mb-2 leading-none">
//                                 {user.name}
//                             </h2>
//                             <div class="flex flex-wrap gap-3 mt-12">
//                                 <button class="bg-primary text-secondary cursor-pointer px-8 py-3 rounded-lg font-black text-sm uppercase tracking-tighter shadow-md hover:translate-y-0.5 transition-transform">
//                                     Follow Professor
//                                 </button>
//                                 <button class="bg-secondary text-accent cursor-pointer px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-tighter hover:bg-surface-container-highest transition-colors">
//                                     Direct Inquiry
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* <!-- Stats Card -->*/}
//                 <div class="md:col-span-4 grid grid-cols-2 gap-4">
//                     <div class="bg-white p-6 rounded-xl flex flex-col justify-between">
//                         <span
//                             class="material-symbols-outlined text-primary-dim text-3xl"
//                             data-icon="book"
//                         >
//                             <Book />
//                         </span>
//                         <div>
//                             <div class="text-3xl font-black">142</div>
//                             <div class="text-[10px] uppercase tracking-widest font-bold opacity-60">
//                                 Publications
//                             </div>
//                         </div>
//                     </div>
//                     <div class="bg-white p-6 rounded-xl flex flex-col justify-between">
//                         <span
//                             class="material-symbols-outlined text-primary-dim text-3xl"
//                             data-icon="history_edu"
//                         >
//                             <ScrollText />
//                         </span>
//                         <div>
//                             <div class="text-3xl font-black">15y</div>
//                             <div class="text-[10px] uppercase tracking-widest font-bold opacity-60">
//                                 Tenure
//                             </div>
//                         </div>
//                     </div>
//                     <div class="bg-white p-6 rounded-xl flex flex-col justify-between">
//                         <span
//                             class="material-symbols-outlined text-primary-dim text-3xl"
//                             data-icon="group"
//                         >
//                             <UsersRound />
//                         </span>
//                         <div>
//                             <div class="text-3xl font-black">12.4k</div>
//                             <div class="text-[10px] uppercase tracking-widest font-bold opacity-60">
//                                 Followers
//                             </div>
//                         </div>
//                     </div>
//                     <div class="bg-white p-6 rounded-xl flex flex-col justify-between">
//                         <span
//                             class="material-symbols-outlined text-primary-dim text-3xl"
//                             data-icon="star"
//                         >
//                             <Star />
//                         </span>
//                         <div>
//                             <div class="text-3xl font-black">4.9</div>
//                             <div class="text-[10px] uppercase tracking-widest font-bold opacity-60">
//                                 Following
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div class="mb-12">
//                 <div class="flex items-baseline gap-4 mb-6">
//                     <h3 class="text-2xl font-black tracking-tighter uppercase">
//                         The Scholarly Path
//                     </h3>
//                     <div class="h-0.5 flex-1 bg-secondary/10"></div>
//                 </div>
//                 <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     <div class="md:col-span-2 space-y-4">
//                         <p class="text-body-lg text-on-surface leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
//                             {user.bio.split("\n")[0]}
//                         </p>
//                         {user.bio
//                             .split("\n")
//                             .slice(1)
//                             .map((para, index) => (
//                                 <>
//                                     <p
//                                         className="text-body-lg text-on-surface-variant leading-relaxed"
//                                         key={index}
//                                     >
//                                         {para}
//                                     </p>
//                                 </>
//                             ))}
//                     </div>
//                     <div class="bg-white p-6 rounded-xl space-y-4">
//                         <h4 class="text-xs font-black uppercase tracking-widest border-b border-outline-variant pb-2">
//                             Interests
//                         </h4>
//                         <div class="flex flex-wrap gap-2">
//                             <span class="bg-tertiary/20 text-tertiary px-3 py-1 rounded text-xs font-bold">
//                                 Cognitive Flow
//                             </span>
//                             <span class="bg-tertiary/20 text-tertiary px-3 py-1 rounded text-xs font-bold">
//                                 Kinetic Memory
//                             </span>
//                             <span class="bg-tertiary/20 text-tertiary px-3 py-1 rounded text-xs font-bold">
//                                 Spatial Logic
//                             </span>
//                             <span class="bg-tertiary/20 text-tertiary px-3 py-1 rounded text-xs font-bold">
//                                 Neural Spacing
//                             </span>
//                             <span class="bg-tertiary/20 text-tertiary px-3 py-1 rounded text-xs font-bold">
//                                 Bio-Rhythmics
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

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
            {/* <AspectRatio ratio={3 / 1}>
                <img
                    src={user.coverPhoto}
                    alt={user.username}
                    className="w-full"
                />
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
            </div>*/}
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
