import idb from "idb";

const objectStoreName = 'restaurants';
const databaseName = 'restaurant-store';

const dbPromise = idb.open(databaseName, 1, upgradeDB => {
    upgradeDB.createObjectStore(objectStoreName);
});

const idbhelper = {
    get(key) {
        return dbPromise.then(db => {
            return db.transaction(objectStoreName)
                .objectStore(objectStoreName).get(key);
        });
    },
    set(key, val) {
        return dbPromise.then(db => {
            const tx = db.transaction(objectStoreName, 'readwrite');
            tx.objectStore(objectStoreName).put(val, key);
            return tx.complete;
        });
    },
    delete(key) {
        return dbPromise.then(db => {
            const tx = db.transaction(objectStoreName, 'readwrite');
            tx.objectStore(objectStoreName).delete(key);
            return tx.complete;
        });
    },
};

export default idbhelper;