import * as L from "leaflet";
import './styles.css';
import DBHelper from "./dbhelper";
import 'normalize.css';
import 'leaflet/dist/leaflet.css';
import registerServiceWorker from "./register";
registerServiceWorker();



let restaurants,
    neighborhoods,
    cuisines;
let newMap;
let markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    if(window.location.pathname !== '/index.html' && window.location.pathname !== '/'){
        return;
    }

    //testing online and offline
    function updateOnlineStatus(){
        if (window.navigator.onLine){
            DBHelper.setOnline();
        } else {
            DBHelper.setOffline();
        }
    }
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);


    document.querySelector('select[name="neighborhoods"]').onchange=updateRestaurants;
    document.querySelector('select[name="cuisines"]').onchange=updateRestaurants;
    initMap(); // added
    fetchNeighborhoods();
    fetchCuisines();

});

/**
 * Fetch all neighborhoods and set their HTML.
 */
let fetchNeighborhoods = () => {
    DBHelper.fetchNeighborhoods().then (neighborhoods => {
        self.neighborhoods = neighborhoods;
        fillNeighborhoodsHTML();
    });
}

/**
 * Set neighborhoods HTML.
 */
let fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
    const select = document.getElementById('neighborhoods-select');
    neighborhoods.forEach(neighborhood => {
        const option = document.createElement('option');
        option.innerHTML = neighborhood;
        option.value = neighborhood;
        select.append(option);
    });
}

/**
 * Fetch all cuisines and set their HTML.
 */
let fetchCuisines = () => {
    DBHelper.fetchCuisines().then (cuisines => {
        self.cuisines = cuisines;
        fillCuisinesHTML();
    });
}

/**
 * Set cuisines HTML.
 */
let fillCuisinesHTML = (cuisines = self.cuisines) => {
    const select = document.getElementById('cuisines-select');

    cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.innerHTML = cuisine;
        option.value = cuisine;
        select.append(option);
    });
}

/**
 * Initialize leaflet map, called from HTML.
 */
let initMap = () => {
    self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
    });
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoiamVubHlvdW5nIiwiYSI6ImNqaWtjcXIxbDFxZ3QzanQxeHBlZDFlNnAifQ.y4x3BELwSLRnpiWlq0ljFQ',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(self.newMap);

    updateRestaurants();
}

/**
 * Update page and map for current restaurants.
 */
let updateRestaurants = () => {
    const cSelect = document.getElementById('cuisines-select');
    const nSelect = document.getElementById('neighborhoods-select');

    const cIndex = cSelect.selectedIndex;
    const nIndex = nSelect.selectedIndex;

    const cuisine = cSelect[cIndex].value;
    const neighborhood = nSelect[nIndex].value;

    DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine,neighborhood).then(restaurants =>{
        resetRestaurants(restaurants);
        fillRestaurantsHTML();
    });
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
let resetRestaurants = (restaurants) => {
    // Remove all restaurants
    self.restaurants = [];
    const ul = document.getElementById('restaurants-list');
    ul.innerHTML = '';

    // Remove all map markers
    if (self.markers) {
        self.markers.forEach(marker => marker.remove());
    }
    self.markers = [];
    self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
let fillRestaurantsHTML = (restaurants = self.restaurants) => {
    const ul = document.getElementById('restaurants-list');
    restaurants.forEach(restaurant => {
        ul.append(createRestaurantHTML(restaurant));
    });
    addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
let createRestaurantHTML = (restaurant) => {
    //creates individual restaurant cards
    const li = document.createElement('li');

    //create favorite button and add click event that changes color and value
    const favorite = document.createElement('button');
    favorite.innerHTML = '<i class="fa fa-heart"></i>';
    let initialClassName = 'first favorite-button';

    initialClassName += restaurant.is_favorite == "true" ? ' is-favorite' : ' not-favorite';

    favorite.setAttribute('aria-label', restaurant.is_favorite == "true" ? "restaurant is favorite" : "restaurant is not favorite")

    favorite.className = initialClassName;

    favorite.onclick = function (e) {

        toggleFavoriteOnClick(restaurant);

        //Have to do this because the API changes the bool to a string
        restaurant.is_favorite = (restaurant.is_favorite == "true").toString();

        if (restaurant.is_favorite==="true") {
            favorite.className = 'first favorite-button is-favorite';
            favorite.setAttribute('aria-label', "restaurant is favorite")
        } else {
            favorite.className = 'first favorite-button not-favorite';
            favorite.setAttribute('aria-label', "restaurant is not favorite")
        }
    };
    li.append(favorite);

    //creates image
    const image = document.createElement('img');
    image.className = 'restaurant-img';
    image.alt = `Image from the restaurant ${restaurant.name}`;
    // image.srcset = DBHelper.imageUrlForRestaurant(restaurant);
    image.src = DBHelper.imageThumnailUrlForRestaurant(restaurant);
    li.append(image);

    //create restaurant name
    const name = document.createElement('h3');
    name.innerHTML = restaurant.name;
    li.append(name);

    //create neighborhood and address

    const neighborhood = document.createElement('p');
    neighborhood.innerHTML = restaurant.neighborhood;
    li.append(neighborhood);

    const address = document.createElement('p');
    address.innerHTML = restaurant.address;
    li.append(address);

    //view details button
    const more = document.createElement('button');
    more.innerHTML = 'View Details';
    more.className = 'alt=View Details of `${restaurant.name}`';
    more.className = 'tabindex="0"';
    more.className = 'view-more-button';
    more.onclick = function () {
        const url = DBHelper.urlForRestaurant(restaurant);
        window.location = url;
    };
    li.append(more);
    return li
}

/**
 * Add markers for current restaurants to the map.
 */
let addMarkersToMap = (restaurants = self.restaurants) => {
    restaurants.forEach(restaurant => {
        // Add marker to the map
        const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
        marker.on("click", onClick);

        function onClick() {
            window.location.href = marker.options.url;
        }

        self.markers.push(marker);
    });
}


/**
 * Toggles the value of the favorite button
 */
let toggleFavoriteOnClick = (restaurant = self.restaurants) => {

    restaurant.is_favorite = (!(restaurant.is_favorite == "true")).toString();

    let id = restaurant.id;

    DBHelper.toggleIsFavoriteStatus(id, restaurant.is_favorite);
}

