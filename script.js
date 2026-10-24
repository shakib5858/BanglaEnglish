// TrackZone storefront demo. Replace the WhatsApp number below with your own number (country code, digits only).
const WHATSAPP_NUMBER = "8801XXXXXXXXX";
const starterProducts = [
 {id:"gps1",name:"TK905 Magnetic GPS Tracker",price:2850,oldPrice:3300,category:"গাড়ির GPS",stock:"স্টকে আছে",image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=85",description:"ম্যাগনেটিক ডিজাইন, লাইভ লোকেশন ও সহজ ট্র্যাকিং।"},
 {id:"gps2",name:"Mini Vehicle GPS Tracker",price:1950,oldPrice:2300,category:"গাড়ির GPS",stock:"স্টকে আছে",image:"https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=85",description:"গাড়ির নিরাপত্তা ও লোকেশন পর্যবেক্ষণের জন্য।"},
 {id:"gps3",name:"Motorcycle GPS Tracker",price:2200,oldPrice:2600,category:"বাইক GPS",stock:"স্টকে আছে",image:"https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=85",description:"বাইকের জন্য কমপ্যাক্ট ট্র্যাকিং সলিউশন।"},
 {id:"gps4",name:"Portable Personal Tracker",price:1750,oldPrice:2100,category:"পার্সোনাল",stock:"প্রি-অর্ডার",image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=85",description:"ব্যক্তিগত ব্যবহারের জন্য ছোট ও বহনযোগ্য ডিভাইস।"}
];
const $=s=>document.querySelector(s);
const money=n=>"৳"+Number(n||0).toLocaleString("en-US");
let products=loadProducts(),cart=JSON.parse(localStorage.getItem("trackzone_cart")||"[]"),activeCategory="সব",searchTerm="";
function loadProducts(){try{const saved=localStorage.getItem("trackzone_products");return saved?JSON.parse(saved):starterProducts.slice()}catch{return starterProducts.slice()}}
function persistProducts(){localStorage.setItem("trackzone_products",JSON.stringify(products))}
function persistCart(){localStorage.setItem("trackzone_cart",JSON.stringify(cart))}
function safe(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderProducts(){
 const list=products.filter(p=>(activeCategory==="সব"||p.category===activeCategory)&&(`${p.name} ${p.description} ${p.category}`).toLowerCase().includes(searchTerm.toLowerCase()));
 $("#productGrid").innerHTML=list.map(p=>`<article class="product-card"><div class="product-image"><img src="${safe(p.image)}" alt="${safe(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80'"><span class="tag">${p.oldPrice>p.price?"বিশেষ অফার":"জনপ্রিয়"}</span></div><div class="product-info"><span class="category">${safe(p.category)}</span><h3>${safe(p.name)}</h3><p class="desc">${safe(p.description||"বিস্তারিত জানতে যোগাযোগ করুন।")}</p><div class="price-row"><span class="price">${money(p.price)}</span>${p.oldPrice>p.price?`<span class="old-price">${money(p.oldPrice)}</span>`:""}</div><div class="stock ${p.stock==="স্টক শেষ"?"out":""}">${safe(p.stock||"স্টকে আছে")}</div><div class="card-actions"><button class="add-btn" data-add="${safe(p.id)}" ${p.stock==="স্টক শেষ"?"disabled":""}>${p.stock==="স্টক শেষ"?"স্টক শেষ":"＋ কার্টে যোগ"}</button><button class="details-btn" title="WhatsApp-এ জানতে চান" data-ask="${safe(p.id)}">↗</button></div></div></article>`).join("");
 $("#emptyState").classList.toggle("hidden",list.length>0);
}
function renderCart(){
 const count=cart.reduce((n,i)=>n+i.qty,0);$("#cartCount").textContent=count;$("#mobileCartCount").textContent=count;
 $("#cartItems").innerHTML=cart.length?cart.map(i=>{const p=products.find(x=>x.id===i.id)||i;return `<div class="cart-item"><img src="${safe(p.image)}" alt=""><div><b>${safe(p.name)}</b><small>${money(p.price)} × ${i.qty}</small><div class="qty"><button data-qty="${safe(i.id)}" data-delta="-1">−</button><span>${i.qty}</span><button data-qty="${safe(i.id)}" data-delta="1">+</button></div></div><button class="remove" data-remove="${safe(i.id)}">মুছুন</button></div>`}).join(""):'<p class="empty">আপনার কার্ট এখন খালি।</p>';
 $("#cartTotal").textContent=money(cart.reduce((n,i)=>{const p=products.find(x=>x.id===i.id)||i;return n+(Number(p.price)*i.qty)},0));
}
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2400)}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p)return;if(p.stock==="স্টক শেষ")return toast("এই প্রোডাক্টটি এখন স্টকে নেই।");const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});persistCart();renderCart();toast("কার্টে যোগ হয়েছে!")}
function askWhatsApp(p){const msg=`আসসালামু আলাইকুম, ${p.name} সম্পর্কে জানতে চাই। দাম: ${money(p.price)}`;window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank","noopener")}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add)addToCart(add.dataset.add);
 const ask=e.target.closest("[data-ask]");if(ask){const p=products.find(x=>x.id===ask.dataset.ask);if(p)askWhatsApp(p)}
 const qty=e.target.closest("[data-qty]");if(qty){const i=cart.find(x=>x.id===qty.dataset.qty);if(i){i.qty+=Number(qty.dataset.delta);if(i.qty<=0)cart=cart.filter(x=>x.id!==i.id);persistCart();renderCart()}}
 const rem=e.target.closest("[data-remove]");if(rem){cart=cart.filter(x=>x.id!==rem.dataset.remove);persistCart();renderCart()}
 if(e.target.closest(".cart-open")){$("#cartModal").classList.remove("hidden");renderCart()}
 if(e.target.matches("[data-close]"))$("#cartModal").classList.add("hidden");
 const cat=e.target.closest(".cat");if(cat){activeCategory=cat.dataset.cat;document.querySelectorAll(".cat").forEach(x=>x.classList.toggle("active",x===cat));renderProducts()}
});
$("#searchToggle").addEventListener("click",()=>{$("#searchWrap").classList.toggle("show");if($("#searchWrap").classList.contains("show"))$("#searchInput").focus()});
$("#searchInput").addEventListener("input",e=>{searchTerm=e.target.value;renderProducts()});
$("#showAll").addEventListener("click",()=>{activeCategory="সব";searchTerm="";$("#searchInput").value="";document.querySelectorAll(".cat").forEach(x=>x.classList.toggle("active",x.dataset.cat==="সব"));renderProducts();$("#products").scrollIntoView({behavior:"smooth"})});
$("#productForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget);const p={id:"p"+Date.now(),name:f.get("name").trim(),price:Number(f.get("price")),oldPrice:Number(f.get("oldPrice")||0),category:f.get("category"),stock:f.get("stock"),image:f.get("image").trim(),description:f.get("description").trim()};products.unshift(p);persistProducts();renderProducts();e.currentTarget.reset();toast("নতুন প্রোডাক্ট যোগ হয়েছে।");$("#products").scrollIntoView({behavior:"smooth"})});
$("#checkoutBtn").addEventListener("click",()=>{if(!cart.length)return toast("অর্ডার করার আগে কার্টে প্রোডাক্ট যোগ করুন।");const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id)||i;return `• ${p.name} — ${i.qty} × ${money(p.price)} = ${money(p.price*i.qty)}`});const total=cart.reduce((n,i)=>n+(Number((products.find(x=>x.id===i.id)||i).price)*i.qty),0);const msg=`আসসালামু আলাইকুম, আমি অর্ডার করতে চাই:\n${lines.join("\n")}\nমোট: ${money(total)}\n\nনাম:\nঠিকানা:\nমোবাইল:`;window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank","noopener")});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();