
export default function Button({ text, func, className, disabled = false }) {
    return (
        <button
            onClick={func}
            className={`bg-[#6528FF] w-[clamp(150px,40%,250px)] h-[clamp(40px,5vh,50px)] rounded-lg cursor-pointer ${className}`}
            disabled={disabled}
        >
            {text || "Insert text"}
        </button>
    );
}