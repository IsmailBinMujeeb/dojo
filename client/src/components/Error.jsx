import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { CircleAlert } from "lucide-react";

export const Error = ({ children }) => {
  return (
    <Alert>
      <CircleAlert className="h-4 w-4" />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
