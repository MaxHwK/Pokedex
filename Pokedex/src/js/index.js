const Pokedex = require("pokeapi-js-wrapper");
const P = new Pokedex.Pokedex();
const listP = document.getElementById('list_poke');
const imgP = document.getElementById("img_poke");
const nomP = document.getElementById("nom_poke");
const favP = document.getElementById("fav_poke");
const triP = document.getElementById("select_tri");
const filterText = document.getElementById('filter');
const ListAbilitie = document.getElementById('stat_abilitie');
const listFavP = document.getElementById("fav_list_poke");
const modal = document.getElementById("modalAbil");
const typeAbil = document.getElementById("typeAbil");
const categAbil = document.getElementById("categAbil");
const powerAbil = document.getElementById("powerAbil");
const accuAbil = document.getElementById("accuAbil");
const ppAbil = document.getElementById("ppAbil");
const descAbil = document.getElementById("descAbil");
const span = document.getElementsByClassName("close")[0];

favP.addEventListener("change", ()=> addFav(favP));
triP.addEventListener("change", ()=> triPoke(triP));
filterText.addEventListener("keyup", filterPoke);
span.addEventListener("click", function(){
  modal.style.display = "none";
})
window.addEventListener("click", function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
})
window.onload = addFav(favP);

P.getPokedexByName("kanto")
  .then(function(response) {
      getDataPoke(response.pokemon_entries[0].pokemon_species.name);
      nomP.innerHTML = "#1 - " + response.pokemon_entries[0].pokemon_species.name;

      for(let i = 0; i < 151; i++){
        let li = document.createElement('li');
        let litext = document.createTextNode((i+1) + " - " + response.pokemon_entries[i].pokemon_species.name);
        li.appendChild(litext);
        li.setAttribute("value", i+1)
        li.addEventListener('click', ()=> selectPoke(li.innerText));
        listP.appendChild(li);
      }
})

function getDataPoke(name){
    P.getPokemonByName(name)
        .then(function(response) {

            // Description //
            let countT = 0;
            let countA = 0;
            let descP = document.getElementById("desc_poke");
            descP.innerHTML = '';
            let fieldDescrpPoke = [];
            let textType = '<span class="pGras">Type : </span>';
            let abilities = '<span class="pGras">Abilities : </span>';
            let height = '<span class="pGras">Height : </span>' + (response.height/10) + " m";
            let weight = '<span class="pGras">Weight : </span>' + (response.weight/10) + " kg";
            imgP.src = response.sprites.front_default;

            for(let type of response.types){
                countT++;
                if(countT  === 1){
                  textType += type.type.name;
                }
                else {
                  textType += " / " + type.type.name;
                }
            }
            for(let ability of response.abilities){
              countA++;
              if(countA === 1){
                abilities += ability.ability.name;
              }
              else {
                abilities += ' / ' + ability.ability.name;
              }
            }
            fieldDescrpPoke.push(textType);
            fieldDescrpPoke.push(abilities);
            fieldDescrpPoke.push(height);
            fieldDescrpPoke.push(weight);

            for (let filed of fieldDescrpPoke) {
                let li = document.createElement('li');
                li.innerHTML = filed;
                descP.appendChild(li);
            }

            // Stats //
            let statsP = document.getElementById("stats_poke");
            statsP.innerHTML = '';

            for (let stat of response.stats) {
                let li = document.createElement('li');
                li.innerHTML = stat.stat.name + " : " + stat.base_stat + ' <div class="compet-barre"> <div class="compet-barre-niv" style="width:' + stat.base_stat + 'px;"></div></div>';
                statsP.appendChild(li);
            }

            // Moves //
            const moveP = document.getElementById("move_poke");
            moveP.innerHTML = '';

            for (let move of response.moves) {
                let li = document.createElement('li');
                li.innerHTML = move.move.name;
                li.setAttribute("class", "abilitie")
                moveP.appendChild(li);
            }
            addLinkA()

        });
}

function selectPoke(pokemon) {
    if (localStorage.getItem(pokemon.split(' ')[2])) {
        favP.checked = true;
    } else {
        favP.checked = false;
    }

    P.getPokemonSpeciesByName(pokemon.split(' ')[2])
        .then(function(response) {

            if (response.is_legendary == true) {
                nomP.innerHTML = "#" + pokemon + ' <i class="fa fa-star-half-alt" style="color: orange;"></i>';
            } else if (response.is_mythical == true) {
                nomP.innerHTML = "#" + pokemon + ' <i class="fa fa-star-half-alt" style="color: purple;"></i>';
            } else {
                nomP.innerHTML = "#" + pokemon;
            }

            let pokeName = pokemon.split(' ');
            getDataPoke(pokeName[2]);
        });
}

function addFav(check) {
    if (check.checked === true) {
        let favPoke = nomP.innerText;
        let id = favPoke.split(' ')[0].slice(1);
        let namePoke = favPoke.split(' ')[2];
        localStorage.setItem(namePoke, id);
    } else {
        let favPoke = nomP.innerText;
        let namePoke = favPoke.split(' ')[2];
        localStorage.removeItem(namePoke);
    }
    listFavP.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.getItem(localStorage.key(i));
        let index = localStorage.key(i);
        if (key !== "INFO") {
            let li = document.createElement('li');
            let litext = document.createTextNode(key + " - " + index);
            li.appendChild(litext);
            li.setAttribute("value", key);
            li.addEventListener('click', () => selectPoke(li.innerText));
            listFavP.appendChild(li);
        }
    }
}

function triPoke(select) {
    if(select.value === "number"){
      let i, switching, b, shouldSwitch;
      switching = true;
      while (switching) {
        switching = false;
        b = listP.getElementsByTagName("li");
        for (i = 0; i < (b.length - 1); i++) {
          shouldSwitch = false;
          if (b[i].value > b[i + 1].value) {
            shouldSwitch = true;
            break;
          }
        }
        if (shouldSwitch) {
          b[i].parentNode.insertBefore(b[i + 1], b[i]);
          switching = true;
        }
      }
    } else if (select.value === "name_a-z") {
        let i, switching, b, shouldSwitch;
        switching = true;
        while (switching) {
            switching = false;
            b = listP.getElementsByTagName("li");
            for (i = 0; i < (b.length - 1); i++) {
                shouldSwitch = false;
                if (b[i].innerHTML.split(' ')[2] > b[i + 1].innerHTML.split(' ')[2]) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
              b[i].parentNode.insertBefore(b[i + 1], b[i]);
              switching = true;
          }
        }
    } else {
        let i, switching, b, shouldSwitch;
        switching = true;
        while (switching) {
            switching = false;
            b = listP.getElementsByTagName("li");
            for (i = 0; i < (b.length - 1); i++) {
                shouldSwitch = false;
                if (b[i].innerHTML.split(' ')[2] < b[i + 1].innerHTML.split(' ')[2]) {
                    shouldSwitch = true;
                    break;
                }
            }
            if (shouldSwitch) {
              b[i].parentNode.insertBefore(b[i + 1], b[i]);
              switching = true;
          }
          }
        }
}

function filterPoke() {
    let txtValue;
    let text = filterText.value.toUpperCase();
    let lis = document.querySelectorAll('#list_poke li');

    for (let i = 0; i < lis.length; i++) {
        txtValue = lis[i].textContent || lis[i].innerText;
        if (txtValue.toUpperCase().indexOf(text) > -1) {
            lis[i].style.display = "";
        } else {
            lis[i].style.display = "none";
        }
    }
}

function addLinkA() {
  let abilities = document.getElementsByClassName('abilitie');

  for(let abilitie of abilities){
    abilitie.addEventListener("click", ()=> addModal(abilitie));
  }
}

function addModal(abilitie){
  ListAbilitie.innerHTML = '<img src="static/CT.png" alt="CT/CS" width="20px"> ' + abilitie.innerText;
  P.getMoveByName(abilitie.innerText)
  .then(function(response) {
    typeAbil.innerHTML = '<span class="pGras">Type : </span>' + response.type.name;
    categAbil.innerHTML = '<span class="pGras">Damage class : </span>' + response.damage_class.name;
    powerAbil.innerHTML = '<span class="pGras">Power : </span>' + response.power;
    accuAbil.innerHTML = '<span class="pGras">Accuracy : </span>' + response.accuracy;
    ppAbil.innerHTML = '<span class="pGras">PP : </span>' + response.pp;
    descAbil.innerHTML = '<span class="pGras">Description : </span>' + response.flavor_text_entries[4].flavor_text;
  })
  modal.style.display = "block";
}
