document.addEventListener("DOMContentLoaded", () => {

  // 1. Dynamic Content Loading
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      loadSection('services-container', data.services);
      loadSection('testimonials-container', data.testimonials);
    });

  function loadSection(id, items) {
    const container = document.getElementById(id);
    items.forEach(item => {
      container.innerHTML += `<div class='card'><h3>${item.title}</h3><p>${item.text}</p></div>`;
    });
  }

  // 2. API Integration (Quotes API)
  fetch('https://api.quotable.io/random')
    .then(res => res.json())
    .then(q => {
      document.getElementById("api-container").innerHTML =
        `<div class='card'><p>${q.content}</p><b>- ${q.author}</b></div>`;
    });

  // 4. Form Validation
  document.getElementById("contactForm").addEventListener("submit", e => {
    e.preventDefault();
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let msg = document.getElementById("formMsg");

    if (!name || !email) {
      msg.textContent = "Please fill all fields!";
      msg.style.color = "red";
    } else {
      msg.textContent = "Form submitted successfully!";
      msg.style.color = "green";
    }
  });

});