let pageStart = "0"
let pageEnd = "10"
async function createHtml(start, end) {
    const dataResponse = await fetch("https://ddragon.leagueoflegends.com/cdn/12.21.1/data/en_US/champion.json");
    const data = await dataResponse.json();
    let champs = data.data;
    console.log(data.data);
    let card = '';
    Object.values(champs).slice(start, end).forEach(function(val) {
        let champImage = val.id;
        card = card + `
            <div class='card'>
                <div class="hoverContainer">
                    <img class="champLoadImg" id="champLoadImg" src="https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${champImage}_0.jpg">
                    <div class="info-popup">
                        <span class="info resource">Resource:${val.partype}</span>
                        <span class="info attack">Attack ${val.info.attack}</span>
                        <span class="info defense">Defense ${val.info.defense}</span>
                        <span class="info difficulty">Difficulty ${val.info.difficulty}</span>
                        <span class="info magic">Magic ${val.info.magic}</span>
                    </div>
                </div>
                <div class="cardSkinSelector">
                    <i id="changeSkinLeft" class="arrow left"></i>
                    <p class="cardSkinsText">Change Skins</p>
                    <i id="changeSkinRight" class="arrow right"></i>
                </div>
                <div class="cardTextContainer">
                    <h1 class="cardName">${val.name}</h1>
                    <p id="cardId" class="cardId">${val.id}</p>
                    <span id="theUnseenCounter">0</span>
                    <p class="cardTitle">${val.title}</p>
                </div>
            </div>
        `
    })
    let htmlContainer = document.querySelector('#cardContainer');
    htmlContainer.innerHTML = card
    const addArrowListeners = () => {
        let arrowRight = document.querySelectorAll('#changeSkinRight');
        let arrowLeft = document.querySelectorAll('#changeSkinLeft');
        let infoPopup = document.querySelectorAll('.info-popup');
        for (let i = 0; i < arrowLeft.length; i++) {
            // cardImage[i].addEventListener("mouseover", statsHandler);
            arrowLeft[i].addEventListener("click", leftArrowHandler);
            arrowRight[i].addEventListener("click", rightArrowHandler);
            infoPopup[i].addEventListener("mouseover", statsHandler);
    }}
    addArrowListeners();
}

createHtml(pageStart, pageEnd)

function nextPageBtnHandler() {
    if (pageEnd == "165") {
        return
    }
    pageStart = +pageStart + 10;
    pageEnd = +pageEnd + 10;
    createHtml(pageStart, pageEnd);
}
function lastPageBtnHandler() {
    if (pageStart == "0") {
        return
    }
    pageStart = +pageStart - 10;
    pageEnd = +pageEnd - 10;
    createHtml(pageStart, pageEnd);
}

async function leftArrowHandler() {
    let image = this.parentNode.parentNode.querySelector('img');
    let imageName = this.parentNode.parentNode.querySelector('#cardId').innerText;
    let imageCounter = this.parentNode.parentNode.querySelector('#theUnseenCounter');
    let imageCount = imageCounter.getAttribute('data-count');
    console.log(imageCount);
    if (imageCount < 1) {
        return
        // let productName = imageCounter.innerHTML;
    } else {
        imageCount = +imageCount - 1;
    }
    imageCounter.setAttribute('data-count', imageCount);
    imageCounter.innerHTML = imageCount;

    console.log('champName =', imageName);
    const imgResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/12.21.1/data/en_US/champion/${imageName}.json`);
    const imgData = await imgResponse.json();
    console.log(imgData);
    let cardImgData = imgData.data[imageName];
    let imageNumber = image.src.match(/\d+/g);
    let cardImgDataNumber = cardImgData.skins[`${imageCount}`].num;
    image = image.src = `${image.src}`.replace(`${imageNumber}`, `${cardImgDataNumber}`);
}

async function rightArrowHandler() {
    try {
        let image = this.parentNode.parentNode.querySelector('img');
        let imageName = this.parentNode.parentNode.querySelector('#cardId').innerText;
        let imageCounter = this.parentNode.parentNode.querySelector('#theUnseenCounter');
        let imageCount = imageCounter.getAttribute('data-count');
        if (imageCount == 0) {
            imageCount = 1;
            // let productName = imageCounter.innerHTML;
        } else {
            imageCount = +imageCount + 1;
        }
        imageCounter.setAttribute('data-count', imageCount);
        imageCounter.innerHTML = imageCount;
        const imgResponse = await fetch(`https://ddragon.leagueoflegends.com/cdn/12.21.1/data/en_US/champion/${imageName}.json`);
        const imgData = await imgResponse.json();
        let cardImgData = imgData.data[imageName];
        let imageNumber = image.src.match(/\d+/g);
        let cardImgDataNumber = cardImgData.skins[`${imageCount}`].num;
        image = image.src = `${image.src}`.replace(`${imageNumber}`, `${cardImgDataNumber}`);
    } catch (err) {
        if (err.name == "TypeError") {
            console.log('matadmeporfavor');
            let imageCounter = this.parentNode.parentNode.querySelector('#theUnseenCounter');
            let imageCount = imageCounter.getAttribute('data-count');
            if (imageCount == 0) {
                imageCount = 1;
                // let productName = imageCounter.innerHTML;
            } else {
                imageCount = +imageCount - 1;
            }
            imageCounter.setAttribute('data-count', imageCount);
            imageCounter.innerHTML = imageCount;
        }
    }
}

const addListeners = () => {
    let nextPageBtn = document.querySelector("#nextPageBtn");
    let lastPageBtn = document.querySelector("#lastPageBtn");
    nextPageBtn.addEventListener("click", nextPageBtnHandler);
    lastPageBtn.addEventListener("click", lastPageBtnHandler);
}
addListeners();

function statsHandler() {
    console.log('holi')
    let stats = this.querySelector('span').innerHTML
    console.log(stats)
}