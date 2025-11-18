// import Link from 'next/link';

// export default function ShowSuggestions({ suggestions, suggestionClick }) {

//   return (
//     <ul className="list-none p-0 m-0 border border-t-0 border-gray-300 max-h-[150px] overflow-y-auto absolute w-full bg-white z-[1000] rounded-b-md sm:w-[400px]">
//       {
//         suggestions.map((value, index) => (
//           <p    key={index} className="truncate overflow-hidden text-ellipsis whitespace-nowrap mt-1">
//             <li className="sugg-line-item text-sm" key={index}>
//               {/* Conditionally render icon based on indicator */}
//               {value.value.indicator === "Report" && <i className="bi bi-file-earmark-text text-blue-500 px-1"></i>}
//               {value.value.indicator === "Data" && <i className="bi bi-database text-blue-500 px-1"></i>}

//               <Link href={value.value.url} onClick={(e) => {
//                 e.preventDefault(); // Prevent default link behavior for custom handling
//                 //props.suggestionClick(value.value);
//                 window.location.href = value.value.url; // Navigate to the URL
//               }}>
//                 {value.key}
//               </Link>
//             </li>
//           </p>
//         )
//         )
//       }
//     </ul>
//   );
// }



'use client';
import Link from "next/link";

export default function ShowSuggestions({ suggestions, suggestionClick }) {
  return (
    <ul className=" absolute w-full sm:w-[400px] bg-white border border-gray-300 border-t-0 rounded-b-lg shadow-lg max-h-[200px] overflow-y-auto z-[1000] divide-y divide-gray-100 transition-all duration-200 "
    >
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
