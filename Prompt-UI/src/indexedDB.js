// components/indexedDB.js

// function to initialise the indexeddb database
export function initIndexedDB() {
    const request = indexedDB.open("MyDatabase", 1);
  
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
  
      // create object store only if it does not exist..
      if (!db.objectStoreNames.contains("prompts")) {
        const objectStore = db.createObjectStore("prompts", { keyPath: "id" });
        objectStore.createIndex("promptsIndex", "prompts", { unique: false }); // create index for prompts
      }
    };
  
    request.onsuccess = () => {
      console.log("database initialised successfully");
    };
  
    request.onerror = (event) => {
      console.error("database error: ", event.target.error);
    };
}
  
// function to save data in the indexeddb
export function saveData(id, { prompts, allResponses, savedResponses, intent }) {
    const request = indexedDB.open("MyDatabase", 1);
  
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["prompts"], "readwrite"); // start a readwrite transaction
      const objectStore = transaction.objectStore("prompts");
  
      const data = {
        id: id,
        prompts: prompts,
        allResponses: allResponses,
        savedResponses: savedResponses,
        intent: intent  // save the intent..
      };
  
      const saveRequest = objectStore.put(data); // use put to save or update the data
  
      saveRequest.onsuccess = () => {
        console.log("data saved successfully");
      };
  
      saveRequest.onerror = (event) => {
        console.error("error saving data: ", event.target.error);
      };
    };
  
    request.onerror = (event) => {
      console.error("database error: ", event.target.error);
    };
}
  
// function to retrieve all saved prompts from the database
export const getSavedPrompts = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MyDatabase", 1);
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(["prompts"], "readonly"); // start a readonly transaction
        const objectStore = transaction.objectStore("prompts");
        const allPromptsRequest = objectStore.getAll(); // get all prompts from the object store
  
        allPromptsRequest.onsuccess = () => {
          const prompts = allPromptsRequest.result.map(prompt => ({
            id: prompt.id,
            prompts: prompt.prompts,
            allResponses: prompt.allResponses,
            savedResponses: prompt.savedResponses,
            intent: prompt.intent // ensure intent is included..
          }));
          resolve(prompts); // return all prompts from the database
        };
  
        allPromptsRequest.onerror = (event) => {
          reject('error retrieving prompts: ' + event.target.error);
        };
      };
  
      request.onerror = (event) => {
        reject('database error: ' + event.target.error);
      };
    });
};
  
// function to retrieve a specific saved data entry by id
export function getSavedData(id) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("MyDatabase", 1);
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(["prompts"], "readonly");
        const objectStore = transaction.objectStore("prompts");
  
        const getRequest = objectStore.get(id); // get the data by id
  
        getRequest.onsuccess = (event) => {
          const result = event.target.result;
          if (result) {
            console.log("retrieved data: ", result);
            resolve(result); // resolve with the retrieved result
          } else {
            reject("no data found for id: " + id);
          }
        };
  
        getRequest.onerror = (event) => {
          console.error("error retrieving data: ", event.target.error);
          reject("error retrieving data: " + event.target.error);
        };
      };
  
      request.onerror = (event) => {
        console.error("database error: ", event.target.error);
        reject("database error: " + event.target.error);
      };
    });
}
