import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

export const Protected = ({ children }) => {
  const { setUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/user/me`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();

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
