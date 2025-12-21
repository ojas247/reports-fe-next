'use client';
import Link from "next/link";

export default function ShowSuggestions({ suggestions, suggestionClick }) {
  return (
    // <ul className=" absolute w-[50vw] sm:w-[400px] bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg max-h-[200px] overflow-y-auto z-[1000] divide-y divide-gray-100 transition-all duration-200 ">
    <ul
      className="
        absolute bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg overflow-y-auto z-[1000] divide-y divide-gray-100 transition-all duration-200
        /* Mobile (default): 50vw width, 150px max-h, full-width feel */
        w-[70vw] max-h-[150px]
        /* Tablet/Small Desktop (sm): Transition width */
        sm:w-[400px] sm:max-h-[180px]
        /* Large Desktop (lg+): Fixed 500px width, taller list */
        lg:w-[400px] lg:max-h-[250px]
      ">
      {suggestions.map((value, index) => (
        <li
          key={index}
          className=" flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-800 truncate transition-colors duration-150 "
          onClick={() => suggestionClick(value.value)}
        >
          {/* Conditionally render icon based on indicator */}
          {value.value.indicator === "Report" && (
            <i className="bi bi-file-earmark-text text-blue-500 min-w-[16px]"></i>
          )}
          {value.value.indicator === "Data" && (
            <i className="bi bi-database text-blue-500 min-w-[16px]"></i>
          )}

          {/* Link text */}
          <Link
            href={value.value.url}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = value.value.url;
            }}
            title={value.key} // Tooltip for long text
            className=" flex-1 truncate text-gray-800 hover:text-blue-600 no-underline transition-colors duration-150 "
          >
            {value.key}
          </Link>
        </li>
      ))}

      {suggestions.length === 0 && (
        <li className="px-3 py-2 text-gray-500 text-sm text-center">
          No suggestions found
        </li>
      )}
    </ul>
  );
}
