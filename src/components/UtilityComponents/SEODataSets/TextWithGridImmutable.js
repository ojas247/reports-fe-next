


const TextWithGridImmutable = ({ id, initialData, onRemove }) => {
    console.log(id, initialData, onRemove)
    return (
        <div className="relative bg-blue-50 shadow-md rounded-xl p-4 my-3 flex flex-col gap-3">
            {/* Remove button */}
            <button
                onClick={() => onRemove(id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
            >
                ✕ Remove
            </button>

            <h2 className="text-xl font-semibold mb-3">Text With Grid:</h2>

            <div className="space-y-2 text-sm">
                <p><strong>Data Name:</strong> {initialData?.dataName || "N/A"}</p>
                <p><strong>Source URL:</strong> {initialData?.SourceURL || "N/A"}</p>
                <p><strong>Description:</strong> {initialData?.dataDesc || "N/A"}</p>
                <p><strong>Published On:</strong> {initialData?.year || "N/A"}</p>
                <p><strong>Authors:</strong> {(initialData?.author || []).join(", ") || "N/A"}</p>
                <p><strong>Tags:</strong> {(initialData?.tags || []).join(", ") || "N/A"}</p>
                <p><strong>Units:</strong> {initialData?.units || "N/A"}</p>
                <p><strong>Granularity:</strong> {initialData?.granularity || "N/A"}</p>
                <p><strong>Is Time Series:</strong> {(initialData?.isTSData || []).join(", ") || "N/A"}</p>
                <p><strong>Geography:</strong> {(initialData?.geo || []).join(", ") || "N/A"}</p>
                <strong>Table Data:</strong>
                {initialData?.tableData && initialData.tableData.length > 0 ? (
                    <table className="border-collapse border border-gray-400 mt-2 text-sm">
                        <tbody>
                            {initialData.tableData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={cellIndex}
                                            className="border border-gray-400 px-2 py-1"
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>N/A</p>
                )}
            </div>
        </div>
    );
};

export default TextWithGridImmutable;
