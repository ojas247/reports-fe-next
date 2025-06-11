export default function ShowSuggestions({ suggestions, suggestionClick }) {
    return (
      <ul className="list-none p-0 m-0 border border-t-0 border-gray-300 max-h-[150px] overflow-y-auto absolute w-full bg-white z-[1000] rounded-b-md">
        {suggestions.map((item, index) => (
          <li
            key={index}
            className="p-2 border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
            onClick={() => suggestionClick(item)}
          >
            <a className="no-underline text-black">{item}</a>
          </li>
        ))}
      </ul>
    );
  }
  