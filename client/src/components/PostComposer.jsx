import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ChartNoAxesColumn,
    Image as ImageIcon,
    Paperclip,
    FileText,
    Plus,
    X,
} from "lucide-react";

const MIN_POLL_OPTIONS = 2;
const MAX_POLL_OPTIONS = 6;

const PostComposer = ({ user }) => {
    const [content, setContent] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [images, setImages] = useState([]); // [{ file, preview }]
    const [documents, setDocuments] = useState([]); // [File]
    const [poll, setPoll] = useState(null); // null | string[]
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const imageInputRef = useRef(null);
    const documentInputRef = useRef(null);
    const imagesRef = useRef(images);
    imagesRef.current = images;

    // free object URLs on unmount
    useEffect(() => {
        return () =>
            imagesRef.current.forEach((img) =>
                URL.revokeObjectURL(img.preview),
            );
    }, []);

    /* ---------- Images ---------- */
    function handleImages(e) {
        const files = Array.from(e.target.files || []);
        setImages((prev) => [
            ...prev,
            ...files.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            })),
        ]);
        e.target.value = ""; // lets the same file be picked again
    }

    function removeImage(index) {
        setImages((prev) => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    }

    /* ---------- Documents ---------- */
    function handleDocuments(e) {
        const files = Array.from(e.target.files || []);
        setDocuments((prev) => [...prev, ...files]);
        e.target.value = "";
    }

    function removeDocument(index) {
        setDocuments((prev) => prev.filter((_, i) => i !== index));
    }

    /* ---------- Poll (one per post) ---------- */
    function togglePoll() {
        setPoll((prev) => (prev ? null : ["", ""]));
    }

    function updatePollOption(index, value) {
        setPoll((prev) => prev.map((o, i) => (i === index ? value : o)));
    }

    function addPollOption() {
        setPoll((prev) =>
            prev.length < MAX_POLL_OPTIONS ? [...prev, ""] : prev,
        );
    }

    function removePollOption(index) {
        setPoll((prev) =>
            prev.length > MIN_POLL_OPTIONS
                ? prev.filter((_, i) => i !== index)
                : prev,
        );
    }

    const filledPollOptions = poll
        ? poll.map((o) => o.trim()).filter(Boolean)
        : [];
    const pollInvalid = !!poll && filledPollOptions.length < MIN_POLL_OPTIONS;
    const isEmpty =
        !content.trim() && !images.length && !documents.length && !poll;

    /* ---------- Submit ---------- */
    async function submit() {
        if (isEmpty || pollInvalid) return;

        try {
            setIsUpdating(true);
            setError("");

            const formData = new FormData();
            formData.append("content", content.trim());
            images.forEach(({ file }) => formData.append("images", file));
            documents.forEach((file) => formData.append("documents", file));
            if (poll) {
                formData.append(
                    "poll",
                    JSON.stringify({ options: filledPollOptions }),
                );
            }

            const res = await fetch(
                `${import.meta.env.VITE_API_ENDPOINT}/post`,
                {
                    credentials: "include",
                    method: "POST",
                    // no Content-Type header: the browser sets the multipart boundary
                    body: formData,
                },
            );

            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json.message || "Failed to create post");
            }

            setContent("");
            setImages([]);
            setDocuments([]);
            setPoll(null);
            navigate(0);
        } catch (err) {
            console.log(err);
            setError(err.message || "Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <>
            <section className="mb-4 bg-white p-6 pb-2 rounded-xl border-b-4 shadow-sm border-primary">
                <div className="flex gap-4">
                    <img
                        alt="User"
                        className="w-12 h-12 rounded-lg object-cover"
                        src={user?.avatar}
                    />
                    <div className="flex-1">
                        <textarea
                            className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-body-lg resize-none min-h-20"
                            placeholder={
                                poll
                                    ? "Ask a question..."
                                    : "Synthesize your latest findings..."
                            }
                            rows="3"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>

                        {/* Image previews */}
                        {images.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {images.map((img, i) => (
                                    <div key={img.preview} className="relative">
                                        <img
                                            src={img.preview}
                                            alt={img.file.name}
                                            className="h-32 w-full rounded-lg object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black"
                                            aria-label="Remove image"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Document list */}
                        {documents.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {documents.map((doc, i) => (
                                    <div
                                        key={`${doc.name}-${i}`}
                                        className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                                    >
                                        <div className="flex min-w-0 items-center gap-2">
                                            <FileText
                                                size={16}
                                                className="shrink-0 text-secondary"
                                            />
                                            <span className="truncate">
                                                {doc.name}
                                            </span>
                                            <span className="shrink-0 text-xs text-zinc-500">
                                                {Math.max(
                                                    1,
                                                    Math.round(doc.size / 1024),
                                                )}{" "}
                                                KB
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDocument(i)}
                                            className="text-zinc-500 hover:text-red-500"
                                            aria-label="Remove document"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Poll editor */}
                        {poll && (
                            <div className="mt-3 space-y-2 rounded-lg border p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold">
                                        Poll
                                    </span>
                                    <button
                                        type="button"
                                        onClick={togglePoll}
                                        className="text-zinc-500 hover:text-red-500"
                                        aria-label="Remove poll"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>

                                {poll.map((option, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2"
                                    >
                                        <Input
                                            value={option}
                                            onChange={(e) =>
                                                updatePollOption(
                                                    i,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={`Option ${i + 1}`}
                                            maxLength={80}
                                        />
                                        {poll.length > MIN_POLL_OPTIONS && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removePollOption(i)
                                                }
                                                className="text-zinc-500 hover:text-red-500"
                                                aria-label="Remove option"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {poll.length < MAX_POLL_OPTIONS && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={addPollOption}
                                    >
                                        <Plus size={14} className="mr-1" /> Add
                                        option
                                    </Button>
                                )}

                                {pollInvalid && (
                                    <p className="text-xs text-amber-600">
                                        A poll needs at least {MIN_POLL_OPTIONS}{" "}
                                        options.
                                    </p>
                                )}
                            </div>
                        )}

                        {error && (
                            <p className="mt-2 text-sm text-red-500">{error}</p>
                        )}

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-surface-container">
                            <div className="flex gap-2 text-primary">
                                <button
                                    type="button"
                                    title="Upload images"
                                    onClick={() =>
                                        imageInputRef.current?.click()
                                    }
                                    className="p-2 hover:bg-secondary/10 rounded-md cursor-pointer text-secondary"
                                >
                                    <ImageIcon />
                                </button>
                                <button
                                    type="button"
                                    title={poll ? "Remove poll" : "Create poll"}
                                    onClick={togglePoll}
                                    className={`p-2 hover:bg-secondary/10 rounded-md cursor-pointer text-secondary ${
                                        poll ? "bg-secondary/10" : ""
                                    }`}
                                >
                                    <ChartNoAxesColumn />
                                </button>
                                <button
                                    type="button"
                                    title="Upload documents"
                                    onClick={() =>
                                        documentInputRef.current?.click()
                                    }
                                    className="p-2 hover:bg-secondary/10 rounded-md cursor-pointer text-secondary"
                                >
                                    <Paperclip />
                                </button>
                            </div>
                            <Button
                                className="font-bold rounded-lg active:scale-95 transition-transform disabled:opacity-50"
                                onClick={submit}
                                disabled={isUpdating || isEmpty || pollInvalid}
                            >
                                {isUpdating ? "Posting..." : "Post"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Hidden file inputs */}
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImages}
                />
                <input
                    ref={documentInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
                    multiple
                    hidden
                    onChange={handleDocuments}
                />
            </section>
        </>
    );
};

export default PostComposer;
