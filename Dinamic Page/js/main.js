const time = document.getElementById('time'),
greeting = document.getElementById('greeting'),
myName = document.getElementById('myname'),
myFocus = document.getElementById('focus'),
date = document.getElementById('date'),
images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', 
'11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'],
body = document.querySelector('body'),
nextImg = document.querySelector('.next_image'),
blockquote = document.querySelector('blockquote'),
nextQuote = document.querySelector('.next_quote'),
weather = document.getElementById('weather'),
error = document.getElementById('city_error'),
weatherIcon = document.querySelector('.weather_icon'),
temperature = document.querySelector('.temperature'),
weatherDescription = document.querySelector('.weather_description'),
humidity = document.querySelector('.humidity'),
windSpeed = document.querySelector('.wind_speed'),
myCity = document.querySelector('.city');
let i = 1,
base = 'img/night/',
reg = new RegExp("\\S");

function showTime(){
	let today = new Date(),
	hour = today.getHours(),
	min = today.getMinutes(),
	sec = today.getSeconds();

	time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
	setTimeout(showTime, 1000);
}

function getDate(){
	let today = new Date();
	date.innerHTML = `${today.toLocaleString('en', { weekday: 'long', month: 'long', day: 'numeric' })}`;
}

function addZero(n){
	return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

function setBgGreet(){
	if (localStorage.getItem('image') != null) {
		i = Number(localStorage.getItem('image'));
	}

	let today = new Date(),
	hour = today.getHours();
	if(hour > 6 && hour <= 12){
		base = 'img/morning/';
		greeting.textContent = 'Good Morning, ';
	} else if (hour > 12 && hour <= 18) {
		base = 'img/day/';
		greeting.textContent = 'Good Afternoon, ';
	} else if (hour > 18 && hour <= 24) {
		base = 'img/evening/';
		greeting.textContent = 'Good Evening, ';
	} else{
		base = 'img/night/';
		greeting.textContent = 'Good Night, ';
	}
	document.body.style.backgroundImage = `url('${base}${images[i]}')`;
	setTimeout(getImage, minToMsec(60 - today.getMinutes()));
}

function minToMsec(min){
	return min * 1000 * 60;
}

function getName() {
	if (localStorage.getItem('name') === null) {
		myName.textContent = '[Enter Name]';
	} else {
		myName.textContent = localStorage.getItem('name');
	}
}

function getFocus() {
	if (localStorage.getItem('focus') === null) {
		myFocus.textContent = '[Enter Focus]';
	} else {
		myFocus.textContent = localStorage.getItem('focus');
	}
}

function getCity() {
	if (localStorage.getItem('city') === null) {
		error.style.display = "initial";
		weather.style.display = "none";
		error.textContent = "Enter city to get the weather";
		myCity.textContent = '[Enter City]';
	} else {
		myCity.textContent = localStorage.getItem('city');
		getWeather();
	}
}

function setName(e) {
	if (e.type === 'keypress'){
		if(e.which == 13 || e.keyCode == 13){
			if(!reg.test(myName.textContent))
				getName();
			else
				localStorage.setItem('name', e.target.innerText);
			myName.blur();
		}
	}else{
		if(!reg.test(myName.textContent))
			getName();
		else
			localStorage.setItem('name', e.target.innerText);
	}
}

function setFocus(e) {
	if (e.type === 'keypress'){
		if(e.which == 13 || e.keyCode == 13){
			if(!reg.test(myFocus.textContent))
				getFocus();
			else
				localStorage.setItem('focus', e.target.innerText);
			myFocus.blur();
		}
	}else{
		if(!reg.test(myFocus.textContent))
			getFocus();
		else
			localStorage.setItem('focus', e.target.innerText);
	}
}

function setCity(e) {
	if (e.type === 'keypress'){
		if(e.which == 13 || e.keyCode == 13){
			if(!reg.test(myCity.textContent))
				getCity();
			else{
				localStorage.setItem('city', e.target.innerText);
				getWeather();
			}
			myCity.blur();
		}
	}else{
		if(!reg.test(myCity.textContent))
			getCity();
		else{
			localStorage.setItem('city', e.target.innerText);
			getWeather();
		}
	}
}

function hideName(){
	myName.textContent = '';
}

function hideFocus(){
	myFocus.textContent = '';
}


function viewBgImage(src) {  
	const img = new Image();
	img.src = src;
	img.onload = () => {      
		body.style.backgroundImage = `url(${src})`;
	}; 
}

function getImage() {
	i = (i + 1) % images.length;
	localStorage.setItem('image', i);
	const imageSrc = base + images[i];
	viewBgImage(imageSrc);
	nextImg.disabled = true;
	setTimeout(function() { nextImg.disabled = false }, 1000);
	setTimeout(getImage, minToMsec(60));
} 

async function getQuote() {  
	const url = `https://api.adviceslip.com/advice`;
	const res = await fetch(url);
	const data = await res.json(); 
	blockquote.textContent = `\"${data.slip.advice}\"`;
}

async function getWeather() {
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${myCity.textContent}&lang=en&appid=815e3089c723efed516bcfcf29aae752&units=metric`;
	const res = await fetch(url);
	const data = await res.json();
	if(data.weather === undefined){
		error.style.display = "initial";
		error.textContent = "Cant find weather for your city";
		weather.style.display = "none";
	}else{
		error.style.display = "none";
		weather.style.display = "initial";
		weatherIcon.className = 'weather-icon owf';
		weatherIcon.classList.add(`owf-${data.weather[0].id}`);
		temperature.textContent = `${Math.round(data.main.temp)}°`;
		windSpeed.textContent = `${data.wind.speed} m/s`;
		humidity.textContent = `${data.main.humidity}%`;
		weatherDescription.textContent = data.weather[0].description;
	}
}


nextQuote.addEventListener('click', getQuote);
nextImg.addEventListener('click', getImage);
myName.addEventListener('keypress', setName);
myName.addEventListener('blur', setName);
myName.addEventListener('focus', hideName);
myFocus.addEventListener('keypress', setFocus);
myFocus.addEventListener('blur', setFocus);
myFocus.addEventListener('focus', hideFocus);
myCity.addEventListener('blur', setCity);
myCity.addEventListener('keypress', setCity);

 //Run
 showTime();
 setBgGreet();
 getName();
 getFocus();
 getDate();
 getQuote();
 getCity();
