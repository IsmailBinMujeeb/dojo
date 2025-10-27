import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "./ui/spinner";

export const Protected = ({ children }) => {
  const { setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const response = await fetch("http://localhost:3000/api/user/me", {
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);
        if (!data.success) {
          navigate("/login");
        } else {
          setUser(data.data);
        }
      } catch (error) {
        console.log(error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setUser, navigate]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Spinner className="size-8 text-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
};
