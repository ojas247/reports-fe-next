import Link from 'next/link';

export default function ShowSuggestions({ suggestions, suggestionClick }) {

  return (
    <ul className="list-none p-0 m-0 border border-t-0 border-gray-300 max-h-[150px] overflow-y-auto absolute w-full bg-white z-[1000] rounded-b-md sm:w-[400px]">
      {
        suggestions.map((value, index) => (
          <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap mt-1">
            <li className="sugg-line-item text-sm" key={index}>
              {/* Conditionally render icon based on indicator */}
              {value.value.indicator === "Report" && <i className="bi bi-file-earmark-text text-blue-500 px-1"></i>}
              {value.value.indicator === "Data" && <i className="bi bi-database text-blue-500 px-1"></i>}

              <Link href={value.value.url} onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior for custom handling
                //props.suggestionClick(value.value);
                window.location.href = value.value.url; // Navigate to the URL
              }}>
                {value.key}
              </Link>
            </li>
          </p>
        )
        )
      }
    </ul>
  );
}
