import { cn } from "@/lib/utils";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { GoogleIcon, GithubIcon } from "@/components/icons";
import { useNavigate } from "react-router-dom";

export function HomeForm({ className, ...props }) {
  const navigate = useNavigate();

  const navigateTo = (to) => {
    navigate(`/${to}`);
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-left">
          <h1 className="text-5xl font-bold">What's Happening Now</h1>
        </div>
        <Field>
          <Button
            className={"cursor-pointer"}
            onClick={() => navigateTo("signup")}
          >
            Create Account
          </Button>
          <FieldDescription>
            By signing up, you agree to the{" "}
            <span className="text-blue-500">Terms of Service</span> and{" "}
            <span className="text-blue-500">Privacy Policy</span>, including{" "}
            <span className="text-blue-500">Cookie</span> Use.
          </FieldDescription>
        </Field>
        <Field>
          <div className="flex flex-col gap-1 text-left">
            <h1 className="font-bold">Already have an account?</h1>
            <Button
              variant="outline"
              className={`w-full cursor-pointer`}
              type="button"
              onClick={() => navigateTo("login")}
            >
              Sign in
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
