let allCatsTab = document.querySelector("#js-all-cats");
let favCatsTab = document.querySelector("#js-fav-cats");
let catsContainer = document.querySelector(".cats__inner");
let loader = document.querySelector("#loader");
let isFirst = false;
let ableToScroll = true;
window.addEventListener("scroll", throttle(checkPosition, 250))
window.addEventListener("resize", throttle(checkPosition, 250))

function checkPosition() {
    if (ableToScroll) {
        const height = document.body.offsetHeight
        const screenHeight = window.innerHeight

        const scrolled = window.scrollY
        const threshold = height - screenHeight / 5
        const position = scrolled + screenHeight

        if (position >= threshold) {
            data = getCats();
            data.then((cats) => pasteCats(cats))


        }
    }

}

function throttle(callee, timeout) {
    let timer = null

    return function perform(...args) {
        if (timer) return

        timer = setTimeout(() => {
            callee(...args)

            clearTimeout(timer)
            timer = null
        }, timeout)
    }
};


function markUnactiveLike(e) {
    e.target.onmouseover = null;
    e.target.onmouseout = null;
    e.target.style.display = "flex";
}

function markActiveLike(e) {
    e.onmouseover = () => (e.setAttribute("src", "/img/like-active.svg"))
    e.onmouseout = () => (e.setAttribute("src", "./img/like.svg"))
    e.addEventListener("click", onLike);
}

function onLike(e) {
    localStorage.setItem(e.target.id, e.target.id);
    e.target.setAttribute("src", "./img/like-active.svg")
    e.target.dataset.liked = true;
    markUnactiveLike(e);
}


function onDislike(e) {
    localStorage.removeItem(e.target.id);
    catsContainer.removeChild(e.target.parentNode.parentNode);
    e.onmouseover = () => (e.setAttribute("src", "./img/like-active.svg"));
    e.onmouseout = () => (e.setAttribute("src", "./img/like.svg"));

}


function createCat(catData) {
    let cat = document.createElement("div"); cat.classList.add("cat"); cat.classList.add("cats__cat");
    let catInner = document.createElement("div"); catInner.classList.add("cat__inner");
    let catThumb = document.createElement("img"); catThumb.setAttribute("src", catData.url); catThumb.classList.add("cat__thumb")
    let catLikeButton = document.createElement("img"); catLikeButton.setAttribute("src", "./img/like.svg"); catLikeButton.classList.add("cat__like-button");
    catLikeButton.setAttribute("id", catData.url.split("/")[4]);
    markActiveLike(catLikeButton);

    catInner.appendChild(catThumb); catInner.appendChild(catLikeButton); cat.appendChild(catInner);
    return cat;

}




function showFavs() {
    for (let key in localStorage) {
        let catThumb = localStorage.getItem(key);
        if (catThumb) {
            let cat = createCat({ "url": "https://cdn2.thecatapi.com/images/" + catThumb });
            let catLikeButton = cat.querySelector(".cat__like-button");
            catLikeButton.onmouseout = null;
            catLikeButton.onmouseover = null;
            catLikeButton.setAttribute("src", "./img/like-active.svg");
            catLikeButton.style.display = "flex";
            catLikeButton.addEventListener("click", onDislike);
            catsContainer.prepend(cat);

        }

    }
}


function pasteCats(cats) {
    for (let cat of cats) {
        let catElement = createCat(cat);
        catsContainer.appendChild(catElement);
    }
}

async function getCats() {
    try {
        loader.style.display = "flex"; 
        response = await fetch("https://api.thecatapi.com/v1/images/search?limit=15", {
            headers: {
                "X-Api-Key": "9593619c-76b9-4c89-97e0-3ccc38e21f0b"
            }
        });
        data = await response.json();
        loader.style.display = "none"; 

        return data;
    } catch (error) {
        console.log(error);
    }

}


function TabsHandler(e) {
    if (e.target.id === "js-fav-cats") {
        ableToScroll = false;
        if (!isFirst) { contentCopy = catsContainer.innerHTML; isFirst = true }
        favCatsTab.classList.toggle("--selected");
        allCatsTab.classList.toggle("--selected");
        window.onscroll = null; window.onresize = null;
        catsContainer.innerHTML = "";
        showFavs();
    } else {
        ableToScroll = true;
        favCatsTab.classList.toggle("--selected");
        allCatsTab.classList.toggle("--selected");
        showAll();

    }



}


function showAll() {
    catsContainer.innerHTML = ""; 
    data = getCats();
    data.then((cats) => pasteCats(cats));
}



window.onload = showAll();
let tabs = document.querySelector(".header__list");
tabs.addEventListener("click", TabsHandler);


