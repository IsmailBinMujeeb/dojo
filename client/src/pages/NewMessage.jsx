import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PanelWrapper from "@/components/panel-wrapper";
import { Protected } from "@/components/Protected";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
    <Protected>
      <PanelWrapper>
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <Avatar className="size-15">
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
          </Button>
        </div>
      </PanelWrapper>
    </Protected>
  );
};

export default NewMessages;
