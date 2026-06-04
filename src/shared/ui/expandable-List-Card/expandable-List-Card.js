import { useState } from "react";
import { ListCard } from "@/shared/ui/list-card/list-card";

export function ExpandableListCard({
    entity,
    list = [],
    listFunc,
    statusOptions = [],
    onStatusChange,
    onDelete,
    epicOptions = [],
    onAssignEpic,
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    return (
        <div className="w-full">
            <ListCard
                content={
                    <div className="">
                        <h2 className="text-xl font-bold text-[#6528FF]">{entity.title}</h2>
                    </div>
                }
                className="w-full"
                onClick={toggleExpand}
            />
            {isExpanded ? (
                <div className="mt-3 flex flex-col gap-3">
                    {list.map((item) => (
                        <div
                            key={item.id}
                            className="w-full p-4 border-2 border-[#6528FF] rounded-lg text-[#6528FF]"
                            onClick={() => listFunc?.(item)}
                        >
                            <div className="flex flex-col gap-2 p-2">
                                <div className="font-semibold">{item.title}</div>
                                {statusOptions.length > 0 ? (
                                    <select
                                        className="rounded-md border border-[#D7CFF4] bg-white px-3 py-2 text-sm text-zinc-700"
                                        value={item.status ?? ""}
                                        onChange={(e) => onStatusChange?.(item, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <option value="" disabled>
                                            Select status
                                        </option>
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="text-sm text-zinc-600">{item.status}</div>
                                )}
                                <div className="flex items-center gap-2">
                                    {epicOptions.length > 0 ? (
                                        <select
                                            className="rounded-md border border-[#D7CFF4] bg-white px-3 py-2 text-sm text-zinc-700"
                                            value={item.epic ?? ""}
                                            onChange={(e) => onAssignEpic?.(item, e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="">Assign to epic</option>
                                            {epicOptions.map((epic) => (
                                                <option key={epic.id} value={epic.id}>
                                                    {epic.title}
                                                </option>
                                            ))}
                                        </select>
                                    ) : null}
                                    {onDelete ? (
                                        <button
                                            type="button"
                                            className="self-start rounded-md border border-red-500 px-3 py-1 text-sm text-red-500 transition-colors hover:bg-red-500 hover:text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(item);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}