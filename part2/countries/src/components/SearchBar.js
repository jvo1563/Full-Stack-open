const SearchBar = ({ search, handleSearchChange }) => {
  return (
    <div>
      Search Countries: <input value={search} onChange={handleSearchChange} />
    </div>
  );
};
export default SearchBar;
