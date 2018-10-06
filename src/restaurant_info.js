import * as L from "leaflet";
import './styles.css';
import DBHelper from "./dbhelper";
import 'normalize.css';
import 'leaflet/dist/leaflet.css';
import registerServiceWorker from "./register";

registerServiceWorker();

let restaurant;
let newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
    if (window.location.pathname !== '/restaurant.html') {
        return;
    }
    initMap();

    // let reviewForm = document.getElementById('review-form');
    // reviewForm.addEventListener('submit', submitReview);

});

let submitReview = () => {
    event.preventDefault();

    let name = document.getElementById('name-input').value;
    let rating = document.getElementById('rating-input').value;
    let comments = document.getElementById('comment-input').value;
    const reviewData = {
        restaurant_id: id,
        name: name,
        rating: rating,
        comments: comments,
        createdAt: Date.now()
    };

    DBHelper.addReviewForRestaurant(reviewData).then(() => {
        //TODO: Add to html
    });

};
/**
 * Initialize leaflet map
 */
let initMap = () => {
    fetchRestaurantFromURL();
}


/**
 * Get current restaurant from page URL.
 */
// let fetchRestaurantFromURL = (callback) => {
//     if (self.restaurant) { // restaurant already fetched!
//         callback(null, self.restaurant)
//         return;
//     }
//     const id = getParameterByName('id');
//     if (!id) { // no id found in URL
//         let error = 'No restaurant id in URL';
//         callback(error, null);
//     } else {
//         DBHelper.fetchRestaurantById(id, (error, restaurant) => {
//             self.restaurant = restaurant;
//             if (!restaurant) {
//                 console.error(error);
//                 return;
//             }
//             fillRestaurantHTML();
//             callback(null, restaurant)
//         });
//     }
// }

let fetchRestaurantFromURL = (restaurant) => {
    const id = getParameterByName('id');

    if (self.restaurant) { // restaurant already fetched!
        return self.restaurant;
    }

    if (!id) { // no id found in URL
        let error = 'No restaurant id in URL';
        return error;
    }

    DBHelper.fetchRestaurantById(id).then(restaurant => {
        self.restaurant = restaurant;
        fillRestaurantHTML();
        colorIsFavoriteHeart();

        self.newMap = L.map('map', {
            center: [restaurant.latlng.lat, restaurant.latlng.lng],
            zoom: 16,
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
        fillBreadcrumb();
        DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    });
}

/**
 * Create restaurant HTML and add it to the webpage
 */
let fillRestaurantHTML = (restaurant = self.restaurant) => {
    const name = document.getElementById('restaurant-name');
    name.innerHTML = restaurant.name;

    const address = document.getElementById('restaurant-address');
    address.innerHTML = restaurant.address;

    const image = document.getElementById('restaurant-img');
    image.className = 'restaurant-img';
    image.srcset = DBHelper.imageUrlForRestaurant(restaurant);
    image.alt = `Image from the restaurant ${restaurant.name}`;

    const cuisine = document.getElementById('restaurant-cuisine');
    cuisine.innerHTML = restaurant.cuisine_type;

    // fill operating hours
    if (restaurant.operating_hours) {
        fillRestaurantHoursHTML();
    }
    // fill reviews
    DBHelper.fetchReviewsByRestaurantId(self.restaurant.id)
        .then(reviews => {
            fillReviewsHTML(reviews);
        });
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
let fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
    const hours = document.getElementById('restaurant-hours');
    for (let key in operatingHours) {
        const row = document.createElement('tr');

        const day = document.createElement('td');
        day.innerHTML = key;
        row.appendChild(day);

        const time = document.createElement('td');
        time.innerHTML = operatingHours[key];
        row.appendChild(time);

        hours.appendChild(row);
    }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
let fillReviewsHTML = (reviews = self.restaurant.reviews) => {
    const container = document.getElementById('reviews-container');
    const title = document.createElement('h3');
    title.innerHTML = 'Reviews';
    container.appendChild(title);

    if (!reviews) {
        const noReviews = document.createElement('p');
        noReviews.innerHTML = 'No reviews yet!';
        container.appendChild(noReviews);
        return;
    }
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
        ul.appendChild(createReviewHTML(review));
    });
    container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
let createReviewHTML = (review) => {
    const li = document.createElement('li');
    const name = document.createElement('p');
    name.innerHTML = review.name;
    li.appendChild(name);

    const date = document.createElement('p');
    date.innerHTML = new Date(review.createdAt).toDateString();
    li.appendChild(date);

    const rating = document.createElement('p');
    rating.innerHTML = `Rating: ${review.rating}`;
    li.appendChild(rating);

    const comments = document.createElement('p');
    comments.innerHTML = review.comments;
    li.appendChild(comments);

    return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
let fillBreadcrumb = (restaurant = self.restaurant) => {
    const breadcrumb = document.getElementById('breadcrumb');
    const li = document.createElement('li');
    li.setAttribute('aria-current', 'page');
    li.innerHTML = restaurant.name;
    breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
let getParameterByName = (name, url) => {
    if (!url)
        url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let colorIsFavoriteHeart = (favorite = self.restaurant.is_favorite) => {
    const heart = document.getElementById('favorite-button');

    if (favorite) {
        heart.classList.add("is-favorite");
    }

    if (!favorite) {
        heart.classList.remove("is-favorite");
        heart.classList.add("not-favorite");
    }
}
