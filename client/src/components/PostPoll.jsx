import { useState } from "react";
import { Check } from "lucide-react";

const PostPoll = ({ postId, poll: initialPoll }) => {
    const [poll, setPoll] = useState(initialPoll);
    const [votingId, setVotingId] = useState(null);
    const [error, setError] = useState("");

    if (!poll?.options?.length) return null;

    const hasVoted = poll.options.some((o) => o.isVoted);

    async function handleVote(e, optionId) {
        e.stopPropagation();
        if (hasVoted || votingId) return;

        setVotingId(optionId);
        setError("");
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_ENDPOINT}/post/${postId}/vote`,
                {
                    credentials: "include",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ optionId }),
                },
            );
            const json = await res.json();
            if (!res.ok)
                throw new Error(json.message || "Could not record vote");

            console.log(json.data);

            setPoll(json.data); // { options, totalVotes }
        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setVotingId(null);
        }
    }

    return (
        <div className="space-y-2">
            {poll.options.map((option) => {
                const percent = poll.totalVotes
                    ? Math.round((option.votesCount / poll.totalVotes) * 100)
                    : 0;

                return (
                    <button
                        key={option._id}
                        type="button"
                        disabled={hasVoted || !!votingId}
                        onClick={(e) => handleVote(e, option._id)}
                        className={`relative w-full overflow-hidden rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                            hasVoted
                                ? "cursor-default"
                                : "cursor-pointer hover:bg-card/10 disabled:opacity-60"
                        } ${option.isVoted ? "border-primary" : "border-card-foreground/20"}`}
                    >
                        {hasVoted && (
                            <span
                                className="absolute inset-y-0 left-0 bg-primary/30 transition-all"
                                style={{ width: `${percent}%` }}
                            />
                        )}
                        <span className="relative flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1 font-medium text-card-foreground">
                                {option.isVoted && <Check size={14} />}
                                {option.text}
                            </span>
                            {hasVoted && (
                                <span className="text-xs font-bold text-card-foreground">
                                    {percent}%
                                </span>
                            )}
                        </span>
                    </button>
                );
            })}

            <div className="flex items-center justify-between text-xs text-card-foreground/70">
                <span>
                    {poll.totalVotes} {poll.totalVotes === 1 ? "vote" : "votes"}
                </span>
                {error && <span className="text-red-500">{error}</span>}
            </div>
        </div>
    );
};

export default PostPoll;
