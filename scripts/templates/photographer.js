/**
 * la fonction photographerTemplate prend un argument data et utilise 
 * la déstructuration pour extraire les propriétés name, portrait, city, country, tagline, price, et id de l'objet
 * @param {*} data 
 * @returns name, picture, getUserCardDOM
 */
function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price, id } = data;

    //la var picture est définie pour contenir le chemin de l'image du photographe
    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        //création élément article qui contiendra toutes les informations sur le photographe
        const article = document.createElement('article');

        //picture
        const pImg = document.createElement('img');
        pImg.setAttribute("src", picture);
        pImg.setAttribute("alt", name);

        //name
        const pName = document.createElement('h2');
        pName.textContent = name;

        //city
        const pCity = document.createElement('h3');
        pCity.textContent = `${city}, ${country}`;

        //tagline
        const pTagline = document.createElement('b');
        pTagline.textContent = tagline;

        //price
        const pPrice = document.createElement('span');
        pPrice.textContent = `${price}€/jour`;

        //les éléments créés sont ajoutés comme enfants de l'élément article
        article.appendChild(pImg);
        article.appendChild(pName);
        article.appendChild(pCity);
        article.appendChild(pTagline);
        article.appendChild(pPrice);

        return article;
    }
    return { name, picture, getUserCardDOM };
}
