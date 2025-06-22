export default function ShowSuggestions({ suggestions, suggestionClick }) {
  console.log("Check123: ", suggestions);
   
  
  return (
      <ul className="list-none p-0 m-0 border border-t-0 border-gray-300 max-h-[150px] overflow-y-auto absolute w-full bg-white z-[1000] rounded-b-md">
        {/* { suggestions.map((item, index) => (
          <li
            key={index}
            className="p-2 border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
            onClick={() => suggestionClick(item)}
          >
            <a className="no-underline text-black">{item}</a>
          </li>
        ))} */}
       
        {
          suggestions.map((value, index) => (
            <li className="sugg-line-item" key={index}> 🔎
              <a href={value.value} onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior for custom handling
                //props.suggestionClick(value.value);
                 window.location.href = value.value; // Navigate to the URL
              }}>
                {value.key}
              </a>
            </li>
          )
          )
        }
      </ul>
    );
  }
  