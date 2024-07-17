const modal = document.getElementById("contact_modal");
const backgroundModal = document.querySelector(".background-modal");

function displayModal() {
    backgroundModal.style.display = "block";
	modal.style.display = "block";
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