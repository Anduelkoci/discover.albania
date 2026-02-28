document.addEventListener("DOMContentLoaded", () => {

  const PASSWORD = "admin123";

  const isLogged = localStorage.getItem("adminLogged");

  if (isLogged !== "true") {

    const pass = prompt("Enter admin password:");

    if (pass === PASSWORD) {
      localStorage.setItem("adminLogged", "true");
      alert("Login successful");
    } else {
      alert("Access denied");
      window.location.href = "index.html";
    }

  }

});
function getCities(){
  return JSON.parse(localStorage.getItem("cities")) || [];
}

function saveCities(cities){
  localStorage.setItem("cities", JSON.stringify(cities));
}

function addCity(){

  const name = document.getElementById("cityName").value;
  const image = document.getElementById("cityImage").value;
  const desc = document.getElementById("cityDesc").value;

  if(!name || !image) return alert("Fill fields");

  const cities = getCities();

  cities.push({
    name,
    image,
    description: desc
  });

  saveCities(cities);
  renderCities();
}

function deleteCity(index){
  const cities = getCities();
  cities.splice(index,1);
  saveCities(cities);
  renderCities();
}

function renderCities(){

  const list = document.getElementById("cityList");
  list.innerHTML="";

  getCities().forEach((city,i)=>{

    list.innerHTML += `
      <div class="city-item">
        <span>${city.name}</span>
        <button onclick="deleteCity(${i})">Delete</button>
      </div>
    `;
  });
}

renderCities();


