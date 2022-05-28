let allCatsTab = document.querySelector("#js-all-cats");
let favCatsTab = document.querySelector("#js-fav-cats");
let catsContainer = document.querySelector(".cats__inner");

function pasteCats(cats) {
    let catCard = document.querySelector(".cats__cat"); catCard.style.display = "flex";
    catCard.querySelector(".cat__thumb").setAttribute("src", cats[0].url);
    for (let cat of cats.slice(1, cats.length)) {
        let newCatCard = catCard.cloneNode(true);
        let newCatCardThumb = newCatCard.querySelector(".cat__thumb"); newCatCardThumb.setAttribute("src", cat.url);
        catsContainer.appendChild(newCatCard);
    }
}


window.onload = async function () {
    let loader = document.querySelector(".loader"); loader.classList.toggle("fullscreen"); loader.classList.toggle("--visible");
    try {
        response = await fetch("https://api.thecatapi.com/v1/images/search?limit=10", {
            headers: {
                "X-Api-Key": "9593619c-76b9-4c89-97e0-3ccc38e21f0b"
            }
        });
        data = await response.json();
        pasteCats(data);
        loader.classList.toggle("--visible");
    } catch (error) {
        console.log(error);
    }

}