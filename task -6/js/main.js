import { el, elAll } from './utils.js';

// export small setup for contact page to reuse
export function setupContact(formElement){
  if(!formElement) return;
  const msg = document.getElementById('msg') || null;
  formElement.addEventListener('submit', async e=>{
    e.preventDefault();
    const name = formElement.querySelector('#name').value.trim();
    const email = formElement.querySelector('#email').value.trim();
    const message = formElement.querySelector('#message').value.trim();
    if(!name || !email || message.length < 10){
      if(msg) { msg.textContent='Please complete the form correctly'; msg.style.color='#b00020' }
      return;
    }
    // simulate API submit
    await new Promise(r=>setTimeout(r,600));
    if(msg){ msg.textContent='Message sent!'; msg.style.color='green' }
    formElement.reset();
  });
}

// NAV TOGGLE
const navToggle = el('#nav-toggle');
const navList = el('#nav-list');
navToggle?.addEventListener('click', ()=> navList.classList.toggle('show'));

// SMOOTH SCROLL (works for anchor links)
elAll('.nav-link').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const id = a.getAttribute('href');
    if(!id || !id.startsWith('#')) { window.location = a.href; return; }
    document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    // close mobile nav
    navList.classList.remove('show');
  })
});

// SCROLLSPY - highlight navbar link for visible section
const sections = elAll('main section');
const navLinks = elAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const id = '#' + entry.target.id;
    const link = document.querySelector(`.nav-link[href="${id}"]`);
    if(entry.isIntersecting){
      navLinks.forEach(n => n.classList.remove('active'));
      link?.classList.add('active');
    }
  })
},{ threshold: 0.5 });
sections.forEach(s => observer.observe(s));

// DYNAMIC CONTENT LOADING (from local JSON)
async function loadData(){
  try{
    const res = await fetch('data/posts.json');
    const data = await res.json();

    // services
    const servicesList = el('#services-list');
    servicesList.innerHTML = data.services.map(s =>
      `<div class="card" data-anim>
         <h3>${s.icon} ${s.title}</h3>
         <p>${s.desc}</p>
       </div>`).join('');

    // testimonials
    const testList = el('#testimonials-list');
    testList.innerHTML = data.testimonials.map(t =>
      `<div class="card" data-anim>
         <p>"${t.text}"</p>
         <small>- ${t.name}</small>
       </div>`).join('');

    // posts
    const posts = el('#posts-list');
    posts.innerHTML = data.posts.map(p =>
      `<article class="post" data-anim>
        <h4>${p.title}</h4>
        <p>${p.summary}</p>
      </article>`).join('');

    revealOnScroll();
  }catch(err){
    console.error('Failed to load data', err);
  }
}
loadData();

// SIMPLE QUOTE API INTEGRATION
const quoteDiv = el('#quote');
const fetchQuoteBtn = el('#fetch-quote');
async function fetchQuote(){
  try{
    quoteDiv.textContent = 'Loading…';
    const r = await fetch('https://api.quotable.io/random');
    const j = await r.json();
    quoteDiv.innerHTML = `"${j.content}" — <strong>${j.author}</strong>`;
  }catch(e){
    quoteDiv.textContent = 'Could not fetch quote.';
  }
}
fetchQuoteBtn?.addEventListener('click', fetchQuote);
fetchQuote();

// SIMPLE REVEAL ON SCROLL (no library)
function revealOnScroll(){
  const items = document.querySelectorAll('[data-anim]');
  const iObs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  },{threshold:0.15});
  items.forEach(i=>iObs.observe(i));
}

// initialize AOS if present
if(window.AOS) AOS.init({duration:700,once:true});
