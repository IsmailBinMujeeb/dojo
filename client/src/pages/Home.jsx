import { HomeForm } from "@/components/home-form";

export default function HomePage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="bg-muted relative hidden lg:flex justify-center items-center flex-col gap-16">
                <div className="text-secondary font-extrabold text-9xl relative">
                    THE
                    <br />
                    DOJO
                    <div className="bg-primary w-20 h-4 mb-20 absolute left-0"></div>
                </div>
                <img
                    src="/favicon.png"
                    alt="Image"
                    className="inset-0 size-96 object-cover rotate-6"
                />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <HomeForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
