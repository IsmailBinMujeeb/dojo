import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";

const RightPanel = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [exploreQuery, setExploreQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_ENDPOINT}/user/get-recent-users`,
                    {
                        credentials: "include",
                    },
                );

                const json = await response.json();
                setUsers(json.data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    function handleExploreQueryChange(e) {
        setExploreQuery(e.target.value);
    }

    function handleExploreKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            navigate(`/explore/${exploreQuery}`);
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="bg-input flex flex-row items-center rounded-md px-3 py-2">
                <span className="text-on-surface-variant" data-icon="search">
                    <Search />
                </span>
                <Input
                    type="text"
                    placeholder="Search the archives..."
                    value={exploreQuery}
                    onChange={handleExploreQueryChange}
                    onKeyDown={handleExploreKeyDown}
                    className="rounded-md text-sm focus-visible:ring-0 focus-visible:outline-none focus-visible:border-none shadow-none"
                />
            </div>
            <Card className="w-full bg-accent shadow-none border-none">
                <CardHeader>
                    <CardTitle>New Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="w-full h-full flex justify-center items-center">
                            <Spinner className="size-8 text-blue-500" />
                        </div>
                    ) : (
                        users &&
                        users.map((user) => (
                            <div
                                className="flex flex-nowrap gap-2 w-full mb-4"
                                key={user?._id}
                            >
                                <Avatar className="size-12 rounded-md">
                                    <AvatarImage
                                        src={user?.avatar}
                                        alt={user?.username}
                                    />
                                    <AvatarFallback>
                                        {user?.username}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold">
                                        {user?.name}
                                    </div>
                                    <div className="text-zinc-500">
                                        @{user?.username}
                                    </div>
                                </div>
                                <Button
                                    className="cursor-pointer ml-auto py-1 text-accent"
                                    onClick={() =>
                                        navigate(`/${user?.username}`)
                                    }
                                    variant={"secondary"}
                                >
                                    View
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default RightPanel;
