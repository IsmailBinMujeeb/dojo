import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PanelWrapper from "@/components/panel-wrapper";
import { Protected } from "@/components/Protected";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const Explore = () => {
  const { searchQuery } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/explore/${searchQuery}`,
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
  }, [searchQuery]);

  return (
    <Protected>
      <PanelWrapper>
        <div>
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <Spinner className="size-8 text-blue-500" />
            </div>
          ) : (
            users &&
            users.map((user) => (
              <div
                className="flex flex-nowrap gap-2 w-full mb-4 border-t border-t-zinc-500 p-4"
                key={user?._id}
              >
                <Avatar className="size-15">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback>{user?.username}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{user?.name}</div>
                  <div className="text-zinc-500">@{user?.username}</div>
                  <div className="font-semibold">{user?.bio}</div>
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
        </div>
      </PanelWrapper>
    </Protected>
  );
};

export default Explore;
