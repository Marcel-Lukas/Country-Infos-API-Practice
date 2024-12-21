let allCountries = [];
let currentCountryIndex = 0;

let countriesURL = "https://restcountries.com/v3.1/all";


function init() {
  fetchCountries();
}


async function fetchCountries() {
  try {
    showLoadingScreen();
    let response = await fetch(countriesURL);
    let responseAsJson = await response.json();

    for (let index = 0; index < responseAsJson.length; index++) {
      let country = responseAsJson[index];
      allCountries.push(country);
    }
    renderCountries();
  } catch (error) {
    console.error(`Failed to fetch:`, error);
  } finally {
    hideLoadingScreen();
  }
}


function renderCountries() {
  const container = document.getElementById("countriesContainer");
  container.innerHTML = "";

  for (let i = 0; i < allCountries.length; i++) {
    const country = allCountries[i];
    container.innerHTML += generateCountryHTML(country);
  }
}


function generateCountryHTML(country) {
  const commonName = country.name.common || "N/A";
  const capital = country.capital ? country.capital.join(", ") : "N/A";
  const continents = country.continents ? country.continents.join(", ") : "N/A";
  const flag = country.flags && country.flags.png
    ? `<img onclick="openOverlay(this)" src="${country.flags.png}" alt="Flag of ${commonName}">`
    : "N/A";
  const coatOfArms = country.coatOfArms && country.coatOfArms.png
    ? `<img class="emblem" src="${country.coatOfArms.png}" alt="Coat of Arms of ${commonName}">`
    : `<img class="no-emblem" src="${country.flags.png}" alt="Flag of ${commonName}">`;
    const googleMapsLink = country.maps && country.maps.googleMaps
    ? `<a class="googleAnker" href="${country.maps.googleMaps}" target="_blank" rel="noopener noreferrer">View on Google Maps</a>`
    : "N/A";
  const cca2 = country.cca2 || "N/A";

  return /*html*/`
    <div class="country-card">
      ${coatOfArms}
        <div class="card-head">
          <h2>${commonName}</h2>
        </div>
        <div class="flag-con">${flag}</div>
      <table>
        <tr>
          <td class="left-td">Capital:</td>
          <td class="right-td">${capital}</td>
        </tr>
        <tr>
            <td class="left-td">Continent:</td>
            <td class="right-td">${continents}</td>
        </tr>
        <tr>
            <td class="left-td">Country Code:</td>
            <td class="right-td">${cca2}</td>
        </tr>
        <tr>
            <td class="left-td">Map:</td>
            <td class="right-td">${googleMapsLink}</td>
        </tr>
      </table>
    </div>
  `;
}


async function filterByContinent(continent) {
  showLoadingScreen();

  await new Promise(resolve => setTimeout(resolve, 0));

  let filtered;
  if (continent) {
    filtered = allCountries.filter(country => {
      return country.continents && country.continents.includes(continent);
    });
  } else {
    filtered = allCountries;
  }
  
  renderFilteredCountries(filtered);
  hideLoadingScreen();
}


function showLoadingScreen() {
  document.getElementById("loadingScreen").classList.remove("d-none");
}


function hideLoadingScreen() {
  document.getElementById("loadingScreen").classList.add("d-none");
}


function renderFilteredCountries(filteredCountries) {
  const container = document.getElementById("countriesContainer");
  container.innerHTML = "";

  for (let i = 0; i < filteredCountries.length; i++) {
    const country = filteredCountries[i];
    container.innerHTML += generateCountryHTML(country);
  }
}


// ########### 

function openOverlay(flagElement) {
  // Land anhand des Alt-Texts identifizieren
  const altText = flagElement.alt;
  const countryName = altText.replace("Flag of ", "");
  
  // Aus allCountries das passende Objekt suchen
  const country = allCountries.find(c => c.name.common === countryName);

  const commonName = country.name.common || "N/A";
  const officialName = country.name.official || "N/A";
  const capital = country.capital ? country.capital.join(", ") : "N/A";
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map(curr => `${curr.name} (${curr.symbol || ""})`)
        .join(", ")
    : "N/A";
  const region = country.region || "N/A";
  const subregion = country.subregion || "N/A";
  const continents = country.continents ? country.continents.join(", ") : "N/A";
  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";
  const population = country.population
    ? country.population.toLocaleString()
    : "N/A";
  const area = country.area
    ? `${country.area.toLocaleString()} km²`
    : "N/A";
  const flag = country.flags?.png
    ? `<img src="${country.flags.png}" alt="Flag of ${commonName}">`
    : "N/A";
  const coatOfArms = country.coatOfArms?.png
    ? `<img src="${country.coatOfArms.png}" alt="Coat of Arms of ${commonName}">`
    : "N/A";
  const googleMapsLink = country.maps?.googleMaps
    ? `<a href="${country.maps.googleMaps}" target="_blank">View on Google Maps</a>`
    : "N/A";
  const timezones = country.timezones
    ? country.timezones.join(", ")
    : "N/A";
  const carSide = country.car?.side
    ? country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1)
    : "N/A";
  const borders = country.borders
    ? country.borders.join(", ")
    : "N/A";
  const cca2 = country.cca2 || "N/A";
  const phoneCode = country.idd?.root
    ? `${country.idd.root}${
        country.idd.suffixes ? country.idd.suffixes.join(", ") : ""
      }`
    : "N/A";

  
    const overlayHTML = /*html*/ `
    <div class="overlay-header">
      <img id="x-btn" onclick="closeOverlay()" src="src/img/icons/x-mark.png" alt="X-Button">
    </div>
    <div class="overlay-country-body">
      <h2 class="overlay-h2">${commonName}</h2>
      <h3 class="overlay-h3">(${officialName})</h3>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Region:</strong> ${region}</p>
      <p><strong>Subregion:</strong> ${subregion}</p>
      <p><strong>Continent:</strong> ${continents}</p>
      <p><strong>Population:</strong> ${population}</p>
      <p><strong>Area:</strong> ${area}</p>
      <p><strong>Languages:</strong> ${languages}</p>
      <p><strong>Currencies:</strong> ${currencies}</p>
      <p><strong>Timezones:</strong> ${timezones}</p>
      <p><strong>Driving Side:</strong> ${carSide}</p>
      <p><strong>Borders:</strong> ${borders}</p>
      <p><strong>Country Code:</strong> ${cca2}</p>
      <p><strong>Phone Code:</strong> ${phoneCode}</p>
      <p><strong>Map:</strong> ${googleMapsLink}</p>
    </div>
    <div class="overlay-country-flag">
      ${flag}
    </div>
    <div class="overlay-country-coat-of-arms">
      <p><strong>Emblem:</strong></p>
      ${coatOfArms}
    </div>
    <div class="overlay-footer">
      <img class="overlay-btn" onclick="prevCountry()" src="src/img/icons/d-arrow-left.png" alt="Arrow Left">
      <img class="overlay-btn" onclick="nextCountry()" src="src/img/icons/d-arrow-right.png" alt="Arrow Right">
    </div>
  `;

  const overlayContent = document.getElementById("overlayContent");
  const overlay = document.getElementById("overlay");
  
  overlayContent.innerHTML = overlayHTML;
  overlay.classList.remove("d-none");
}


function closeOverlay() {
  document.getElementById("overlay").classList.add("d-none");
}


document.addEventListener("DOMContentLoaded", function() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.addEventListener("click", function(event) {
      if (!document.getElementById("overlayContent").contains(event.target)) {
        closeOverlay();
      }
    });
  }
});


