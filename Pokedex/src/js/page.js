import queryString from "query-string";

console.log("This is the page.html js file");

const query = queryString.parse(window.location.search);

const dynamicContainer = document.querySelector("#param-container");

if (!query.param) {
  dynamicContainer.innerHTML = "No parameter has been passed to this page :(";
} else {
  dynamicContainer.innerHTML = `The parameter passed to this page is ${query.param}`;
}
