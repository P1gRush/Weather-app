const link =
	'http://api.weatherapi.com/v1/current.json?key=1c4335cd1be447f5bd5131243241506';
const root = document.getElementById('root');
const popup = document.getElementById('popup');
const textInput = document.getElementById('text-input');
const formSubmit = document.getElementById('form');
const closeBtn = document.getElementById('close');
let store = {
	city: 'Ekaterinburg',
	feelsLike: 0,
	temperature: 0,
	localTime: '00:00 AM',
	isDay: 1,
	description: '',
	icon: '',
	properties: {
		cloud: {},
		humidity: {},
		windSpeed: {},
		pressure: {},
		uvIndex: {},
		visibility: {},
	},
};
const fetchData = async () => {
	try {
		const querry = localStorage.getItem('querry') || store.city;
		const result = await fetch(`${link}&q=${querry}`);
		const data = await result.json();
		const {
			current: {
				feelslike_c: feelsLike,
				cloud,
				temp_c: temperature,
				humidity,
				pressure_mb: pressure,
				uv: uvIndex,
				vis_km: visibility,
				is_day: isDay,
				wind_kph: windSpeed,
				condition: { text: description, icon },
			},
			location: { name: city, localtime: localTime },
		} = data;
		const [date, time] = localTime.split(' ');

		store = {
			...store,
			city,
			feelsLike,
			temperature,
			date,
			time,
			isDay,
			description,
			icon,
			properties: {
				cloud: {
					title: 'Cloud cover',
					value: `${cloud}%`,
					icon: 'cloud.png',
				},
				humidity: {
					title: 'Humidity',
					value: `${humidity}%`,
					icon: 'humidity.png',
				},
				windSpeed: {
					title: 'Wind speed',
					value: `${windSpeed} km/h`,
					icon: 'wind.png',
				},
				pressure: {
					title: 'Pressure',
					value: `${pressure} mb`,
					icon: 'gauge.png',
				},
				uvIndex: {
					title: 'UV index',
					value: `${uvIndex}`,
					icon: 'uv-index.png',
				},
				visibility: {
					title: 'Visability',
					value: `${visibility} km`,
					icon: 'visibility.png',
				},
			},
		};
		renderComponent();
	} catch (error) {
		console.log('Ошибка при получении данных:', error);
	}
};

const renderProperty = properties => {
	return Object.values(properties)
		.map(({ title, value, icon }) => {
			return `<div class="property">
		<div class="property-icon">
		  <img src="./img/icons/${icon}" alt="">
		</div>
		<div class="property-info">
		  <div class="property-info__value">${value}</div>
		  <div class="property-info__description">${title}</div>
		</div>
	 </div>`;
		})
		.join('');
};

const markup = () => {
	const { city, temperature, time, description, icon, isDay, properties } =
		store;

	const containerClass = isDay === 1 ? 'is-day' : '';

	return `<div class="container ${containerClass}">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                  <div class="city-title ${containerClass}" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
               	<img class="icon" src=${icon} alt="" />
                <div class="description">${description}</div>
              </div>
            
              <div class="top-right">
                <div class="city-info__subtitle">as of ${time}</div>
                <div class="city-info__title">${temperature}°</div>
              </div>
            </div>
          </div>
        <div id="properties">${renderProperty(properties)}</div>
      </div>`;
};
const renderComponent = () => {
	root.innerHTML = markup();

	const city = document.getElementById('city');
	city.addEventListener('click', togglePopupClass);
};

const togglePopupClass = () => {
	popup.classList.toggle('active');
};

const handleInput = () => {
	store = {
		...store,
		city: event.target.value,
	};
};

const handleSubmit = event => {
	event.preventDefault();
	const value = store.city;
	if (!value) return null;
	localStorage.setItem('querry', value);
	fetchData();
	togglePopupClass();
};

formSubmit.addEventListener('submit', handleSubmit);
textInput.addEventListener('input', handleInput);
closeBtn.addEventListener('click', togglePopupClass);

fetchData();
