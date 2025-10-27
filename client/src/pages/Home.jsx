import { HomeForm } from "@/components/home-form";

export default function HomePage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://img.freepik.com/free-vector/twitter-app-new-logo-x-black-background_1017-45425.jpg?semt=ais_hybrid&w=740&q=80"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
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
