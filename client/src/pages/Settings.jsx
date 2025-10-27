import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { Protected } from "@/components/Protected";
import PanelWrapper from "@/components/panel-wrapper";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await fetch("http://localhost:3000/api/user", {
        method: "DELETE",
        credentials: "include",
      });
      navigate("/signup");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Protected>
      <PanelWrapper>
        <div className="flex w-full max-w-2xl flex-col gap-6 mx-auto my-4">
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Delete Account</ItemTitle>
              <ItemDescription>
                This action is non-reversible and will permanently delete your
                account. Please confirm your decision.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              {isLoading ? (
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
      </PanelWrapper>
    </Protected>
  );
};

export default Settings;
