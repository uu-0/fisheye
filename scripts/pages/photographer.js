document.addEventListener("DOMContentLoaded", async () => {
    const URLparam = new URL(document.location).searchParams;
    const id = URLparam.get("id");

    //récupère les données
    async function getPhotographers() {
        try {
            const response = await fetch('data/photographers.json'); //chemin fichier JSON
            const data = await response.json(); //converti la réponse en un objet JavaScript
            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    }

    const photographersData = await getPhotographers();

    //récupère le photographe correspondant
    const photographerInfo = photographersData.photographers.find((photographer) => 
        Number(id) === Number(photographer.id));
    
    //récupère les médias du photographe correspondant
    const photographerMedias = photographersData.media.filter((media) => 
        Number(id) === Number(media.photographerId));
    
    //affiche les informations du photographe
    function displayPhotographerInfo(photographer) {
        const photographerHeader = document.querySelector(".photograph-header");
        const photographerInformations = document.querySelector(".photograph-informations");
        const photographerTarif = document.querySelector(".photograph-tarif");
        
        const name = document.createElement('h1');
        name.textContent = photographer.name;
        name.setAttribute('tabindex', '0');
        
        const location = document.createElement('span');
        location.textContent = `${photographer.city}, ${photographer.country}`;
        location.setAttribute('tabindex', '0');

        const tagline = document.createElement('p');
        tagline.textContent = photographer.tagline;
        tagline.setAttribute('tabindex', '0');
        
        const img = document.createElement('img');
        img.setAttribute('src', `assets/photographers/${photographer.portrait}`);
        img.setAttribute('alt', photographer.name);
        img.setAttribute('tabindex', '0');

        const tarif = document.createElement("p");
        tarif.textContent = `${photographer.price}€ / jour`;

        photographerInformations.appendChild(name);
        photographerInformations.appendChild(location);
        photographerInformations.appendChild(tagline);
        photographerHeader.appendChild(img);
        photographerTarif.appendChild(tarif);
    }

    //factory pour les médias
    function mediaFactory(media, index) {
        let mediaContent;

        //si le média est une image
        if (media.image) {
            mediaContent = document.createElement('img');
            mediaContent.setAttribute('src', `assets/medias/${media.photographerId}/${media.image}`);
            mediaContent.setAttribute('alt', media.title);
            mediaContent.setAttribute('tabindex', '0');
            mediaContent.setAttribute('data-index', index); //data-index pour naviguer entre les images de la lightbox
        } 
        //si le média est une vidéo
        else if (media.video) {
            mediaContent = document.createElement('video');
            mediaContent.setAttribute('alt', media.title);
            mediaContent.setAttribute('tabindex', '0'); 
            mediaContent.setAttribute('data-index', index); //data-index pour naviguer entre les images de la lightbox
            
            const source = document.createElement('source');
            source.setAttribute('src', `assets/medias/${media.photographerId}/${media.video}`);
            source.setAttribute('type', 'video/mp4');
            
            mediaContent.appendChild(source);
        }
        
        mediaContent.classList.add('media');

        return mediaContent;
    }

    //affiche les médias du photographe
    function displayPhotographerMedias(medias) {
        const mediaSection = document.querySelector(".media-section");
        medias.forEach((media, index) => {
            const mediaElement = mediaFactory(media, index);
            mediaSection.appendChild(mediaElement);
            //event listener pour ouvrir lightbox et affiché le média correspondant
            mediaElement.addEventListener('click', () => openLightbox(index)); 
            mediaElement.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    openLightbox(index)
                }
            });

        });
    }

    //ouvre la lightbox et affiche le média sélectionné
    function openLightbox(index) {
        const lightbox = document.querySelector('.lightbox');
        
        let currentIndex = index;

        //met à jour l'affichage de la lightbox
        function updateLightbox() {

            const lightboxContent = document.querySelector('.lightbox-content');
            lightboxContent.innerHTML = '';//vide le contenu de la lightbox

            const mediaElement = mediaFactory(photographerMedias[currentIndex]);
            lightboxContent.appendChild(mediaElement);

        }

        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        updateLightbox();

        const closeBtn = document.querySelector('.close-button');

        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        closeBtn.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });

        const nextBtn = document.querySelector('.next-button');
        const backBtn = document.querySelector('.back-button');

        //event listener sur le bouton next pour naviguer entre les médias 
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % photographerMedias.length;
            updateLightbox();
        });

        //event listener sur le bouton back pour naviguer entre les médias 
        backBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + photographerMedias.length) % photographerMedias.length;
            updateLightbox();
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
