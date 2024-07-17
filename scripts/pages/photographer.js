document.addEventListener("DOMContentLoaded", async () => {
    const URLparam = new URL(document.location).searchParams;
    const id = URLparam.get("id");

    //récupère les données
    async function getPhotographers() {
        try {
            const response = await fetch('data/photographers.json'); // chemin fichier JSON
            const data = await response.json(); // converti la réponse en un objet javascript
            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    }

    const photographersData = await getPhotographers();

    //récupère le photographe correspondant
    const photographerInfo = photographersData.photographers.find((photographer) => 
        Number(id) === Number(photographer.id));
    
    //récupère les médias correspondants
    const photographerMedias = photographersData.media.filter((media) => 
        Number(id) === Number(media.photographerId));
    
    //affiche les informations du photographe
    function displayPhotographerInfo(photographer) {
        const photographerHeader = document.querySelector(".photograph-header");
        const photographerInformations = document.querySelector(".photograph-informations");
        const photographerTarif = document.querySelector(".photograph-tarif");
        
        const name = document.createElement('h1');
        name.textContent = photographer.name;
        
        const location = document.createElement('span');
        location.textContent = `${photographer.city}, ${photographer.country}`;
        
        const tagline = document.createElement('p');
        tagline.textContent = photographer.tagline;
        
        const img = document.createElement('img');
        img.setAttribute('src', `assets/photographers/${photographer.portrait}`);
        img.setAttribute('alt', photographer.name);

        const tarif = document.createElement("p");
        tarif.textContent = `${photographer.price}€ / jour`;

        photographerInformations.appendChild(name);
        photographerInformations.appendChild(location);
        photographerInformations.appendChild(tagline);
        photographerHeader.appendChild(img);
        photographerTarif.appendChild(tarif);

    }

    //factory pour les médias
    function mediaFactory(media) {
        const mediaElement = document.createElement('div');
        mediaElement.classList.add('media');
        
        let mediaContent;

        //si le média est une image
        if (media.image) {
            mediaContent = document.createElement('img');
            mediaContent.setAttribute('src', `assets/medias/${media.photographerId}/${media.image}`);
            mediaContent.setAttribute('alt', media.title);
        } 
        // si le média est une vidéo
        else if (media.video) {
            mediaContent = document.createElement('video');
            mediaContent.setAttribute('controls', '');
            mediaContent.setAttribute('alt', media.title);

            const source = document.createElement('source');
            source.setAttribute('src', `assets/medias/${media.photographerId}/${media.video}`);
            source.setAttribute('type', 'video/mp4');
            
            mediaContent.appendChild(source);
        }
        
        const title = document.createElement('h2');
        title.textContent = media.title;
        
        mediaElement.appendChild(mediaContent);
        mediaElement.appendChild(title);

        return mediaElement;
    }

    //affiche les médias du photographe
    function displayPhotographerMedias(medias) {

        const mediaSection = document.querySelector(".media-section");
        
        medias.forEach((media) => {
            const mediaElement = mediaFactory(media);
            mediaSection.appendChild(mediaElement);
        });
    }

    //vérifie que le photographe existe
    if (photographerInfo) {
        displayPhotographerInfo(photographerInfo);
        displayPhotographerMedias(photographerMedias);
    } else {
        console.error('Photographe non trouvé');
    }
});
