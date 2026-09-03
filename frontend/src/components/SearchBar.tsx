import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search..."
}: SearchBarProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center bg-white rounded-full shadow-xl border border-gray-200 overflow-hidden">

        <span className="ml-6 text-gray-400 text-lg">🔍</span>

        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
          className="
          flex-1
          px-4
          py-5
          outline-none
          text-gray-700
          text-lg
          "
        />

        <button
          onClick={onSearch}
          className="
          px-8
          py-5
          bg-gradient-to-r
          from-blue-500
          to-cyan-500
          text-white
          font-semibold
          hover:opacity-90
          transition
          "
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;