import Link from 'next/link';

export default function Breadcrumbs({ items }) {
  return (
    <nav className="text-sm text-gray-600 my-4" aria-label="Breadcrumb">
       <div className="overflow-x-auto [-ms-overflow-style:'none'] [scrollbar-width:'none'] no-scrollbar">
        <ol className="list-reset flex flex-nowrap min-w-max">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index !== 0 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
              {item.href ? (
                <Link href={item.href} className="hover:underline text-blue-600 whitespace-nowrap">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-700 whitespace-nowrap">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>

  );
}
