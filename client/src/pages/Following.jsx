import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PanelWrapper from "@/components/panel-wrapper";
import { Protected } from "@/components/Protected";
import { Button } from "@/components/ui/button";

const Following = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/following/${_id}`,
          { credentials: "include" },
        );
        const json = await response.json();
        const data = json.data;

        setFollowing(data.docs);
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
          {following &&
            following.map(
              (user) =>
                user.followedTo && (
                  <div
                    className="flex flex-nowrap gap-2 w-full mb-4 border-t border-t-zinc-500 p-4"
                    key={user?.followedTo?._id}
                  >
                    <Avatar className="size-15">
                      <AvatarImage
                        src={user?.followedTo?.avatar}
                        alt={user?.followedTo?.username}
                      />
                      <AvatarFallback>
                        {user?.followedTo?.username}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">
                        {user?.followedTo?.name}
                      </div>
                      <div className="text-zinc-500">
                        @{user?.followedTo?.username}
                      </div>
                    </div>
                    <Button
                      className="cursor-pointer ml-auto"
                      onClick={() => navigate(`/${user?.followedTo?.username}`)}
                    >
                      View
                    </Button>
                  </div>
                ),
            )}
        </div>
      </PanelWrapper>
    </Protected>
  );
};

export default Following;
