
export function ListCard({ content, onClick, className }) {
    return (
        <div
            className={`w-[40%] p-4 border-2 border-[#6528FF] rounded-lg cursor-pointer ${className}`}
            onClick={onClick}
        >
            {content}
        </div>
    );
}