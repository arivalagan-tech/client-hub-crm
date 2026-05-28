// function saveForm(event) {
//   event.preventDefault(); // Prevents form from refreshing the page

//   // 1. Get values from input fields
//   const name = document.getElementById('name').value;
//   const tag = document.getElementById('tag').value;
//   const status = document.getElementById('Status').value;
//   const company = document.getElementById('company').value;
//   const email = document.getElementById('email').value;
//   const phone = document.getElementById('phone').value;
//   const language = document.getElementById('Language').value;
//   const notes = document.getElementById('notes').value;

//   console.log(`name:${name}, tag:${tag}, Status:${status}, company:${company}, Email:${email}, phone No:${phone}, Language:${language}, notes:${notes}.`);

//   // 2. Create an object to store
//   const clientData = {
//     name,tag,status,company,email,phone,language,notes
//   };

//   // 3. Convert object to JSON string and save to localStorage
//   localStorage.setItem('clientData', JSON.stringify(clientData));

//   // 4. Print in console for test the data like-debug
//   console.log(' Client Data Saved:', clientData);

//   const localStorageData =  JSON.parse(localStorage.getItem("clientData"))
//   console.log("local storage saved data:", localStorageData);

//   // Show alert
//   alert('Client details saved successfully.....!');
// }

// Local storage - Properties

console.log(localStorage);
console.log(localStorage.length);

// how to consuming the data using localStorage

localStorage.setItem("name", "john");
localStorage.setItem("age", 25);
localStorage.setItem("location", "chn");

const data = localStorage.getItem("name");
console.log("Local storage data:", data);

const data2 = localStorage.getItem("age");
console.log("Local storage data2:", data2);

// // have array - localStorage it only supports text --- stringify it using json

const clientsList = [
  {
    id: 1,
    clientName: "john",
  },
  {
    id: 2,
    clientName: "musk",
  },
];

localStorage.setItem("clientsListData", JSON.stringify(clientsList));
console.log(
  "from local storage:",
  JSON.parse(localStorage.getItem("clientsListData")),
);

// if have using the same key it will overwrite --- so key it should be unique
localStorage.setItem("clientsList", "Siva");

// how to get from local storage --- key is not there it will give the Null result
console.log("My age is ", localStorage.getItem("age"));

// how to convert the text into object
console.log("My clients name is ", localStorage.getItem("clientsList"));

console.log(
  "My ELITE clients including",
  JSON.parse(localStorage.getItem("clientsList")),
);

// 3.how to remove from localStorage  -  remove all localStorage data
localStorage.removeItem("name");
localStorage.clear();

console.log(localStorage.key(1));
