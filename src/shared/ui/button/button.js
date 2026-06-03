
export default function Button({ text, func, className }) {
    return (
        <button
            onClick={func}
            className={`bg-[#6528FF] w-[40%] h-[clamp(40px,5vh,50px)] rounded-lg ${className}`}
        >
            {text}
        </button>
    );
}