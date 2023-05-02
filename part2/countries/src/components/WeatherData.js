import { useEffect, useState } from "react";
import axios from "axios";

const WeatherData = ({ country }) => {
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    if (country.capitalInfo.latlng !== undefined) {
      axios
        .get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&units=imperial&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
        )
        .then((response) => {
          //   console.log(response.data);
          setWeather(response.data);
        });
    }
  }, [country]);
  return (
    <>
      {weather.current ? (
        <div>
          <h3>Weather in {country.capital}</h3>
          <div>Temperature: {weather.current.feels_like} °F</div>
          <img
            alt="weather icon"
            src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`}
          />
          <div>Wind speeds are {weather.current.wind_speed} m/s</div>
        </div>
      ) : null}
    </>
  );
};

export default WeatherData;
