function photographerTemplate(data) {
    const { name, portrait, city, country, tagline, price, id } = data;

    // La variable picture est définie pour contenir le chemin de l'image du photographe
    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        // Création de l'élément article qui contiendra toutes les informations sur le photographe
        const article = document.createElement('article');

        // Lien
        const link = document.createElement('a');
        link.setAttribute("href", `photographer.html?id=${id}`);

        // Image
        const pImg = document.createElement('img');
        pImg.setAttribute("src", picture);
        pImg.setAttribute("alt", name);

        // Ajouter l'image comme enfant de l'élément link
        link.appendChild(pImg);

        // Nom
        const pName = document.createElement('h2');
        pName.textContent = name;

        // Ville
        const pCity = document.createElement('h3');
        pCity.textContent = `${city}, ${country}`;

        // Slogan
        const pTagline = document.createElement('b');
        pTagline.textContent = tagline;

        // Prix
        const pPrice = document.createElement('span');
        pPrice.textContent = `${price}€/jour`;

        // Ajouter les éléments créés comme enfants de l'élément article
        article.appendChild(link);
        article.appendChild(pName);
        article.appendChild(pCity);
        article.appendChild(pTagline);
        article.appendChild(pPrice);

        return article;
    }

    return { name, picture, getUserCardDOM };
}

export default photographerTemplate;
