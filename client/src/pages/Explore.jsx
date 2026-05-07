import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";

const Explore = () => {
    const { searchQuery } = useParams();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQueryState, setSearchQueryState] = useState(searchQuery);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_ENDPOINT}/explore/${searchQueryState}`,
                    { credentials: "include" },
                );
                const json = await response.json();

                setUsers(json.data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [searchQueryState]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQueryState(e.target.value);
    };

    return (
        <div>
            <header className="z-40 bg-white flex justify-between items-center px-8 h-16">
                <div className="flex items-center flex-1">
                    <div className="relative w-full group gap-4">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <Search />
                        </span>
                        <input
                            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-yellow-400 transition-all outline-none"
                            placeholder="Search the research labs..."
                            type="text"
                            value={searchQueryState}
                            onChange={handleSearch}
                        />
                    </div>
                </div>
            </header>
            {isLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                    <Spinner className="size-8 text-blue-500" />
                </div>
            ) : (
                users &&
                users.map((user) => (
                    <div
                        className="flex flex-nowrap gap-2 w-full mb-4 p-4"
                        key={user?._id}
                    >
                        <Avatar className="size-15 rounded-md">
                            <AvatarImage
                                src={user?.avatar}
                                alt={user?.username}
                            />
                            <AvatarFallback>{user?.username}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold">{user?.name}</div>
                            <div className="text-zinc-500">
                                @{user?.username}
                            </div>
                        </div>
                        <Button
                            className="cursor-pointer ml-auto"
                            onClick={() => navigate(`/${user?.username}`)}
                        >
                            View
                        </Button>
                    </div>
                ))
            )}
            {!isLoading && (
                <div className="p-4 text-center text-zinc-500 font-semibold">
                    This is all we have.
                </div>
            )}
        </div>
    );
};

export default Explore;
