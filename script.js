const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const navbar = $('#navbar');
const navLinks = $$('.nav-link');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 12);
  let current = '';
  $$('section[id]').forEach(sec => {
    if (scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+current));
}, {passive:true});

const hamburger = $('#hamburger');
const nav = $('#navLinks');
hamburger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});
$$('.nav-link').forEach(l => l.addEventListener('click', () => nav.classList.remove('open')));

function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(()=> t.classList.remove('show'), 3000);
}

function handleForm(form){
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type=email]');
    const val = input.value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)){
      toast('Please enter a valid work email');
      input.focus();
      return;
    }
    toast('✓ Check your email — invite sent!');
    form.reset();
  });
}
handleForm($('#heroForm'));
$('#loginBtn').addEventListener('click', e => { e.preventDefault(); toast('Login coming soon — use free plan for now'); });

const counters = $$('[data-count]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const raw = el.dataset.count.replace(/,/g,'').replace('%','');
    const isPercent = el.dataset.count.includes('%');
    const target = parseInt(raw,10);
    let cur = 0;
    const step = Math.ceil(target/40);
    const iv = setInterval(()=>{
      cur += step;
      if(cur >= target){ cur = target; clearInterval(iv); }
      el.textContent = isPercent ? cur + '%' : cur.toLocaleString();
    }, 30);
    counterObs.unobserve(el);
  });
},{threshold:.5});
counters.forEach(c => counterObs.observe(c));

const reveals = $$('.reveal');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in'); });
},{threshold:.15});
reveals.forEach(r => revObs.observe(r));

const faqItems = $$('.faq-item');
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    faqItems.forEach(i => { i.classList.remove('open'); i.querySelector('.faq-q').setAttribute('aria-expanded','false'); });
    if(!wasOpen){ item.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
  });
});

const billingToggle = $('#billingToggle');
const amounts = $$('.amount');
let yearly = false;
function updatePrices(){
  amounts.forEach(a => {
    a.textContent = yearly ? a.dataset.yearly : a.dataset.monthly;
  });
}
billingToggle.addEventListener('click', () => {
  yearly = !yearly;
  billingToggle.classList.toggle('active', yearly);
  billingToggle.setAttribute('aria-checked', yearly);
  updatePrices();
  toast(yearly ? 'Yearly billing — 20% saved' : 'Monthly billing');
});

const builderIf = $('#builderIf');
const preview = $('#builderPreview');
const condSelect = $('#condSelect');
function updatePreview(){
  const val = (builderIf?.value || 'high');
  const map = {
    high: 'Will notify Mira for high priority tasks',
    empty: 'Will auto-assign to project owner',
    overdue: 'Will create reminder and escalate'
  };
  if(preview) preview.textContent = map[val] || map.high;
}
builderIf?.addEventListener('change', updatePreview);

$('#runAuto').addEventListener('click', () => {
  const status = $('#runStatus');
  status.textContent = 'Running...';
  setTimeout(()=> { status.textContent = '✓ Sent notification to @mira • Reminder created'; toast('Automation executed successfully'); }, 900);
});