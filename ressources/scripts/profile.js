import {Factory} from'../scripts/Factory.js';
import { modalSetUp } from './modal.js';
import { lightboxClick } from './Lightbox.js';

const profile = document.querySelector("#profile");
const gallery = document.querySelector("#gallery");
const trier = document.querySelector("#image-filter");

const lightbox = document.querySelector("#lightbox");

//List of media
let mediaList = [];
let photographInfo;
let folderName;

//REFACTOR: MOVE LIGHTBOX, REMOVE SETTIMEOUT, MERGE FETCH
window.addEventListener("keydown", (event) => {
    if(event.key == "Escape"){
        lightbox.style.display = "none";
        let modal = document.querySelector(".modal");
        modal.style.display = "none";
    }
});


trier.addEventListener("change", (event) =>{
   filterMedia(event.target.value);
});


//FILTERING
function filterMedia(filter) {
    if(filter == "popularity"){mediaList.sort(compareLike);}
    if(filter == "date"){mediaList.sort(compareDate);}
    if(filter == "title"){mediaList.sort(compareTitle);}
    renderGallery();
}
function compareTitle(a, b) {

        if (a._title < b._title ){
            return -1;
          }
          if (a._title > b._title ){
            return 1;
          }
          return 0;  
}
function compareLike(a, b) {

    if (a._like > b._like ){
        return -1;
      }
      if (a._like < b._like ){
        return 1;
      }
      return 0;  
}
function compareDate(a, b) {

    if (a._date < b._date ){
        return -1;
      }
      if (a._date > b._date ){
        return 1;
      }
      return 0;  
}
//GALLERY RENDERING
function renderGallery(){

    let index = 0;
    for(let item  of document.querySelectorAll('.gallery__item')) {
        item.remove();
    }
    for(let media of mediaList){
        media.render(gallery, index, photographInfo.name.split(" "));
        index++;
    }
    setTimeout(lightboxClick(mediaList,folderName), 50);
    
}

function likeTotal() {
    let totalLikes = 0;
        for(let media of mediaList){
            totalLikes += media._like;
        }
        document.querySelector(".like-number").innerHTML = totalLikes;
};
//Like feature

function like() {
    let likeButtons = document.querySelectorAll(".like-button");
    for(let button of likeButtons) {
        button.addEventListener( "click", () => {            
            let media = button.closest(".gallery__item").querySelector(".gallery__item__element");
            mediaList[media.id].liked();
            media.closest(".gallery__item").querySelector(".item-likeCount").innerHTML = mediaList[media.id]._like;
            likeTotal();
    });
}
}

//DATA FETCHING
fetch("ressources/data/FishEyeData.json")
    .then(response => response.json())  //transforme la reponse en json
    .then(data => {
        photographInfo = data.photographers.find( element => element.id == window.location.search.substring(1));
        folderName = photographInfo.name.split(" ");
        let photographtags ="";
        for(let tag of photographInfo.tags){
        photographtags += `<a class="filter" href="https://gosugladesh.github.io/DaunasRomain_6_04032021/index.html#${tag}">#${tag}</a>`
        }
        profile.insertAdjacentHTML('afterbegin',
                            ` <div class="card--profile__desc">
                            <h1 class="card__title card__title--profile">${photographInfo.name}</h1>
                            <p class="card__location card__location--profile">${photographInfo.city},${photographInfo.country}</p>
                            <p class="card__bio">${photographInfo.tagline}</p>
                            <div class="card__tags" alt="Tag">${photographtags}</div>
                            </div>            
                            <button class="button--contact" alt="Contact Me">Contactez-moi</button>
                            <img src="ressources/images/Photographers ID Photos/${photographInfo.portrait}" alt="${photographInfo.name}" class="card__image card__image--profile"/>
                            ` );
        modalSetUp();
        document.querySelector(".sticky__tarif").innerHTML = `${photographInfo.price}€ / jours`;
        for (let media of data.media){
            if( media.photographerId == window.location.search.substring(1) ){
                mediaList.push(Factory.createMedia(media));
            }
        }
        renderGallery();
        likeTotal()
        like();
    })
    