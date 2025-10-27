import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Protected } from "@/components/Protected";
import PanelWrapper from "@/components/panel-wrapper";

const NotFound = () => {
  return (
    <Protected>
      <PanelWrapper>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
            <Avatar className="size-20">
              <AvatarImage
                src="https://github.com/ismailbinmujeeb.png"
                alt="@IsmailBinMujeeb"
              />
              <AvatarFallback>IBM</AvatarFallback>
            </Avatar>
            <Avatar className="size-20">
              <AvatarImage
                src="https://github.com/fuma-nama.png"
                alt="@fuma_nama"
              />
              <AvatarFallback>FN</AvatarFallback>
            </Avatar>
            <Avatar className="size-20">
              <AvatarImage
                src="https://github.com/SaltyAom.png"
                alt="@SaltyAom"
              />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
          </div>
          <Link
            to="/feeds"
            className="text-black bg-zinc-50 hover:bg-zinc-200 cursor-pointer rounded px-4 py-2 my-4"
          >
            Back To Feeds
          </Link>
        </div>
      </PanelWrapper>
    </Protected>
  );
};

export default NotFound;
