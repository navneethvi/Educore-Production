import React, { useState } from "react";

interface SearchBarProps {
  onSearch?: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className="store-header flex justify-between items-center bg-white rounded-lg shadow-sm p-2 md:p-4">
  <input
    type="text"
    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-full h-10 w-full focus:ring-blue-500 focus:border-transparent block p-3 placeholder-gray-500"
    placeholder={placeholder}
    value={searchTerm}
    onChange={handleSearchChange}
  />
</div>

  );
};

export default SearchBar;

