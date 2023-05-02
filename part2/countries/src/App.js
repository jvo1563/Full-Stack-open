import { useState, useEffect } from "react";
import axios from "axios";

import SearchBar from "./components/SearchBar";
import CountryList from "./components/CountryList";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [countriesToShow, setCountriesToShow] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get(`https://restcountries.com/v3.1/all`).then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCountriesToShow(
      countries.filter((country) =>
        country.name.common
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      )
    );
  };

  return (
    <div>
      <SearchBar search={search} handleSearchChange={handleSearchChange} />
      <CountryList
        countriesToShow={countriesToShow}
        setCountriesToShow={setCountriesToShow}
      />
    </div>
  );
};

export default App;
