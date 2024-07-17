    async function getPhotographers() {
        try {
            const response = await fetch('data/photographers.json'); //chemin fichier JSON
            const data = await response.json(); //converti la réponse en un objet javascript
            //console.log(data);
            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerTemplate(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    }

    async function init() {
        //récupère les datas des photographes
        const { photographers } = await getPhotographers();
        displayData(photographers);
    }

    

     /**
     * permet de naviguer entre les articles grâce aux touches du clavier
     * @param {*} event 
     */
     function handleKeyDown(event) {
        //const firstElement = document.querySelector('[tabindex="0"]');
        const activeElement = document.activeElement;

            //si la touche pressée est la flèche du bas ou la flèche de droite 
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {

                const nextElement = activeElement.nextElementSibling;

                if (nextElement && nextElement.tagName.toLowerCase() === 'article') {
                    nextElement.focus();
                }
            //si la touche pressée est la flèche du haut ou la flèche de gauche
            } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {

                const prevElement = activeElement.previousElementSibling;

                if (prevElement && prevElement.tagName.toLowerCase() === 'article') {
                    prevElement.focus();
                }
            }
        
        
    }

    document.addEventListener('keydown', handleKeyDown);
    
    init();

  

    
    
