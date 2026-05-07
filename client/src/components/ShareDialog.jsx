import { Share2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";

export const ShareDialog = ({ link }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setIsCopied(true);

        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };
    return (
        <Dialog className="overflow-auto">
            <DialogTrigger asChild>
                <button className="flex items-center gap-1 p-2 rounded-md cursor-pointer transition-colors hover:bg-secondary/10">
                    <Share2 />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Let's Make Hype</DialogTitle>
                    <DialogDescription>
                        Share it, let the community know what you're up to!
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <div class="space-y-3">
                        <label class="font-sans font-medium uppercase tracking-widest text-[11px] text-secondary">
                            Permanent Link
                        </label>
                        <div class="flex gap-2 max-w-xs">
                            <div class="flex-1 bg-accent rounded-lg flex items-center px-4 py-3 border-b-2 border-primary max-w-xs">
                                <span class="text-secondary font-mono text-sm truncate text-ellipsis max-w-xs">
                                    {link}
                                </span>
                            </div>
                            <button
                                class="bg-primary cursor-pointer text-secondary px-6 rounded-lg font-bold text-sm active:scale-95 transition-all"
                                onClick={handleCopy}
                            >
                                {isCopied ? "Done" : "Copy"}
                            </button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
