import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const MAX_VISIBLE_IMAGES = 4;

const formatSize = (bytes = 0) =>
    bytes < 1024 * 1024
        ? `${Math.max(1, Math.round(bytes / 1024))} KB`
        : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const getExtension = (name = "") =>
    name.includes(".") ? name.split(".").pop().toUpperCase() : "FILE";

export const PostImages = ({ images }) => {
    const [active, setActive] = useState(null); // index of image open in lightbox

    if (!images?.length) return null;

    const visible = images.slice(0, MAX_VISIBLE_IMAGES);
    const extra = images.length - MAX_VISIBLE_IMAGES;
    const single = images.length === 1;

    const step = (e, dir) => {
        e.stopPropagation();
        setActive((a) => (a + dir + images.length) % images.length);
    };

    return (
        <>
            <div
                className={`grid gap-1 overflow-hidden rounded-xl border border-secondary/20 ${
                    single ? "grid-cols-1" : "grid-cols-2"
                }`}
            >
                {visible.map((img, i) => (
                    <button
                        key={img.url}
                        type="button"
                        className="relative block cursor-pointer overflow-hidden"
                        onClick={(e) => {
                            e.stopPropagation();
                            setActive(i);
                        }}
                    >
                        <img
                            src={img.url}
                            alt={img.name}
                            loading="lazy"
                            className={`w-full object-cover ${
                                single ? "max-h-96" : "h-40"
                            }`}
                        />
                        {extra > 0 && i === MAX_VISIBLE_IMAGES - 1 && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-2xl font-bold text-white">
                                +{extra}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <Dialog
                open={active !== null}
                onOpenChange={(open) => !open && setActive(null)}
            >
                <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-6xl border-0 bg-black/90 p-2">
                    <DialogTitle className="sr-only">Image preview</DialogTitle>
                    {active !== null && (
                        <div className="relative flex items-center justify-center">
                            <img
                                src={images[active].url}
                                alt={images[active].name}
                                className="h-auto max-h-[88vh] w-full rounded-lg object-contain"
                            />
                            {images.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => step(e, -1)}
                                        className="absolute left-2 rounded-full bg-black/60 p-2 text-white hover:bg-black"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => step(e, 1)}
                                        className="absolute right-2 rounded-full bg-black/60 p-2 text-white hover:bg-black"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export const PostDocuments = ({ documents }) => {
    if (!documents?.length) return null;

    return (
        <div className="space-y-2">
            {documents.map((doc) => (
                <a
                    key={doc.url}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-3 rounded-lg border border-secondary/20 px-3 py-2 transition-colors hover:bg-secondary/10"
                >
                    <FileText size={20} className="shrink-0 text-secondary" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-secondary">
                            {doc.name}
                        </p>
                        <p className="text-xs text-secondary/70">
                            {getExtension(doc.name)} · {formatSize(doc.size)}
                        </p>
                    </div>
                    <Download size={16} className="shrink-0 text-secondary" />
                </a>
            ))}
        </div>
    );
};
