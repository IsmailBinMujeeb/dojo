import { Star, UsersRound, Book, ScrollText } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ProfileDetails = ({
    user,
    isProfileOwner = false,
    postsCount = 0,
    isUserFollowingProfile = false,
    onFollow = () => {},
    isFollowingLoading = false,
}) => {
    const [followersCount, setFollowersCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.followersCount) {
            setFollowersCount(user.followersCount);
        }
    }, [user]);

    const handleFollow = () => {
        if (isUserFollowingProfile) {
            setFollowersCount((prevCount) => prevCount - 1);
        } else {
            setFollowersCount((prevCount) => prevCount + 1);
        }
        onFollow();
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
                {/* <!-- Identity Card -->*/}
                <div className="md:col-span-8 bg-white p-8 rounded-xl shadow-sm border-l-8 border-primary relative overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl rotate-3 shrink-0">
                            <img
                                className="w-full h-full object-cover"
                                data-alt="professional academic woman in her 40s smiling warmly in a bright modern workspace"
                                src={user?.avatar}
                            />
                        </div>
                        <div className="flex-1">
                            <span className="bg-tertiary/20 text-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                                {user?.academicRank}
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-on-surface mb-2 leading-none">
                                {user?.name}
                            </h2>
                            <div className="flex flex-wrap gap-3 mt-12">
                                {isProfileOwner ? null : (
                                    <button
                                        className="bg-primary text-secondary cursor-pointer px-8 py-3 rounded-lg font-black text-sm uppercase tracking-tighter shadow-md hover:translate-y-0.5 transition-transform disabled:opacity-50"
                                        onClick={handleFollow}
                                        disabled={isFollowingLoading}
                                    >
                                        {isFollowingLoading
                                            ? "Following..."
                                            : isUserFollowingProfile
                                              ? "Unfollow Me"
                                              : "Follow Me"}
                                    </button>
                                )}
                                {isProfileOwner ? (
                                    <button
                                        className="bg-secondary text-accent cursor-pointer px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-tighter hover:bg-surface-container-highest transition-colors"
                                        onClick={() => navigate("/settings")}
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <button
                                        className="bg-secondary text-accent cursor-pointer px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-tighter hover:bg-surface-container-highest transition-colors"
                                        onClick={() =>
                                            navigate(
                                                `/new-message/${user?.username}`,
                                            )
                                        }
                                    >
                                        Direct Inquiry
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- Stats Card -->*/}
                <div className="md:col-span-4 grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-xl flex flex-col justify-between">
                        <span
                            className="material-symbols-outlined text-primary-dim text-3xl"
                            data-icon="book"
                        >
                            <Book />
                        </span>
                        <div>
                            <div className="text-3xl font-black">
                                {postsCount}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                                Posts
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl flex flex-col justify-between">
                        <span
                            className="material-symbols-outlined text-primary-dim text-3xl"
                            data-icon="history_edu"
                        >
                            <ScrollText />
                        </span>
                        <div>
                            <div className="text-3xl font-black">
                                {user?.tenure || "15"}y
                            </div>
                            <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                                Tenure
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl flex flex-col justify-between">
                        <span
                            className="material-symbols-outlined text-primary-dim text-3xl"
                            data-icon="group"
                        >
                            <UsersRound />
                        </span>
                        <div>
                            <div className="text-3xl font-black">
                                {followersCount}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                                Followers
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl flex flex-col justify-between">
                        <span
                            className="material-symbols-outlined text-primary-dim text-3xl"
                            data-icon="star"
                        >
                            <Star />
                        </span>
                        <div>
                            <div className="text-3xl font-black">
                                {user?.followingCount}
                            </div>
                            <div className="text-[10px] uppercase tracking-widest font-bold opacity-60">
                                Following
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-12">
                <div className="flex items-baseline gap-4 mb-6">
                    <h3 className="text-2xl font-black tracking-tighter uppercase">
                        The Scholarly Path
                    </h3>
                    <div className="h-0.5 flex-1 bg-secondary/10"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <p className="text-body-lg text-on-surface leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                            {user?.bio?.split("\n")[0]}
                        </p>
                        {user?.bio
                            ?.split("\n")
                            .slice(1)
                            .map((para, index) => (
                                <p
                                    className="text-body-lg text-on-surface-variant leading-relaxed"
                                    key={index}
                                >
                                    {para}
                                </p>
                            ))}
                    </div>
                    <div className="bg-white p-6 rounded-xl space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-widest border-b border-outline-variant pb-2">
                            Interests
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-tertiary/20 text-tertiary px-3 py-1 rounded text-xs font-bold">
                                Cognitive Flow
                            </span>
                            <span className="bg-tertiary/20 text-tertiary px-3 py-1 rounded text-xs font-bold">
                                Kinetic Memory
                            </span>
                            <span className="bg-tertiary/20 text-tertiary px-3 py-1 rounded text-xs font-bold">
                                Spatial Logic
                            </span>
                            <span className="bg-tertiary/20 text-tertiary px-3 py-1 rounded text-xs font-bold">
                                Neural Spacing
                            </span>
                            <span className="bg-tertiary/20 text-tertiary px-3 py-1 rounded text-xs font-bold">
                                Bio-Rhythmics
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
