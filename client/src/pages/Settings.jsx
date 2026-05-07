import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
    ItemActions,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/authContext";
import { useEffect } from "react";
import { useRef } from "react";

const Settings = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDeleting, setisDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [fullName, setFullName] = useState(null);
    const [location, setLocation] = useState(null);
    const [websiteLink, setWebsiteLink] = useState(null);
    const [bio, setBio] = useState(null);
    const [academic, setAcademic] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const avatarRef = useRef(null);

    useEffect(() => {
        if (!user || fullName === "" || bio === "" || academic === "")
            return setHasChanges(false);

        if (fullName === user.name) setFullName(null);
        if (location === user.location) setLocation(null);
        if (websiteLink === user.website) setWebsiteLink(null);
        if (bio === user.bio) setBio(null);
        if (academic === user.acadmicRank) setAcademic(null);

        if (
            fullName === null &&
            location === null &&
            websiteLink === null &&
            bio === null &&
            academic === null &&
            avatar === null
        ) {
            return setHasChanges(false);
        }

        setHasChanges(true);
    }, [user, fullName, location, websiteLink, bio, academic, avatar]);

    const handleDeleteAccount = async () => {
        try {
            setisDeleting(true);
            await fetch(`${import.meta.env.VITE_API_ENDPOINT}/user`, {
                method: "DELETE",
                credentials: "include",
            });
            navigate("/signup");
        } catch (error) {
            console.error(error);
        } finally {
            setisDeleting(false);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setAvatar(file);

        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
    };

    const handleSaveAccount = async () => {
        if (!hasChanges) return;

        try {
            setIsSaving(true);

            const formData = new FormData();
            formData.append("avatar", avatar);
            formData.append("name", fullName || user.name);
            formData.append("location", location || user.location);
            formData.append("website", websiteLink || user.website);
            formData.append("bio", bio || user.bio);
            formData.append("academicRank", academic || user.academicRank);

            console.log(user);

            await fetch(`${import.meta.env.VITE_API_ENDPOINT}/user`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });

            setHasChanges(false);
            navigate("/profile");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex w-full max-w-2xl flex-col gap-6 mx-auto my-4">
            <section className="bg-white p-8 rounded-md" id="account">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-md overflow-hidden border-4 border-primary">
                        <img
                            className="w-full h-full object-cover"
                            data-alt="detailed close up of a professional headshot with warm lighting and neutral background"
                            src={avatarPreview || user?.avatar}
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">
                            Personal Information
                        </h3>
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            ref={avatarRef}
                            onChange={handleAvatarChange}
                        />
                        <button
                            className="text-xs font-bold text-yellow-600 uppercase tracking-widest mt-1"
                            onClick={() => avatarRef.current?.click()}
                        >
                            Change Avatar
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">
                            Full Name
                        </label>
                        <Input
                            className="w-full"
                            type="text"
                            value={fullName !== null ? fullName : user?.name}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">
                            Academic Rank
                        </label>
                        <Input
                            className="w-full"
                            type="text"
                            value={academic || user?.academicRank}
                            onChange={(e) => setAcademic(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">
                            Website Link
                        </label>
                        <Input
                            className="w-full"
                            type="text"
                            value={
                                websiteLink !== null
                                    ? websiteLink
                                    : user?.website
                            }
                            onChange={(e) => setWebsiteLink(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">
                            Location
                        </label>
                        <Input
                            className="w-full"
                            type="text"
                            value={
                                location !== null ? location : user?.location
                            }
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">
                            Bio
                        </label>
                        <textarea
                            className="w-full resize-none bg-input p-3 text-sm rounded-md"
                            rows="6"
                            value={bio !== null ? bio : user?.bio}
                            onChange={(e) => setBio(e.target.value)}
                        >
                            Investigating the intersection of decentralized
                            kinetics and cognitive load in digital spaces. Lead
                            researcher at the Kinetic Lab.
                        </textarea>
                    </div>
                </div>
                <Button
                    className="mt-4 float-right cursor-pointer disabled:opacity-50"
                    onClick={handleSaveAccount}
                    disabled={!hasChanges || isSaving}
                >
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </section>

            <Item variant="outline" className="bg-white border-none">
                <ItemContent>
                    <ItemTitle>Delete Account</ItemTitle>
                    <ItemDescription>
                        This action is non-reversible and will permanently
                        delete your account. Please confirm your decision.
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    {isDeleting ? (
                        <Button
                            variant="destructive"
                            className="cursor-progress"
                            size="sm"
                        >
                            Deleting...
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            className="cursor-pointer"
                            size="sm"
                            onClick={handleDeleteAccount}
                        >
                            Delete Account
                        </Button>
                    )}
                </ItemActions>
            </Item>
        </div>
    );
};

export default Settings;
