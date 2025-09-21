import { useState, useEffect } from "react";

const TextWithTitle = ({ updateData, onRemove }) => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    // Send updated data back to parent
    useEffect(() => {
        updateData({ title, text });
    }, [title, text]);

    return (
        <div className="relative  bg-blue-50  shadow-md rounded-xl p-4 my-3 flex flex-col gap-3">
            {/* X icon (top right) */}
            <button
                onClick={() => onRemove(id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
            >
                ✕ Remove
            </button>
            <h2 className="text-xl font-semibold mb-3">Text With Title:</h2>

            {/* Title Box */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Text Box */}
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text..."
                className="w-full px-3 py-2 border rounded-lg text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
    );
};

export default TextWithTitle;
