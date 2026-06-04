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
    hierarchyKeys = [],
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const currentHierarchyKey = hierarchyKeys[0];
    const nextHierarchyKeys = hierarchyKeys.slice(1);
    const isLeafLevel = hierarchyKeys.length === 0;

    function getItemTitle(item) {
        return item.title ?? item.name ?? `Item ${item.id}`;
    }

    return (
        <div className="w-full z-10">
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
                        <div key={item.id} className="w-full">
                            <div
                                className="w-full p-4 border-2 border-[#6528FF] rounded-lg text-[#6528FF]"
                                onClick={() => listFunc?.(item)}
                            >
                                <div className="flex flex-col gap-2 p-2">
                                    <div className="font-semibold">{getItemTitle(item)}</div>
                                    {item.status ? (
                                        <div className="text-sm text-zinc-600">{item.status}</div>
                                    ) : null}
                                    {isLeafLevel && statusOptions.length > 0 ? (
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
                                    ) : null}
                                    <div className="flex items-center gap-2">
                                        {isLeafLevel && epicOptions.length > 0 ? (
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
                                        {isLeafLevel && onDelete ? (
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
                                        {item.timeAgo ? (
                                            <div className="text-xs text-zinc-500">{item.timeAgo}</div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            {currentHierarchyKey && item[currentHierarchyKey]?.length ? (
                                <div className="mt-3 ml-4">
                                    <ExpandableListCard
                                        entity={{
                                            id: `${item.id}-${currentHierarchyKey}`,
                                            title: `${currentHierarchyKey[0].toUpperCase()}${currentHierarchyKey.slice(1)}`,
                                        }}
                                        list={item[currentHierarchyKey]}
                                        listFunc={listFunc}
                                        statusOptions={statusOptions}
                                        onStatusChange={onStatusChange}
                                        onDelete={onDelete}
                                        epicOptions={epicOptions}
                                        onAssignEpic={onAssignEpic}
                                        hierarchyKeys={nextHierarchyKeys}
                                    />
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}