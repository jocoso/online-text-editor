import { openDB } from 'idb';

let version = 1;

const initdb = async () =>
  // a lightweight wrapper that make easier to work with indexedDB
  // Opens connection to IndexedDB database with name and version
  openDB('jate', version, {
    // Called when the database is being created for the first time or when the version number is incremented.
    // Is where one define the database schema.
    // db is the database being upgraded.
    upgrade(db) {
      // the database exists
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists'); // Complain
        return;
      }
      // Creates a new object store named 'jate', 
      // each record will have a unique key stored in the id property
      // id will automatically increment with new records.
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => {
  
  const jateDB = await openDB('jate', 1);
  const tx = jateDB.transaction('jate', 'readwrite');
  const store = tx.objectStore('jate');
  const request = store.add({ jate: content });
  const result = await request;
  console.log('Data saved to the database', result);

}

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  const jateDB = await openDB('jate', 1);
  const tx = jateDB.transaction('jate', 'readonly');
  const store = tx.objectStore('jate');
  const request = store.getAll();
  const result = await request;

  return result;
}

initdb();
