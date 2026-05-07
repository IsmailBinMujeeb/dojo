import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6 relative group">
                <SignupForm />
                <img
                    src="/favicon.png"
                    alt="Image"
                    className="absolute hidden lg:block -top-10 -right-10 size-36 object-contain transition-transform duration-300 group-hover:rotate-6 group-hover:translate-x-10"
                />
            </div>
        </div>
    );
}
