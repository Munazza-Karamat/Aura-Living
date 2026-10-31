'use strict';
const image = (id, width = 650) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
const products = [
  {id:'haven',name:'The Haven Sofa',category:'living',type:'Sofas & seating',price:1299,color:'Natural linen',swatches:['#c6bead','#918f7f','#e0d9c9'],badge:'Bestseller',photo:'photo-1555041469-a586c61ea9bc',description:'A generous seat, soft cushions, and a clean-lined silhouette. The Haven is made for slow Sundays, good conversations, and stretching out at the end of the day.',size:'84″ W × 35″ D × 31″ H',material:'Linen-blend upholstery · solid wood frame'},
  {id:'arc',name:'Arc Lounge Chair',category:'living',type:'Armchairs',price:449,color:'Warm ivory',swatches:['#d6cdbc','#9c8a70','#66694f'],badge:'',photo:'photo-1567538096630-e0c55bd6374c',description:'A sculptural accent with an easy, welcoming seat. Beautiful on its own, even better with your favorite book and a quiet corner.',size:'29″ W × 31″ D × 32″ H',material:'Textured upholstery · natural wood legs'},
  {id:'forma',name:'Forma Table Lamp',category:'decor',type:'Lighting',price:129,color:'Soft sand',swatches:['#c8bda6','#ddd8ce'],badge:'New arrival',photo:'photo-1507473885765-e6ed057f782c',description:'Soft light, a simple form, and just the right amount of character. Forma brings a gentle glow to bedside tables, shelves, and evening rituals.',size:'12″ diameter × 21″ H',material:'Ceramic base · woven fabric shade'},
  {id:'oak',name:'Everyday Oak Table',category:'living',type:'Tables',price:329,oldPrice:399,color:'Natural oak',swatches:['#b4956f','#7c6046'],badge:'A little less',photo:'photo-1533090161767-e6ffed986c88',description:'Honest wood grain and a beautifully simple profile. A versatile table for your morning coffee, a stack of books, and everything in between.',size:'35″ W × 22″ D × 16″ H',material:'Solid oak · protective matte finish'},
  {id:'linen',name:'Sunday Linen Set',category:'bedroom',type:'Bedding',price:189,color:'Cloud white',swatches:['#e5e1d8','#c9bba7','#9a9f8a'],badge:'New arrival',photo:'photo-1631049307264-da0ec9d70304',description:'Relaxed texture and an invitingly soft finish. A breathable linen-blend duvet cover and two pillowcases for a slower start to your mornings.',size:'Queen duvet cover · 2 standard pillowcases',material:'Linen-cotton blend · machine washable'},
  {id:'bedside',name:'Still Bedside Table',category:'bedroom',type:'Bedside tables',price:249,color:'Warm walnut',swatches:['#8c6b4e','#bb9b73'],badge:'',photo:'photo-1499933374294-4584851497cc',description:'A little space for the things you keep close. Warm wood, understated proportions, and room for a reading lamp and your evening essentials.',size:'20″ W × 16″ D × 23″ H',material:'Walnut veneer · engineered wood core'},
  {id:'vase',name:'Terra Ceramic Vase',category:'decor',type:'Home accents',price:48,color:'Earth',swatches:['#b08d70','#d4c9b6'],badge:'Bestseller',photo:'photo-1578749556568-bc2c40e68b61',description:'Organic curves with an earthy, tactile finish. Just as lovely filled with a few branches as it is left to stand quietly on its own.',size:'7″ diameter × 11″ H',material:'Glazed stoneware · watertight interior'},
  {id:'throw',name:'Slow Sunday Throw',category:'decor',type:'Soft furnishings',price:79,color:'Oatmeal',swatches:['#c8bdab','#9b9b83'],badge:'New arrival',photo:'photo-1600369671236-e74521d4b6ad',description:'An extra layer of comfort, wherever you settle in. A softly woven cotton throw with a relaxed fringe and timeless, neutral tone.',size:'50″ W × 65″ L',material:'100% cotton · gentle machine wash'}
];
const $ = selector => document.querySelector(selector);
const money = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
let cart = {};
try {
  const stored = JSON.parse(localStorage.getItem('aura-cart') || '{}');
  if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
    for (const p of products) if (Number.isInteger(stored[p.id]) && stored[p.id] > 0) cart[p.id] = Math.min(stored[p.id],99);
  }
} catch (_) {}
let filter = 'all', expanded = false, onlyNew = false;
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
function productCard(p) {
  return `<article class="product">
    <div class="product-picture">
      <a href="#product-${p.id}" data-product="${p.id}" aria-label="View ${p.name}"><img src="${image(p.photo)}" alt="${p.name} in ${p.color.toLowerCase()}" loading="lazy" width="650" height="640"></a>
      ${p.badge ? `<span class="badge ${p.oldPrice?'sale':''}">${p.badge}</span>` : ''}
      <button class="add-product" data-add="${p.id}" aria-label="Add ${p.name} to bag">${icon('plus')}</button>
    </div>
    <div class="product-info"><div class="product-category">${p.type}</div><div class="product-title-row"><h3><a href="#product-${p.id}" data-product="${p.id}">${p.name}</a></h3><span class="price">${p.oldPrice?`<del>${money(p.oldPrice)}</del>`:''}${money(p.price)}</span></div>
    <div class="product-bottom">${p.swatches.map(c=>`<span class="swatch" style="--swatch:${c}" aria-hidden="true"></span>`).join('')}<span class="color-name">${p.color}</span></div></div>
  </article>`;
}
function renderProducts() {
  let selection = products.filter(p=>(filter==='all'||p.category===filter)&&(!onlyNew||p.badge==='New arrival'));
  let visible = expanded ? selection : selection.slice(0,4);
  $('#product-grid').innerHTML=visible.map(productCard).join('');
  $('#product-count').textContent=`${visible.length} of ${selection.length} considered pieces`;
  $('#more-products').hidden=visible.length>=selection.length;
  $('.shop-bottom').style.display=visible.length>=selection.length?'none':'flex';
  document.querySelectorAll('[data-filter]').forEach(b=>{
    const active=b.dataset.filter===filter;
    b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));
  });
  $('#shop-title').textContent=onlyNew?'Fresh finds for your home.':'Meet your new favorites.';
}
function setFilter(category, newOnly=false) {filter=category;onlyNew=newOnly;expanded=category!=='all'||newOnly;renderProducts();}
function closeMenu() {$('#navigation').classList.remove('open');$('#menu-trigger').setAttribute('aria-expanded','false');}
$('#menu-trigger').addEventListener('click',()=>{
  const open=$('#navigation').classList.toggle('open');$('#menu-trigger').setAttribute('aria-expanded',String(open));
});
document.addEventListener('click',e=>{
  const category=e.target.closest('[data-category]');
  if(category){setFilter(category.dataset.category);closeMenu();}
  const newLink=e.target.closest('[data-new-arrivals]');
  if(newLink){setFilter('all',true);closeMenu();}
  const tab=e.target.closest('[data-filter]');
  if(tab)setFilter(tab.dataset.filter);
  const add=e.target.closest('[data-add]');
  if(add)addToCart(add.dataset.add);
  const detail=e.target.closest('[data-product]');
  if(detail){e.preventDefault();showProduct(detail.dataset.product);}
  const info=e.target.closest('[data-info]');
  if(info)showInfo(info.dataset.info);
  if(e.target.closest('[data-close]'))e.target.closest('dialog').close();
  if(e.target.closest('.nav-links a'))closeMenu();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
$('#more-products').addEventListener('click',()=>{expanded=true;renderProducts();});
$('#view-collection').addEventListener('click',()=>{filter='all';onlyNew=false;expanded=true;renderProducts();});

function openDialog(dialog) {
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
  dialog.showModal();document.body.classList.add('locked');
}
document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('locked');});
  dialog.addEventListener('click',e=>{
    if(e.target===dialog) {
      const r=dialog.getBoundingClientRect();
      if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();
    }
  });
});
let toastTimer;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3000);}
function persistCart(){try{localStorage.setItem('aura-cart',JSON.stringify(cart));}catch(_){toast('Storage is unavailable. Your bag will last for this visit.');}renderCart();}
function addToCart(id){
  const p=products.find(p=>p.id===id);if(!p)return;
  if((cart[id]||0)>=99){toast('Maximum quantity is 99 per piece.');return;}
  cart[id]=(cart[id]||0)+1;persistCart();toast(`${p.name} added to your bag`);
}
function renderCart(){
  const entries=products.filter(p=>cart[p.id]);
  const count=entries.reduce((n,p)=>n+cart[p.id],0);
  const total=entries.reduce((n,p)=>n+p.price*cart[p.id],0);
  $('.cart-count').textContent=count;
  $('#cart-trigger').setAttribute('aria-label',`Open shopping bag, ${count} ${count===1?'item':'items'}`);
  $('#cart-heading-count').textContent=count?`(${count})`:'';
  $('#cart-subtotal').textContent=money(total);
  $('#shipping-note').textContent=total>=150?'Your bag qualifies for complimentary shipping. Taxes calculated at checkout.':total?`You’re ${money(150-total)} away from complimentary shipping.`:'Shipping and taxes calculated at checkout.';
  $('#checkout-button').disabled=!count;
  $('#cart-items').innerHTML=entries.length?entries.map(p=>`<article class="cart-item"><img src="${image(p.photo,200)}" alt="${p.name}"><div><h3>${p.name}</h3><p>${p.color} · ${money(p.price)}</p><div class="quantity-row"><div class="quantity"><button data-quantity="${p.id}" data-change="-1" aria-label="Decrease ${p.name} quantity">−</button><span aria-label="Quantity">${cart[p.id]}</span><button data-quantity="${p.id}" data-change="1" aria-label="Increase ${p.name} quantity">+</button></div><button class="remove" data-remove="${p.id}">Remove</button></div></div></article>`).join(''):`<div class="empty-cart">${icon('bag')}<h3>A little room for something lovely.</h3><p>Your bag is waiting for its first favorite.</p><button class="button" data-close>Explore the collection ${icon('arrow')}</button></div>`;
}
$('#cart-items').addEventListener('click',e=>{
  const q=e.target.closest('[data-quantity]'), remove=e.target.closest('[data-remove]');
  if(q){const id=q.dataset.quantity;cart[id]=Math.min(99,cart[id]+Number(q.dataset.change));if(cart[id]<=0)delete cart[id];persistCart();}
  if(remove){delete cart[remove.dataset.remove];persistCart();}
});
$('#cart-trigger').addEventListener('click',()=>openDialog($('#cart-dialog')));
$('#checkout-button').addEventListener('click',()=>showInfo('checkout'));
function showProduct(id) {
  const p=products.find(p=>p.id===id);if(!p)return;
  $('#product-detail').innerHTML=`<div class="product-detail"><img src="${image(p.photo,900)}" alt="${p.name} in ${p.color.toLowerCase()}"><div class="product-detail-copy"><div class="eyebrow">${p.type}</div><h2 id="detail-title">${p.name}</h2><div class="detail-price">${money(p.price)}</div><p>${p.description}</p><div class="detail-meta">Color: ${p.color}<br>${p.size}<br>${p.material}</div><button class="button" data-add="${p.id}">Add to your bag ${icon('plus')}</button><p style="font-size:9px">Illustrative product · ships nowhere in this portfolio preview.</p></div></div>`;
  openDialog($('#product-dialog'));
}
function renderSearch(){
  const query=$('#search-input').value.trim().toLowerCase();
  const results=products.filter(p=>`${p.name} ${p.type} ${p.color} ${p.material} ${p.category}`.toLowerCase().includes(query));
  $('#search-results').innerHTML=results.length?results.map(p=>`<button class="search-result" data-product="${p.id}"><img src="${image(p.photo,160)}" alt=""><span><h3>${p.name}</h3><p>${p.type} · ${money(p.price)}</p></span>${icon('arrow')}</button>`).join(''):'<p style="padding:20px 0;color:var(--muted)">No pieces found. Try “linen”, “table”, or “ceramic”.</p>';
}
$('#search-trigger').addEventListener('click',()=>{openDialog($('#search-dialog'));renderSearch();$('#search-input').focus();});
$('#search-input').addEventListener('input',renderSearch);
const infoContent={
  story:{title:'A quieter kind of design.',body:'<p>Aura Living is a concept furniture and décor brand built around one simple idea: a home should feel as good as it looks.</p><p>Our design direction pairs warm neutrals, natural textures, and uncomplicated shapes. We favor versatile pieces that work together, helping new spaces feel personal without feeling overfilled.</p><p>This portfolio storefront presents an illustrative collection. Product specifications, sourcing claims, prices, and policies are examples, not offers from an operating retailer.</p>'},
  shipping:{title:'A warm welcome, delivered.',body:'<h3>Example delivery policy</h3><p>For a future live store: complimentary standard shipping on orders of $150 or more within the contiguous United States. Smaller orders would have shipping calculated at checkout.</p><p>Typical proposed delivery windows are 5–7 business days for décor and 2–4 weeks for larger furniture, subject to stock and location.</p><p>This is a portfolio preview. No items are actually shipped, and no delivery dates are guaranteed.</p>'},
  returns:{title:'Room to change your mind.',body:'<h3>Example 30-day return policy</h3><p>A future live store would accept unused items in original condition within 30 days of delivery. Custom items and final-sale pieces may be excluded; return freight would be disclosed before purchase.</p><p>Damaged deliveries should be photographed, including the packaging, so a support team can help.</p><p>No purchases or returns are processed in this portfolio preview.</p>'},
  contact:{title:'A little help for your home.',body:'<h3>Can I place an order?</h3><p>Not in this preview. You can explore products and save a bag on your device, but payment and fulfillment services are not connected.</p><h3>Are the product photos exact?</h3><p>No. These are illustrative lifestyle images from Unsplash. A live store should use verified product photography and specifications.</p><h3>How do I contact the store?</h3><p>Aura Living is a portfolio concept, so there is no active customer service address. A production version needs a verified business email and a support system before accepting orders.</p>'},
  care:{title:'Made to be lived with.',body:'<h3>Wood & natural finishes</h3><p>Dust with a soft, dry cloth. Wipe spills promptly, use coasters, and avoid harsh cleaners or prolonged direct sunlight.</p><h3>Upholstery & textiles</h3><p>Vacuum gently, rotate cushions, and blot spills instead of rubbing. Always follow the actual manufacturer’s care label before washing or spot cleaning.</p><h3>Ceramics & lighting</h3><p>Use a soft cloth for ceramics. Unplug lamps before cleaning and follow the fixture’s specified bulb rating.</p>'},
  guide:{title:'Make room for what matters.',body:'<h3>01 / Start with how you live</h3><p>Think about your everyday routines first. Leave comfortable pathways and measure doorways before choosing larger pieces.</p><h3>02 / Build a quiet foundation</h3><p>Start with two or three complementary neutrals, then add warmth through wood, linen, and tactile fabrics.</p><h3>03 / Layer the light</h3><p>Combine ambient lighting with a reading lamp and a softer evening light. The room should feel welcoming at every hour.</p><h3>04 / Leave a little breathing room</h3><p>Choose a few objects you genuinely love. A personal photo, a favorite book, and a stem of greenery can be enough.</p>'},
  privacy:{title:'Your space. Your privacy.',body:'<p>This preview stores your shopping bag and, if submitted, your newsletter email in your browser’s local storage. Neither is sent to an Aura Living server.</p><p>You can remove this information by clearing site data in your browser. Do not submit sensitive information.</p><p>Images load from Unsplash and fonts from Google Fonts. These providers receive normal network information, including your IP address, when your browser requests their resources.</p><p>A live store would require a business-specific privacy policy covering analytics, payments, customer accounts, retention, and applicable privacy rights.</p>'},
  terms:{title:'A note on this preview.',body:'<p>Aura Living is a demonstration storefront, not an operating retailer. Products, prices, reviews, specifications, sustainability statements, and delivery policies are illustrative.</p><p>No orders are accepted, no payment information is collected, and no purchase contract is created. The sample customer stories are fictional, not verified testimonials.</p><p>Images are used for visual presentation and may not depict the named product exactly. A production site needs verified inventory, photography, legal policies, and payment integration before launch.</p>'},
  demo:{title:'Thoughtfully built.',body:'<h3>The design</h3><p>A warm editorial storefront with an olive-and-cream palette, expressive serif headings, and a mobile-first shopping experience.</p><h3>Run & publish</h3><p>This is a self-contained HTML page with embedded CSS and JavaScript. Save it as index.html and open it in a modern browser, or publish it as a static site with Netlify, Vercel, or GitHub Pages. Internet access is needed for images and fonts.</p><h3>Before accepting orders</h3><p>Connect a commerce platform such as Shopify, or a server-side database and Stripe Checkout. Verify stock and prices on the server, add order fulfillment and email delivery, and replace sample policies and photography.</p><p>Manual browser, screen-reader, device, and payment-flow testing is required before production launch.</p>'},
  checkout:{title:'Your lovely finds are saved.',body:'<h3>This is a portfolio checkout preview.</h3><p>Your bag is saved in this browser, but this store cannot accept real orders or payments. No payment or personal delivery information is requested.</p><p>A production checkout requires a secure commerce backend, verified inventory, tax and shipping calculation, and a payment provider such as Shopify Payments or Stripe. Payment details must never be handled by this static page.</p><button class="button" id="return-to-bag">Back to your bag</button>'}
};
function showInfo(key){
  const content=infoContent[key];if(!content)return;
  $('#info-title').textContent=content.title;$('#info-body').innerHTML=content.body;openDialog($('#info-dialog'));
  if(key==='checkout')$('#return-to-bag').addEventListener('click',()=>openDialog($('#cart-dialog')));
}
const reviews=[
  {quote:'“That feeling when your space finally feels like you. Aura brought it all together, beautifully.”',name:'Sophie M.',place:'A fresh start in Brooklyn'},
  {quote:'“Warm textures, simple shapes, and a little breathing room. Exactly how we imagined our first home.”',name:'James & Alex',place:'Making a home in Austin'},
  {quote:'“It’s the small details that make the difference. Our favorite corner is now the whole living room.”',name:'Olivia R.',place:'Slow living in Portland'}
];
document.querySelectorAll('[data-review]').forEach(b=>b.addEventListener('click',()=>{
  const r=reviews[Number(b.dataset.review)];
  $('#review-quote').textContent=r.quote;
  $('#review-author').textContent=r.name+' ';
  const span=document.createElement('span');span.textContent='— '+r.place;$('#review-author').append(span);
  document.querySelectorAll('[data-review]').forEach(d=>{d.classList.toggle('active',d===b);d.setAttribute('aria-pressed',String(d===b));});
}));
$('#newsletter-form').addEventListener('submit',e=>{
  e.preventDefault();
  const email=$('#email').value.trim();
  if(!$('#newsletter-form').reportValidity())return;
  try{
    localStorage.setItem('aura-newsletter-preview',email);
    $('#newsletter-status').textContent='Saved for this preview. No email was sent — newsletter delivery is not connected.';
    $('#newsletter-form').reset();
  }catch(_){$('#newsletter-status').textContent='Your browser could not save this signup. Please allow site storage and try again.';}
});
$('#year').textContent=new Date().getFullYear();
renderProducts();renderCart();
