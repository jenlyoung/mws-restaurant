!function(n){function r(r){for(var t,o,s=r[0],l=r[1],d=r[2],p=0,u=[];p<s.length;p++)o=s[p],a[o]&&u.push(a[o][0]),a[o]=0;for(t in l)Object.prototype.hasOwnProperty.call(l,t)&&(n[t]=l[t]);for(c&&c(r);u.length;)u.shift()();return i.push.apply(i,d||[]),e()}function e(){for(var n,r=0;r<i.length;r++){for(var e=i[r],t=!0,s=1;s<e.length;s++){var l=e[s];0!==a[l]&&(t=!1)}t&&(i.splice(r--,1),n=o(o.s=e[0]))}return n}var t={},a={2:0},i=[];function o(r){if(t[r])return t[r].exports;var e=t[r]={i:r,l:!1,exports:{}};return n[r].call(e.exports,e,e.exports,o),e.l=!0,e.exports}o.m=n,o.c=t,o.d=function(n,r,e){o.o(n,r)||Object.defineProperty(n,r,{enumerable:!0,get:e})},o.r=function(n){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(n,"__esModule",{value:!0})},o.t=function(n,r){if(1&r&&(n=o(n)),8&r)return n;if(4&r&&"object"==typeof n&&n&&n.__esModule)return n;var e=Object.create(null);if(o.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:n}),2&r&&"string"!=typeof n)for(var t in n)o.d(e,t,function(r){return n[r]}.bind(null,t));return e},o.n=function(n){var r=n&&n.__esModule?function(){return n.default}:function(){return n};return o.d(r,"a",r),r},o.o=function(n,r){return Object.prototype.hasOwnProperty.call(n,r)},o.p="";var s=window.webpackJsonp=window.webpackJsonp||[],l=s.push.bind(s);s.push=r,s=s.slice();for(var d=0;d<s.length;d++)r(s[d]);var c=l;i.push([17,0]),e()}({1:function(n,r,e){"use strict";var t=e(0),a=e(2),i=e.n(a),o=e(5),s=e.n(o),l=e(6);const d=e.n(l).a.open("restaurant-store",1,n=>{n.createObjectStore("restaurants")});var c={get:n=>d.then(r=>r.transaction("restaurants").objectStore("restaurants").get(n)),set:(n,r)=>d.then(e=>{const t=e.transaction("restaurants","readwrite");return t.objectStore("restaurants").put(r,n),t.complete})};let p=t.icon({iconUrl:i.a,shadowUrl:s.a});t.Marker.prototype.options.icon=p;class u{static get DATABASE_URL(){return"http://localhost:1337/restaurants"}static fetchRestaurants(n){c.get("restaurants").then(r=>{if(r){n(null,r)}else{let r=new XMLHttpRequest;r.open("GET",u.DATABASE_URL),r.onload=(()=>{if(200===r.status){const e=JSON.parse(r.responseText);c.set("restaurants",e),n(null,e)}else{const e=`Request failed. Returned status of ${r.status}`;n(e,null)}}),r.send()}})}static fetchRestaurantById(n,r){u.fetchRestaurants((e,t)=>{if(e)r(e,null);else{const e=t.find(r=>r.id==n);e?r(null,e):r("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(n,r){u.fetchRestaurants((e,t)=>{if(e)r(e,null);else{const e=t.filter(r=>r.cuisine_type==n);r(null,e)}})}static fetchRestaurantByNeighborhood(n,r){u.fetchRestaurants((e,t)=>{if(e)r(e,null);else{const e=t.filter(r=>r.neighborhood==n);r(null,e)}})}static fetchRestaurantByCuisineAndNeighborhood(n,r,e){u.fetchRestaurants((t,a)=>{if(t)e(t,null);else{let t=a;"all"!=n&&(t=t.filter(r=>r.cuisine_type==n)),"all"!=r&&(t=t.filter(n=>n.neighborhood==r)),e(null,t)}})}static fetchNeighborhoods(n){u.fetchRestaurants((r,e)=>{if(r)n(r,null);else{const r=e.map((n,r)=>e[r].neighborhood),t=r.filter((n,e)=>r.indexOf(n)==e);n(null,t)}})}static fetchCuisines(n){u.fetchRestaurants((r,e)=>{if(r)n(r,null);else{const r=e.map((n,r)=>e[r].cuisine_type),t=r.filter((n,e)=>r.indexOf(n)==e);n(null,t)}})}static urlForRestaurant(n){return`./restaurant.html?id=${n.id}`}static imageThumnailUrlForRestaurant(n){return`/images/${n.id}-300_tn.jpg`}static imageUrlForRestaurant(n){return`/images/${n.id}-300_tn.jpg 500w, /images/${n.id}-600_med_1x.jpg 700w,/images/${n.id}-800_lg_1x.jpg 1000w`}static mapMarkerForRestaurant(n,r){const e=new t.marker([n.latlng.lat,n.latlng.lng],{title:n.name,alt:n.name,url:u.urlForRestaurant(n)});return e.addTo(r),e}}r.a=u},17:function(n,r,e){"use strict";e.r(r);var t=e(0),a=(e(7),e(1));e(9),e(10);document.addEventListener("DOMContentLoaded",n=>{i()});let i=()=>{o((n,r)=>{n?console.error(n):(self.newMap=t.map("map",{center:[r.latlng.lat,r.latlng.lng],zoom:16,scrollWheelZoom:!1}),t.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}",{mapboxToken:"pk.eyJ1IjoiamVubHlvdW5nIiwiYSI6ImNqaWtjcXIxbDFxZ3QzanQxeHBlZDFlNnAifQ.y4x3BELwSLRnpiWlq0ljFQ",maxZoom:18,attribution:'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',id:"mapbox.streets"}).addTo(self.newMap),p(),a.a.mapMarkerForRestaurant(self.restaurant,self.newMap))})},o=n=>{if(self.restaurant)return void n(null,self.restaurant);const r=u("id");if(r)a.a.fetchRestaurantById(r,(r,e)=>{self.restaurant=e,e?(s(),n(null,e)):console.error(r)});else{n("No restaurant id in URL",null)}},s=(n=self.restaurant)=>{document.getElementById("restaurant-name").innerHTML=n.name,document.getElementById("restaurant-address").innerHTML=n.address;const r=document.getElementById("restaurant-img");r.className="restaurant-img",r.srcset=a.a.imageUrlForRestaurant(n),r.alt=`Image from the restaurant ${n.name}`,document.getElementById("restaurant-cuisine").innerHTML=n.cuisine_type,n.operating_hours&&l(),d()},l=(n=self.restaurant.operating_hours)=>{const r=document.getElementById("restaurant-hours");for(let e in n){const t=document.createElement("tr"),a=document.createElement("td");a.innerHTML=e,t.appendChild(a);const i=document.createElement("td");i.innerHTML=n[e],t.appendChild(i),r.appendChild(t)}},d=(n=self.restaurant.reviews)=>{const r=document.getElementById("reviews-container"),e=document.createElement("h3");if(e.innerHTML="Reviews",r.appendChild(e),!n){const n=document.createElement("p");return n.innerHTML="No reviews yet!",void r.appendChild(n)}const t=document.getElementById("reviews-list");n.forEach(n=>{t.appendChild(c(n))}),r.appendChild(t)},c=n=>{const r=document.createElement("li"),e=document.createElement("p");e.innerHTML=n.name,r.appendChild(e);const t=document.createElement("p");t.innerHTML=n.date,r.appendChild(t);const a=document.createElement("p");a.innerHTML=`Rating: ${n.rating}`,r.appendChild(a);const i=document.createElement("p");return i.innerHTML=n.comments,r.appendChild(i),r},p=(n=self.restaurant)=>{const r=document.getElementById("breadcrumb"),e=document.createElement("li");e.setAttribute("aria-current","page"),e.innerHTML=n.name,r.appendChild(e)},u=(n,r)=>{r||(r=window.location.href),n=n.replace(/[\[\]]/g,"\\$&");const e=new RegExp(`[?&]${n}(=([^&#]*)|&|#|$)`).exec(r);return e?e[2]?decodeURIComponent(e[2].replace(/\+/g," ")):"":null}},7:function(n,r,e){var t=e(8);"string"==typeof t&&(t=[[n.i,t,""]]);var a={hmr:!0,transform:void 0,insertInto:void 0};e(4)(t,a);t.locals&&(n.exports=t.locals)},8:function(n,r,e){(n.exports=e(3)(!1)).push([n.i,'@charset "utf-8";\r\n/* CSS Document */\r\n\r\n/*ensures that site will be responsive*/\r\nimg, embed,\r\nobject, video {\r\n    max-width: 100%;\r\n}\r\n\r\nbody, td, th, p {\r\n    font-family: Arial, Helvetica, sans-serif;\r\n    font-size: 10pt;\r\n    color: #333;\r\n    line-height: 1.5;\r\n}\r\n\r\nbody {\r\n    background-color: #fdfdfd;\r\n    margin: 0;\r\n    position: relative;\r\n    max-width: 1275px;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n}\r\n\r\nul, li {\r\n    font-family: Arial, Helvetica, sans-serif;\r\n    font-size: 10pt;\r\n    color: #333;\r\n}\r\n\r\na {\r\n    color: #c47a00;\r\n    text-decoration: none;\r\n}\r\n\r\na:hover, a:focus {\r\n    color: #3397db;\r\n    text-decoration: underline;\r\n}\r\n\r\na img {\r\n    border: none 0px #fff;\r\n}\r\n\r\nh1, h2, h3, h4, h5, h6 {\r\n    font-family: Arial, Helvetica, sans-serif;\r\n    margin: 0 0 20px;\r\n}\r\n\r\narticle, aside, canvas, details, figcaption, figure, footer, header, hgroup, menu, nav, section {\r\n    display: block;\r\n}\r\n\r\n#maincontent {\r\n    background-color: #f3f3f3;\r\n    min-height: 100%;\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n\r\n#footer {\r\n    background-color: #444;\r\n    color: #aaa;\r\n    font-size: 8pt;\r\n    letter-spacing: 1px;\r\n    padding: 25px;\r\n    text-align: center;\r\n    text-transform: uppercase;\r\n}\r\n\r\n/* ====================== Skip Link ====================== */\r\n\r\n.skip-link {\r\n    position: absolute;\r\n    top: -40px;\r\n    left: 0;\r\n    background: #c47a00;\r\n    color: white;\r\n    padding: 8px;\r\n    z-index: 100;\r\n}\r\n\r\n.skip-link:focus {\r\n    top: 0;\r\n    color: white;\r\n}\r\n\r\n/* ====================== Navigation ====================== */\r\nnav {\r\n    width: 100%;\r\n    height: auto;\r\n    background-color: #252831;\r\n    text-align: center;\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n\r\nnav h1 {\r\n    width: 100%;\r\n    margin: 15px;\r\n}\r\n\r\nnav h1 a {\r\n    color: #fff;\r\n    font-size: 20px;\r\n    font-weight: 200;\r\n    letter-spacing: 5px;\r\n    text-transform: uppercase;\r\n}\r\n\r\n#breadcrumb, .breadcrumb {\r\n    padding: 10px 0;\r\n    list-style: none;\r\n    background-color: #eee;\r\n    margin: 0;\r\n    max-width: 100%\r\n}\r\n\r\n/* Display list items side by side */\r\n#breadcrumb li {\r\n    display: inline;\r\n    font-size: 17px;\r\n    padding: 13px 0 13px 10px;\r\n}\r\n\r\n/* Add a slash symbol (/) before/behind each list item */\r\n#breadcrumb li + li:before {\r\n    padding: 5px;\r\n    color: black;\r\n    content: "/\\A0";\r\n}\r\n\r\n/* Add a color to all links inside the list */\r\n#breadcrumb li a {\r\n    color: #0275d8;\r\n    text-decoration: none;\r\n    padding: 10px;\r\n}\r\n\r\n/* Add a color on mouse-over */\r\n#breadcrumb li a:hover {\r\n    color: #01447e;\r\n    text-decoration: underline;\r\n}\r\n\r\n/* ====================== Map ====================== */\r\n#map {\r\n    height: 400px;\r\n    width: 100%;\r\n    background-color: #ccc;\r\n}\r\n\r\n/* ====================== Restaurant Filtering ====================== */\r\n.filter-header {\r\n    display: none;\r\n}\r\n\r\n.filter-options {\r\n    width: 100%;\r\n    height: auto;\r\n    background-color: #3397DB;\r\n    display: flex;\r\n    flex-flow: row wrap;\r\n    padding: 10px 0;\r\n    align-items: center;\r\n    justify-content: flex-start;\r\n}\r\n\r\n.filter-options label {\r\n    color: white;\r\n    font-size: 18px;\r\n    font-weight: bold;\r\n    line-height: 1.5em;\r\n    margin: 0 20px;\r\n    text-transform: uppercase;\r\n}\r\n\r\n.filter-options select {\r\n    background-color: white;\r\n    border: 1px solid #fff;\r\n    font-family: Arial, sans-serif;\r\n    font-size: 16pt;\r\n    height: 35px;\r\n    letter-spacing: 0;\r\n    margin: 10px;\r\n    padding: 0 10px;\r\n    min-width: 48px;\r\n    min-height: 48px;\r\n}\r\n\r\n.filter-options select:focus {\r\n    text-decoration: underline;\r\n}\r\n\r\n/* ====================== Restaurant Listing ====================== */\r\n\r\n.restaurants {\r\n    display: none;\r\n}\r\n\r\n#restaurants-list {\r\n    background-color: #f3f3f3;\r\n    list-style: outside none none;\r\n    margin: 0;\r\n    padding: 30px 15px 60px;\r\n    text-align: center;\r\n    display: flex;\r\n    flex-flow: row wrap;\r\n    justify-content: center;\r\n}\r\n\r\n#restaurants-list li {\r\n    background-color: #fff;\r\n    border: 2px solid #ccc;\r\n    font-family: Arial, sans-serif;\r\n    margin: 5px;\r\n    min-height: 380px;\r\n    padding: 25px 30px;\r\n    text-align: left;\r\n    width: 100%;\r\n    min-width: 270px;\r\n    max-width: 350px;\r\n}\r\n\r\n#restaurants-list .restaurant-img {\r\n    background-color: #ccc;\r\n    display: block;\r\n    margin: 0;\r\n    max-width: 100%;\r\n    min-width: 100%;\r\n}\r\n\r\n#restaurants-list li h3 {\r\n    color: #c47a00;\r\n    font-family: Arial, sans-serif;\r\n    font-size: 14pt;\r\n    font-weight: 200;\r\n    letter-spacing: 0;\r\n    line-height: 1.3;\r\n    margin: 20px 0 5px;\r\n}\r\n\r\n#restaurants-list p {\r\n    margin: 0;\r\n    font-size: 11pt;\r\n}\r\n\r\n#restaurants-list li button {\r\n    background-color: #c47a00;\r\n    border-bottom: 3px solid #eee;\r\n    color: #fff;\r\n    display: inline-block;\r\n    font-size: 18px;\r\n    margin: 15px 0 0;\r\n    padding: 10px 30px;\r\n    text-align: center;\r\n    text-decoration: none;\r\n    text-transform: uppercase;\r\n    min-width: 25px;\r\n    min-height: 25px;\r\n}\r\n\r\n/* ====================== Restaurant Details ====================== */\r\n.inside #maincontent {\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n\r\n.inside header {\r\n    top: 0;\r\n    width: 100%;\r\n    justify-content: left;\r\n}\r\n\r\n.inside #restaurant-header {\r\n    display: flex;\r\n    flex-flow: row wrap;\r\n    width: 100%;\r\n}\r\n\r\n.inside #restaurant-name {\r\n    padding: 10px;\r\n    margin: 10px;\r\n    font-size: 20px;\r\n    font-weight:300;\r\n    letter-spacing: -1px;\r\n    width: 100%;\r\n}\r\n\r\n.inside #restaurant-img {\r\n    width: 100vmax;\r\n}\r\n\r\n.inside #map-container {\r\n    background: blue none repeat scroll 0 0;\r\n    height: 87%;\r\n    right: 0;\r\n    top: 80px;\r\n    width: 100%;\r\n}\r\n\r\n.inside #map {\r\n    height: 300px;\r\n    width: 100%;\r\n    background-color: #ccc;\r\n}\r\n\r\n#general-info {\r\n    display: none;\r\n}\r\n\r\n.inside #footer {\r\n    bottom: 0;\r\n    max-width: 100%;\r\n    text-align: center;\r\n}\r\n\r\n#restaurant-name {\r\n    color: #f18200;\r\n    font-family: Arial, sans-serif;\r\n    font-size: 20pt;\r\n    font-weight: 200;\r\n    letter-spacing: 0;\r\n    margin: 15px 0 30px;\r\n    text-transform: uppercase;\r\n    line-height: 1.1;\r\n}\r\n\r\n#restaurant-img {\r\n    width: 90%;\r\n}\r\n\r\n#restaurant-address {\r\n    font-size: 12pt;\r\n    margin: 10px 0px;\r\n    padding-left: 20px;\r\n    width: 100%;\r\n}\r\n\r\n#restaurant-cuisine {\r\n    background-color: #333;\r\n    color: #ddd;\r\n    font-size: 12pt;\r\n    font-weight: 300;\r\n    letter-spacing: 10px;\r\n    padding: 7px 0;\r\n    text-align: center;\r\n    text-transform: uppercase;\r\n    width: 100%;\r\n}\r\n/* ====================== Restaurant Reviews ====================== */\r\n\r\n#restaurant-container, #reviews-container {\r\n    border-bottom: 1px solid #d9d9d9;\r\n    border-top: 1px solid #fff;\r\n    width: 100%;\r\n    display: flex;\r\n    flex-flow: row wrap;\r\n}\r\n\r\n#reviews-container {\r\n    padding-left: 20px;\r\n    width: 100%;\r\n}\r\n\r\n#reviews-container h3 {\r\n    color: #f58500;\r\n    font-size: 20pt;\r\n    font-weight: 300;\r\n    letter-spacing: -1px;\r\n    padding: 10px 0 0 0;\r\n    width: 100%;\r\n}\r\n\r\n#reviews-list {\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n#reviews-list li {\r\n    background-color: #fff;\r\n    border: 2px solid #f3f3f3;\r\n    display: block;\r\n    list-style-type: none;\r\n    margin: 0 0 30px;\r\n    overflow: hidden;\r\n    padding: 5px 20px 5px;\r\n    position: relative;\r\n    width: 85%;\r\n}\r\n\r\n#reviews-list li p {\r\n    margin: 0 0 10px;\r\n}\r\n\r\n#restaurant-hours td {\r\n    color: #666;\r\n}\r\n\r\n#restaurant-hours {\r\n    width: 100%;\r\n    padding-left: 20px;\r\n    margin-bottom: 10px;\r\n}\r\n\r\n\r\n/* ====================== Media Queries ====================== */\r\n@media screen and (min-width: 0px) and (orientation: portrait) {\r\n    #restaurants-list li {\r\n        max-width: 100%;\r\n}\r\n\r\n/*media queries*/\r\n@media screen and (min-width: 801px) and (max-width: 1080px) {\r\n    #restaurants-list li {\r\n        max-width: 39%;\r\n        margin: 10px;\r\n        justify-content: space-around;\r\n    }\r\n}\r\n\r\n    nav h1 a {\r\n        font-size: 24px;\r\n    }\r\n\r\n    .inside #restaurant-name {\r\n        font-size: 24px;\r\n    }\r\n}\r\n\r\n\r\n@media screen and (min-width: 1081px) {\r\n    #restaurants-list li {\r\n        margin: 10px;\r\n        max-width: 272px;\r\n    }\r\n\r\n    nav h1 a {\r\n        font-size: 24px;\r\n    }\r\n\r\n    .inside #restaurant-name {\r\n        font-size: 24px;\r\n    }\r\n}',""])}});