import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PanelWrapper from "@/components/panel-wrapper";
import { Protected } from "@/components/Protected";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const Followers = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/followers/${_id}`,
          { credentials: "include" },
        );
        const json = await response.json();
        const data = json.data;

        setFollowers(data.docs);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [_id]);

  return (
    <Protected>
      <PanelWrapper>
        <div>
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <Spinner className="size-8 text-blue-500" />
            </div>
          ) : (
            followers &&
            followers.map(
              (user) =>
                user?.followedBy && (
                  <div
                    className="flex flex-nowrap gap-2 w-full mb-4 border-t border-t-zinc-500 p-4"
                    key={user?.followedBy?._id}
                  >
                    <Avatar className="size-15">
                      <AvatarImage
                        src={user?.followedBy?.avatar}
                        alt={user?.followedBy?.username}
                      />
                      <AvatarFallback>
                        {user?.followedBy?.username}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">
                        {user?.followedBy?.name}
                      </div>
                      <div className="text-zinc-500">
                        @{user?.followedBy?.username}
                      </div>
                    </div>
                    <Button
                      className="cursor-pointer ml-auto"
                      onClick={() => navigate(`/${user?.followedBy?.username}`)}
                    >
                      View
                    </Button>
                  </div>
                ),
            )
          )}
        </div>
      </PanelWrapper>
    </Protected>
  );
};

export default Followers;
