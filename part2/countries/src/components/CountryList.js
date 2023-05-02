import WeatherData from "./WeatherData";

const CountryList = ({ countriesToShow, setCountriesToShow }) => {
  if (countriesToShow.length === 1) {
    const country = countriesToShow[0];
    return (
      <div>
        {/* <div>{JSON.stringify(country, undefined, 2)}</div>
        <div>{country.capitalInfo.latlng[1]}</div> */}
        <h1>{country.name.common}</h1>
        <div>Capital: {country.capital}</div>
        <div>Area: {country.area} km²</div>
        <h3>Languages:</h3>
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={`${country.name.common} flag`} />
        <WeatherData country={country} />
      </div>
    );
  }
  if (countriesToShow.length > 10) {
    return <div>Too many matches, specifiy another filter</div>;
  }
  return countriesToShow.map((country) => (
    <div key={country.name.official}>
      {country.name.common}{" "}
      <button onClick={() => setCountriesToShow([country])}>show</button>
    </div>
  ));
};
export default CountryList;
