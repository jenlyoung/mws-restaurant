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
    constructor() {
        this.online = true;
    }

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get BASE_URL() {
        const port = 1337; // Change this to your server port
        return `http://localhost:${port}`;
    }

    //c
    static get isOnline() {
        return this.online || window.navigator.onLine;
    }

    /**
     * Fetch all restaurants.
     */
    static fetchRestaurants() {

        return idbhelper.get('restaurants').then(value => {
            //if in the cache, it gets used
            if (value) {
                const restaurants = value;
                return restaurants;
            }
            else {
                let restaurantsUrl = `${DBHelper.BASE_URL}/restaurants/`;

                return fetch(restaurantsUrl, {
                    method: 'GET'
                }).then((response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                })).then(json => {
                    idbhelper.set('restaurants', json);
                    return json;
                }).catch(e => {
                    return 'Error getting reviews';
                    //TODO: Research catch
                });
            }
        });
    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id) {
        //http://localhost:1337/restaurants/3
        return this.fetchRestaurants()
            .then(restaurants => {
                return restaurants.find(value => value.id == id);
            });
    }


    /**
     * Fetch a reviews by its ID.
     */
    // http://localhost:1337/reviews/?restaurant_id=<restaurant_id>

    static fetchReviewsByRestaurantId(id) {
        let reviewByRestaurantIdUrl = `${DBHelper.BASE_URL}/reviews?restaurant_id=${id}`;

        return idbhelper.get(`restaurants-reviews:${id}`).then(value => {
            //if in the cache, it gets used
            if (value) {
                const reviews = value;
                return reviews;
            }
            else {

                return fetch(reviewByRestaurantIdUrl, {
                    method: 'GET'
                }).then((response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                })).then(json => {
                    return json;
                }).then(json => {
                    idbhelper.set(`restaurants-reviews:${id}`, json);
                    return json;
                }).catch(e => {
                    return 'Error getting reviews';
                    //TODO: Research catch
                });
            }
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
    /*static fetchRestaurantByCuisine(cuisine, callback) {
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
    }*/

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */

    /*static fetchRestaurantByNeighborhood(neighborhood, callback) {
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
    }*/

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
        // Fetch all restaurants
        return DBHelper.fetchRestaurants().then(restaurants => {
            let results = restaurants;

            if (cuisine != 'all') { // filter by cuisine
                results = results.filter(r => r.cuisine_type == cuisine);
            }
            if (neighborhood != 'all') { // filter by neighborhood
                results = results.filter(r => r.neighborhood == neighborhood);
            }
            return results;
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods() {
        // Fetch all restaurants by neighborhood
        return DBHelper.fetchRestaurants().then(restaurants => {
            // Get all neighborhoods from all restaurants
            const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
            // Remove duplicates from neighborhoods
            const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)

            return uniqueNeighborhoods;
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines() {
        // Fetch all restaurants
        return DBHelper.fetchRestaurants().then(restaurants => {
            // Get all cuisines from all restaurants
            const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
            // Remove duplicates from cuisines
            const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)

            return uniqueCuisines;
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
        if (DBHelper.isOnline) {
            return fetch(url, {
                method: 'POST',
                body: JSON.stringify(reviewData)
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    idbhelper.delete(`restaurants-reviews:${reviewData.id}`)
                })
                .catch((err) => console.log(err));
        }
        else {
            return idbhelper.get('offline-review').then(value => {
                let all = value || [];
                all.push({
                    review: reviewData
                });
                return idbhelper.set('offline-review', all);
            })
        }
    }

    static toggleIsFavoriteStatus(id, isFavorite) {
        let url = `${DBHelper.BASE_URL}/restaurants/${id}/?is_favorite=${isFavorite}`;
        if (DBHelper.isOnline) {
            return fetch(url, {
                method: 'PUT',
            }).then(response => {
                return response.status === 200;
            }).catch(e => {
                return false;
            });
        }
        else {
            return idbhelper.get('offline-favorite').then(value => {
                let all = value || [];
                all.push({
                    restaurantId: id,
                    isFavorite: isFavorite
                });
                return idbhelper.set('offline-favorite', all);
            })
        }
    }

    static syncOfflineData() {
        idbhelper.get('offline-favorite').then(async items => {
            const allItems = items || [];

            console.log(`Syncing favorite items: ${allItems.length}`);
            for (let item of allItems) {
                await DBHelper.toggleIsFavoriteStatus(item.restaurantId, item.isFavorite);
            }
            return idbhelper.set('offline-favorite', []);
        });

        idbhelper.get('offline-review').then(async items => {
            const allItems = items || [];

            console.log(`Syncing review items: ${allItems.length}`);

            for (let item of allItems) {
                await DBHelper.addReviewForRestaurant(item.review);
            }
            return idbhelper.set('offline-review', []);
        });
    }

    static setOffline() {
        console.log("offline");
        DBHelper.online = false;
    }

    static setOnline() {
        console.log("online");
        DBHelper.online = true;

        DBHelper.syncOfflineData();
    }


}


//new comment


export default DBHelper;

