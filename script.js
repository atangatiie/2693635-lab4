const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    if (!countryName) {
        errorMessage.textContent = "Please enter a country name.";
        return;
    }

    spinner.classList.remove('hidden');
    errorMessage.textContent = "";
    countryInfo.innerHTML = "";
    borderingCountries.innerHTML = "";

    try {
        // Fetch main country
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error("Country not found");
        }

        const data = await response.json();
        const country = data[0];

        // Display country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" 
                 alt="${country.name.common} flag" 
                 width="150">
        `;

        // Fetch bordering countries
        if (country.borders) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderingCountries.innerHTML += `
                    <div>
                        <p>${borderCountry.name.common}</p>
                        <img src="${borderCountry.flags.svg}" 
                             alt="${borderCountry.name.common} flag" 
                             width="80">
                    </div>
                `;
            }
        } else {
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        errorMessage.textContent = "Error: Country not found. Please try again.";
    } finally {
        spinner.classList.add('hidden');
    }
}

// Click event
searchBtn.addEventListener('click', () => {
    searchCountry(countryInput.value.trim());
});

// Enter key event
countryInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        searchCountry(countryInput.value.trim());
    }
});
