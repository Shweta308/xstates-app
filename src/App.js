import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    fetch("https://crio-location-selector.onrender.com/countries")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch countries");
        }
        return response.json();
      })
      .then((data) => setCountries(data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetch(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/states`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch states");
          }
          return response.json();
        })
        .then((data) => {
          setStates(data);
          setSelectedState("");
          setCities([]);
          setSelectedCity("");
        })
        .catch((error) => console.error("Error fetching states:", error));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetch(
        `https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch cities");
          }
          return response.json();
        })
        .then((data) => {
          setCities(data);
          setSelectedCity("");
        })
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [selectedCountry, selectedState]);

  return (
    <div className="city-selector" role="presentation">
      <h1>Select Location</h1>
      <div className="dropdowns">
        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="dropdown">
        <option value="" disabled> Select Country </option>
          {countries.map((country) => (
            <option key={country} value={country}> {country} </option>
          ))}
        </select>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="dropdown"
          disabled={!selectedCountry}
        >
          <option value="" disabled>Select State </option>
          {states.map((state) => (
            <option key={state} value={state}> {state} </option>
          ))}
        </select>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="dropdown"
          disabled={!selectedCountry || !selectedState}
        >
          <option value="" disabled>
            Select City
          </option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      {selectedCity && (
        <h2 className="result">
          You selected <span className="highlight">{selectedCity}</span>
          <span className="fade">
            {" "}, {selectedState}, {selectedCountry}
          </span>
        </h2>
      )}
    </div>
  );
}
