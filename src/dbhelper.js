import * as L from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import idbhelper from "./idbhelper";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

/**
 * Common database helper functions.
 */
class DBHelper {

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get BASE_URL() {
        const port = 1337; // Change this to your server port
        return `http://localhost:${port}`;
    }

    /**
     * Fetch all restaurants.
     */
    static fetchRestaurants(callback) {
        //1st idbhelper checks cache

        idbhelper.get('restaurants').then(value => {
            //if in the cache, it gets used
            //TODO: BYPASSING CACHE
            value = null;
            if (value) {
                const restaurants = value;

                callback(null, restaurants);
                // if not in cache, makes an http request and serves and stores in cache
            } else {
                let xhr = new XMLHttpRequest();
                xhr.open('GET', `${DBHelper.BASE_URL}/restaurants`);
                xhr.onload = () => {
                    if (xhr.status === 200) { // Got a success response from server!
                        const json = JSON.parse(xhr.responseText);
                        idbhelper.set('restaurants', json);
                        callback(null, json);
                    } else { // Oops!. Got an error from server.
                        const error = (`Request failed. Returned status of ${xhr.status}`);
                        callback(error, null);
                    }
                };
                xhr.send();
            }
        })

    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id) {
        //http://localhost:1337/restaurants/3
        let restaurantByIdUrl = `${DBHelper.BASE_URL}/restaurants/${id}`;

        return fetch(restaurantByIdUrl, {
            method: 'GET'
        }).then((response => {
            if (response.status === 200) {
                return response.json();
            }
        })).then(json => {
            return json;
        }).catch(e => {
            return 'Error getting reviews';
            //TODO: Research catch
        });
    }


    /**
     * Fetch a reviews by its ID.
     */
    // http://localhost:1337/reviews/?restaurant_id=<restaurant_id>

    static fetchReviewsByRestaurantId(id) {
        let reviewByRestaurantIdUrl = `${DBHelper.BASE_URL}/reviews?restaurant_id=${id}`;

        return fetch(reviewByRestaurantIdUrl, {
            method: 'GET'
        }).then((response => {
            if (response.status === 200) {
                return response.json();
            }
        })).then(json => {
            return json;
        }).catch(e => {
            return 'Error getting reviews';
            //TODO: Research catch
        });
    }

    /**
     * Fetch restaurants by is favorite with proper error handling.
     */
    //http://localhost:1337/restaurants/?is_favorite=true

    static fetchRestaurantByIsFavorite(is_favorite) {
        let RestaurantsByIsFavoriteUrl = `${DBHelper.BASE_URL}/restaurants/?is_favorite=${is_favorite}`;

        return fetch(RestaurantsByIsFavoriteUrl, {
            method: 'GET'
        }).then((response => {
            if (response.status === 200) {
                return response.json();
            }
        })).then(json => {
            return json;
        }).catch(e => {
            return 'Error getting reviews';
            //TODO: Research catch
        });
    }


    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given cuisine type
                const results = restaurants.filter(r => r.cuisine_type == cuisine);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Filter restaurants to have only given neighborhood
                const results = restaurants.filter(r => r.neighborhood == neighborhood);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                let results = restaurants
                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                }
                callback(null, results);
            }
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
                callback(null, uniqueNeighborhoods);
            }
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            } else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
                callback(null, uniqueCuisines);
            }
        });
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    //This is a smaller image that will  be used for the first page
    static imageThumnailUrlForRestaurant(restaurant) {
        return (`/images/${restaurant.id}-600_med_1x.jpg`);
    }

    //This is a srcset that will be used for the second page that will make the images responsive
    static imageUrlForRestaurant(restaurant) {
        return (`/images/${restaurant.id}-600_med_1x.jpg 700w,/images/${restaurant.id}-800_lg_1x.jpg 2000w`);
    }

    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        // https://leafletjs.com/reference-1.3.0.html#marker
        const marker = new L.marker([restaurant.latlng.lat, restaurant.latlng.lng],
            {
                title: restaurant.name,
                alt: restaurant.name,
                url: DBHelper.urlForRestaurant(restaurant)
            })
        marker.addTo(map);
        return marker;
    }


    static addReviewForRestaurant(reviewData) {

        let url = `${DBHelper.BASE_URL}/reviews`;

        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(reviewData)
        }).then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
    }

    static toggleIsFavoriteStatus(id, isFavorite) {
        let url = `${DBHelper.BASE_URL}/restaurants/${id}/?is_favorite=${isFavorite}`;

        return fetch(url, {
            method: 'PUT',
        }).then(response=>{
            return response.status === 200;
        }).catch(e=>{
           return false;
        });
    }

}



//new comment


export default DBHelper;

