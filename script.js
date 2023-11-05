//Data fetching API code
function fetchAPICode(apiUrl, dataStoredAs) {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem(`${dataStoredAs}`, JSON.stringify(data));
    })
    .catch((error) => {
      console.log("Error fetching data: ", error);
    });
  const apiData = JSON.parse(localStorage.getItem(`${dataStoredAs}`));
  return apiData;
}

//formating datetime

function dateTimeFormate(datetime) {
  const timestampMs = datetime * 1000;
  const dateUtc = new Date(timestampMs);
  const gmtString = dateUtc.toUTCString();
  return gmtString;
}

/*************************************
 *                                   *
 *   Task 1: OpenWeatherMap API      *
 *                                   *
 * ******************************** */
//Get Country latitude & londitude information
console.log("******************** Task 1: OpenWeatherMap API ********************");

var countryName = "Japan";
var cityName = "Tokyo";
var dataLimit = 5;
var openWeatherMapAPIKey = "426b9cdadf512d13b6b817c7ecd68175";
var openWeatherMapLatLonAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryName}&limit=${dataLimit}&appid=${openWeatherMapAPIKey}`;

const countryLatLotData = fetchAPICode(
  openWeatherMapLatLonAPI,
  "countryLatLon"
);

var tokyoLat = "";
var tokyoLon = "";

for (var i = 0; i < countryLatLotData.length; i++) {
  var nameVal = countryLatLotData[i].name;
  var countryVal = countryLatLotData[i].country;
  if (nameVal === cityName && countryVal === "JP") {
    tokyoLat = countryLatLotData[i].lat;
    tokyoLon = countryLatLotData[i].lon;
    break;
  }
}

// Get 5-day forecast for Tokyo, Japan

var openWeatherMap5DaysForcastAPI = `http://api.openweathermap.org/data/2.5/forecast?lat=${tokyoLat}&lon=${tokyoLon}&appid=${openWeatherMapAPIKey}`;

const fiveDaysForeCast = fetchAPICode(
  openWeatherMap5DaysForcastAPI,
  "fiveDaysforecast"
);

console.log(
  "Tokyo Japan, five days weather forcast raw data from API:\n",
  fiveDaysForeCast
);
console.log("\n");
const fiveDaysForeCast_ActualList = fiveDaysForeCast.list;
var fiveDaysWeatherForecastInformation = new Array();

for (var i = 0; i < fiveDaysForeCast_ActualList.length; i++) {
  var tempInF =
    ((fiveDaysForeCast_ActualList[i].main.temp - 273.15) * 9) / 5 + 32;
  fiveDaysWeatherForecastInformation.push({
    date: fiveDaysForeCast_ActualList[i].dt_txt.substring(0, 10),
    time: fiveDaysForeCast_ActualList[i].dt_txt.substring(11, 19),
    temp_feelsLike: `${Math.round(
      ((fiveDaysForeCast_ActualList[i].main.feels_like - 273.15) * 9) / 5 + 32
    )}${"\xB0"}f`,
    temp: `${Math.round(
      ((fiveDaysForeCast_ActualList[i].main.temp - 273.15) * 9) / 5 + 32
    )}${"\xB0"}f`,
    humidity: `${fiveDaysForeCast_ActualList[i].main.humidity}%`,
    weather: fiveDaysForeCast_ActualList[i].weather[0].description,
  });
}

const fiveDaysWeatherReport = Object.groupBy(
  fiveDaysWeatherForecastInformation,
  ({ date }) => date
);

console.log(
  "Comming Five Days Weather Information of Tokyo, Japan=>\n",
  fiveDaysWeatherReport
);
console.log("\n");
// Get current weather for London, United Kingdom.

countryName = "GB";
cityName = "London";
dataLimit = 5;
var ukLatLonAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryName}&limit=${dataLimit}&appid=${openWeatherMapAPIKey}`;

const ukCountryLatLotData = fetchAPICode(ukLatLonAPI, "UkLatLon");

var latLondon = "";
var lonLondon = "";

for (var i = 0; i < ukCountryLatLotData.length; i++) {
  var nameVal = ukCountryLatLotData[i].name;
  var countryVal = ukCountryLatLotData[i].country;
  if (nameVal === cityName && countryVal === "GB") {
    latLondon = ukCountryLatLotData[i].lat;
    lonLondon = ukCountryLatLotData[i].lon;
    break;
  }
}

var ukCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${latLondon}&lon=${lonLondon}&appid=${openWeatherMapAPIKey}`;

const ukCurrentWeatherInfo = fetchAPICode(ukCurrentWeather, "UkCurrentWeather");

console.log(
  "London United Kingdom, current weather raw data from API:\n ",
  ukCurrentWeatherInfo
);
console.log("\n");
var ukCurrentWeatherData = {
  temp_feelsLike: `${Math.round(
    ((ukCurrentWeatherInfo.main.feels_like - 273.15) * 9) / 5 + 32
  )}${"\xB0"}f`,
  temp: `${Math.round(
    ((ukCurrentWeatherInfo.main.temp - 273.15) * 9) / 5 + 32
  )}${"\xB0"}f`,
  humidity: `${ukCurrentWeatherInfo.main.humidity}%`,
  weather: ukCurrentWeatherInfo.weather[0].description,
  sunrise: dateTimeFormate(ukCurrentWeatherInfo.sys.sunrise),
  sunset: dateTimeFormate(ukCurrentWeatherInfo.sys.sunset),
};

console.log(
  `London, United Kingdom current weather Information:\n\ntemp_feelsLike:${ukCurrentWeatherData.temp_feelsLike}\ntemp:${ukCurrentWeatherData.temp}\nhumidity:${ukCurrentWeatherData.humidity}\nweather:${ukCurrentWeatherData.weather}\nsunrise:${ukCurrentWeatherData.sunrise}\nsunset:${ukCurrentWeatherData.sunset}`
);
console.log("\n");

/*************************************
 *                                   *
 *   Task 3: REST Countries API      *
 *                                   *
 * ******************************** */
console.log("********************* Task 3: REST Countries API *********************");

const brazilCountriesInformation = fetchAPICode("https://restcountries.com/v3.1/name/Brazil","brazildata");

console.log("Brazil related raw data from API:\n",brazilCountriesInformation);

const brazilCountryDataInfo = {
    CountryName:brazilCountriesInformation[0].name.common,
    language:brazilCountriesInformation[0].languages.por,
    population:brazilCountriesInformation[0].population,
    area:brazilCountriesInformation[0].area
}

console.log(
  `Brazil country related information:\n\nCountryName:${brazilCountryDataInfo.CountryName}\nlanguage:${brazilCountryDataInfo.language}
  \npopulation:${brazilCountryDataInfo.population}\narea:${brazilCountryDataInfo.area}`
)
console.log("\n");


const allCountriesListInAfricaInfo = fetchAPICode("https://restcountries.com/v3.1/region/Africa","allCountriesInAfrica");


console.log("Retrieve a list of all countries in Africa related raw data from API:\n",allCountriesListInAfricaInfo);
console.log("\n");
console.log("Retrieve a list of all countries in Africa:\n");
const allAfricanCountriesInfo = [];
for(let i=0;i<allCountriesListInAfricaInfo.length;i++)
{
  allAfricanCountriesInfo.push({
    Region: allCountriesListInAfricaInfo[i].region,
    CountryName: allCountriesListInAfricaInfo[i].name.common,
    language: Object.values(allCountriesListInAfricaInfo[i].languages),
    population: allCountriesListInAfricaInfo[i].population,
    area: allCountriesListInAfricaInfo[i].area
  })
}

allAfricanCountriesInfo.forEach((country, index) => {
  console.log(`Country ${index + 1}`);
  for (const key in country) {
    if (country.hasOwnProperty(key)) {
      console.log(`${key}: ${country[key]}`);
    }
  }
  console.log('\n');
});
/*************************************
 *                                   *
 * Task 4: Currency Converter API    *
 *                                   *
 * ******************************** */
console.log("********************* Task 4: Currency Converter API *********************");

const usdToOtherConversionRates = fetchAPICode('https://v6.exchangerate-api.com/v6/0c5138fd4e66abffaa7a09fb/latest/USD',"usdtootherexchangerate");
console.log("USD to other currency conversion rates raw data fetched from API\n",usdToOtherConversionRates);
console.log("\n")
console.log(`1 USD = ${usdToOtherConversionRates.conversion_rates.EUR} EUR`);
var userEnteredValue = 100;
console.log(` ${userEnteredValue} USD = ${((usdToOtherConversionRates.conversion_rates.EUR)*userEnteredValue)} EUR`);
console.log("\n")


const JPYToOtherConversionRates = fetchAPICode('https://v6.exchangerate-api.com/v6/0c5138fd4e66abffaa7a09fb/latest/JPY',"jpytootherexchangerate");
console.log("JPY to other currency conversion rates raw data fetched from API\n",JPYToOtherConversionRates);
console.log("\n")
console.log(`1 JPY = ${JPYToOtherConversionRates.conversion_rates.GBP} GBP`);
var userEnteredValue = 1000 ;
console.log(` ${userEnteredValue} JPY = ${((JPYToOtherConversionRates.conversion_rates.EUR)*userEnteredValue)} GBP`);

