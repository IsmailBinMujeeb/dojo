import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

const NewMessages = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetch(
                    `${import.meta.env.VITE_API_ENDPOINT}/user/profile/${id}`,
                    {
                        credentials: "include",
                    },
                );
                const json = await data.json();

                if (!json.data) {
                    navigate("/notfound");
                }

                setUser(json.data);
            } catch (error) {
                console.error(error);
            }
        })();
    }, [navigate, id]);

    async function handleCreateNewChat() {
        if (!user) return;
        try {
            const data = await fetch(
                `${import.meta.env.VITE_API_ENDPOINT}/chat/${user?._id}`,
                {
                    credentials: "include",
                    method: "POST",
                },
            );

            if (data.ok) {
                navigate("/messages");
            }

            console.log(data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <header class="flex justify-between items-center px-6 py-3 bg-white backdrop-blur-md sticky top-0 z-40 w-full">
                <div class="flex items-center gap-4">
                    <button class="p-2 rounded-full transition-colors">
                        <span
                            class="material-symbols-outlined"
                            data-icon="arrow_back"
                        >
                            <ArrowLeft />
                        </span>
                    </button>
                    <div>
                        <h2 class="text-lg font-black uppercase tracking-widest text-secondary leading-none">
                            {user?.name}
                        </h2>
                        <span class="text-xs text-tertiary font-medium tracking-wide">
                            @{user?.username}
                        </span>
                    </div>
                </div>
            </header>
            {/* <!-- Scrollable Content Canvas -->*/}
            <div class="flex-1 overflow-y-auto flex flex-col items-center justify-center p-8">
                {/* <!-- Kinetic Empty State Hero -->*/}
                <div class="max-w-md w-full text-center space-y-8 relative">
                    {/* <!-- Decorative Background Element (Asymmetry) -->*/}
                    <div class="absolute -top-12 -left-12 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl -z-10"></div>
                    <div class="flex flex-col items-center gap-6">
                        <div class="relative group">
                            <div class="absolute inset-0 bg-primary rotate-6 rounded-3xl transition-transform group-hover:rotate-12 duration-300"></div>
                            <div class="relative w-48 h-48 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                                <img
                                    alt={user?.name}
                                    class="w-full h-full object-cover"
                                    data-alt="close-up portrait of a professional female professor with glasses, smiling warmly in a library or academic environment"
                                    src={user?.avatar}
                                />
                            </div>
                        </div>
                        <div class="space-y-2">
                            <h3 class="text-4xl font-black tracking-tighter text-secondary">
                                {user?.name}
                            </h3>
                            <div class="flex items-center justify-center gap-2">
                                <span class="px-3 py-1 bg-tertiary/20 text-tertiary text-[10px] font-bold uppercase tracking-widest rounded-full">
                                    {user?.academicRank}
                                </span>
                                <span class="text-sm text-secondary font-medium tracking-tight">
                                    {user?.createdAt}
                                </span>
                            </div>
                        </div>
                        <p class="text-secondary/50 leading-relaxed text-center font-medium max-w-xs truncate line-clamp-3">
                            {user?.bio}
                        </p>
                    </div>
                    <Button
                        variant={"secondary"}
                        class="w-1/2 py-2 bg-primary text-secondary rounded-md font-extrabold text-lg cursor-pointer"
                        onClick={handleCreateNewChat}
                    >
                        Start Chat
                    </Button>
                </div>
                {/* <!-- Academic Chips Section (Asymmetric placement) -->*/}
                <div class="mt-24 w-full max-w-2xl px-6">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-6">
                        Interests
                    </h4>
                    <div class="flex flex-wrap gap-3">
                        <div class="px-4 py-2 bg-secondary/5 text-secondary text-sm font-semibold rounded-lg hover:bg-primary-container transition-colors cursor-default">
                            #FluidIntelligence
                        </div>
                        <div class="px-4 py-2 bg-secondary/5 text-secondary text-sm font-semibold rounded-lg hover:bg-primary-container transition-colors cursor-default">
                            #KineticLearning
                        </div>
                        <div class="px-4 py-2 bg-secondary/5 text-secondary text-sm font-semibold rounded-lg hover:bg-primary-container transition-colors cursor-default">
                            #DigitalEpistemology
                        </div>
                        <div class="px-4 py-2 bg-secondary/5 text-secondary text-sm font-semibold rounded-lg hover:bg-primary-container transition-colors cursor-default">
                            #OpenScholarship
                        </div>
                    </div>
                </div>
            </div>
            {/* <Avatar className="size-15">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>{user?.username}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center">
                <span className="font-bold text-2xl">{user?.name}</span>
                <span className="text-zinc-500">@{user?.username}</span>
            </div>
            <Button
                className="bg-zinc-50 cursor-pointer hover:bg-zinc-300 max-w-3xs"
                onClick={handleCreateNewChat}
            >
                Start New Chat
            </Button>*/}
        </div>
    );
};

export default NewMessages;
