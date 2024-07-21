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

    //calcule le nombre total de like d'un photographe
    let totalLikes = photographerMedias.reduce((sum, media) => sum + media.likes, 0);
    
    //affiche les informations du photographe
    function displayPhotographerInfo(photographer) {
        const photographerHeader = document.querySelector(".photograph-header");
        const photographerInformations = document.querySelector(".photograph-informations");
        const photographerTarif = document.querySelector(".photograph-tarif");
        
        //name
        const name = document.createElement('h1');
        name.textContent = photographer.name;
        name.setAttribute('tabindex', '0');
        
        //location
        const location = document.createElement('span');
        location.textContent = `${photographer.city}, ${photographer.country}`;
        location.setAttribute('tabindex', '0');

        //tagline
        const tagline = document.createElement('p');
        tagline.textContent = photographer.tagline;
        tagline.setAttribute('tabindex', '0');
        
        //pp
        const img = document.createElement('img');
        img.setAttribute('src', `assets/photographers/${photographer.portrait}`);
        img.setAttribute('alt', photographer.name);
        img.setAttribute('tabindex', '0');

        //likes : nombre de likes et image like
        const likes = document.createElement("p");
        //ajout d'un id pour le total des likes
        likes.setAttribute('id', 'total-likes'); 
        likes.textContent = `${totalLikes}`;
        const likeImg = document.createElement("img");
        likeImg.setAttribute('src', `assets/icons/heartB.svg`);

        //tarif
        const tarif = document.createElement("p");
        tarif.textContent = `${photographer.price}€ / jour`;

        photographerInformations.appendChild(name);
        photographerInformations.appendChild(location);
        photographerInformations.appendChild(tagline);
        photographerHeader.appendChild(img);
        photographerTarif.appendChild(likes);
        photographerTarif.appendChild(likeImg);
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
        //bloc div media section
        const mediaSection = document.querySelector(".media-section");

        medias.forEach((media, index) => {
            //bloc pour un média
            const mediaBloc = document.createElement('div');
            mediaSection.appendChild(mediaBloc);

            //image/vidéo
            const mediaElement = mediaFactory(media, index);
            mediaBloc.appendChild(mediaElement);

            //information du média : div qui contient titre et nombre de like
            //bloc
            const mediaInformations = document.createElement('div');
            mediaInformations.classList.add('media-information');

            //titre
            const mediaTilte = document.createElement('h1');
            mediaTilte.textContent = media.title;

            //nombre de like
            const numberLike = document.createElement('h1');
            numberLike.textContent = `${media.likes}`;
            numberLike.classList.add('media-like');
            numberLike.setAttribute('data-liked', 'false');

            //image heart like
            const mediaLikeImg = document.createElement('img');
            mediaLikeImg.setAttribute('src', `assets/icons/heart.svg`);


            mediaInformations.appendChild(mediaTilte);
            mediaInformations.appendChild(numberLike);
            mediaInformations.appendChild(mediaLikeImg);
            mediaInformations.style.display = "flex";
            mediaBloc.appendChild(mediaInformations);

            //event listener clic sur img heart pour liker
            mediaLikeImg.addEventListener('click', () => updateLike(numberLike, mediaLikeImg));

            //event listener pour ouvrir lightbox et afficher le média correspondant
            mediaElement.addEventListener('click', () => openLightbox(index)); 
            mediaElement.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    openLightbox(index);
                }
            });

        });
    }

    //incrémente/décrémente les likes
    function updateLike(mediaLikeElement, mediaLikeImg) {
        const isLiked = mediaLikeElement.getAttribute('data-liked') === 'true';

        //on récupère le nombre de like en txt qu'on met en int
        let likesCount = parseInt(mediaLikeElement.textContent);

        if (isLiked) {
            likesCount--; //décrémente le nombre de likes d'une image
            mediaLikeElement.setAttribute('data-liked', 'false');
            mediaLikeImg.classList.remove('liked'); //retire la classe liked
            totalLikes--; //décrémente le nombre total des likes
        } else {
            likesCount++;//incrémente le nombre de likes d'une image
            mediaLikeElement.setAttribute('data-liked', 'true');
            mediaLikeImg.classList.add('liked'); //retire la classe liked
            totalLikes++; //incrémente le nombre total des likes
        }

        mediaLikeElement.textContent = likesCount;

        //met à jour le total des likes affiché
        const totalLikesElement = document.getElementById('total-likes');
        totalLikesElement.textContent = `${totalLikes}`;
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
