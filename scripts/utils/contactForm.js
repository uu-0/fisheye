const header = document.querySelector("header");
const main = document.querySelector("main");
const modal = document.getElementById("contact_modal");
const backgroundModal = document.querySelector(".background-modal");
const closeBtn =   document.querySelector("#closeBtn");

function openModal() {
    modal.setAttribute('aria-hidden', 'false');
    main.setAttribute('aria-hidden', 'true');
    header.setAttribute('aria-hidden', 'true');

    backgroundModal.style.display = "block";
	modal.style.display = "block";
    closeBtn.focus();
}

function closeModal() {
    backgroundModal.style.display = "none";
    modal.style.display = "none";
}

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const prenom = document.getElementById('prenom').value;
    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    console.log('Prénom:', prenom);
    console.log('Nom:', nom);
    console.log('Email:', email);
    console.log('Message:', message);
});