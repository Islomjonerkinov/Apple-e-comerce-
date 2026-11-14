const products = [
  {
    id: "phone-x1",
    name: "iPhone 15 Pro",
    category: "phone",
    categoryLabel: "iPhone",
    description: "Titan korpus. A17 Pro chip.",
    price: 13490000,
    oldPrice: 14490000,
    badge: "Yangi",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=85",
    colors: ["#777873", "#d7d3c9", "#282b2a"],
    features: ["6.1 dyuymli Super Retina XDR ekran", "48 MP Pro kamera tizimi", "A17 Pro chip va Action tugmasi"]
  },
  {
    id: "phone-air",
    name: "iPhone 15",
    category: "phone",
    categoryLabel: "iPhone",
    description: "Dynamic Island. 48 MP kamera.",
    price: 10990000,
    badge: "Sevimli",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=85",
    colors: ["#e3e5de", "#b7c4cb", "#282b2a"],
    features: ["6.1 dyuymli Super Retina XDR ekran", "48 MP asosiy kamera", "USB-C va kun bo‘yi batareya"]
  },
  {
    id: "book-air",
    name: "MacBook Air 13” M2",
    category: "laptop",
    categoryLabel: "Mac",
    description: "Yengil dizayn. Apple M2 kuchi.",
    price: 14990000,
    badge: "Yangi",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85",
    colors: ["#c6c7c4", "#2d302f"],
    features: ["13.6 dyuymli Liquid Retina ekran", "Apple M2 protsessori", "18 soatgacha batareya"]
  },
  {
    id: "book-pro",
    name: "MacBook Pro 14” M3",
    category: "laptop",
    categoryLabel: "Mac",
    description: "Professional ishlar uchun M3 Pro kuchi.",
    price: 24990000,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
    colors: ["#b7b8b5", "#333533"],
    features: ["14.2 dyuymli Liquid Retina XDR ekran", "Apple M3 Pro protsessori", "22 soatgacha batareya"]
  },
  {
    id: "pods-pro",
    name: "AirPods Pro 2",
    category: "audio",
    categoryLabel: "AirPods",
    description: "Aqlli shovqin nazorati. USB-C.",
    price: 2890000,
    oldPrice: 3190000,
    badge: "Chegirma",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=85",
    colors: ["#f1f1ed"],
    features: ["2 baravar faol shovqin kamaytirish", "Adaptiv audio va Makoniy ovoz", "30 soatgacha tinglash"]
  },
  {
    id: "sound-max",
    name: "AirPods Max",
    category: "audio",
    categoryLabel: "AirPods",
    description: "Yuqori sifatli ovoz. Apple dizayni.",
    price: 6490000,
    image: "https://unsplash.com/photos/Q2uV5TkjNz8/download?force=true&w=800",
    colors: ["#333431", "#d7d0c4"],
    features: ["Apple H1 chip va yuqori aniqlikdagi ovoz", "Faol shovqin kamaytirish", "20 soatgacha tinglash"]
  },
  {
    id: "watch-s",
    name: "Apple Watch Series 9",
    category: "watch",
    categoryLabel: "Apple Watch",
    description: "Sog‘lig‘ingiz. Harakatlaringiz. Sizniki.",
    price: 5190000,
    badge: "Yangi",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?auto=format&fit=crop&w=800&q=85",
    colors: ["#d1c9ba", "#333532"],
    features: ["S9 SiP va Double Tap boshqaruvi", "Doimiy yoqiladigan Retina ekran", "Sog‘liq va uyqu monitoringi"]
  },
  {
    id: "tab-11",
    name: "iPad Pro 11” M2",
    category: "tablet",
    categoryLabel: "iPad",
    description: "O‘qing. Chizing. Yangisini yarating.",
    price: 11490000,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=85",
    colors: ["#d8d7d2", "#a7b7bb"],
    features: ["11 dyuymli Liquid Retina ekran", "Apple M2 protsessori", "Apple Pencil 2 bilan mos"]
  }
];

const state = {
  category: "all",
  cart: readStorage("nova-cart", {}),
  favorites: readStorage("nova-favorites", [])
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const formatPrice = value => `${new Intl.NumberFormat("uz-UZ").format(value).replace(/,/g, " ")} so‘m`;
const getProduct = id => products.find(product => product.id === id);
let toastTimer;

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value && typeof value === "object" ? value : fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  try {
    localStorage.setItem("nova-cart", JSON.stringify(state.cart));
    localStorage.setItem("nova-favorites", JSON.stringify(state.favorites));
  } catch {
    // The shop still works when storage is unavailable.
  }
}

function showToast(message, icon = "✓") {
  clearTimeout(toastTimer);
  $("#toast-message").textContent = message;
  $("#toast-icon").textContent = icon;
  $("#toast").classList.add("show");
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2800);
}

function productCard(product, index) {
  return `
    <article class="product-card" style="animation-delay:${index * 45}ms">
      <div class="product-image-wrap" data-product="${product.id}" role="button" tabindex="0" aria-label="${product.name} haqida batafsil">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
        <button class="favorite-button ${state.favorites.includes(product.id) ? "active" : ""}" data-favorite="${product.id}" aria-label="${product.name}ni sevimlilarga qo‘shish" aria-pressed="${state.favorites.includes(product.id)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z"/></svg>
        </button>
        <button class="quick-add" data-add="${product.id}" aria-label="${product.name}ni savatga qo‘shish">+</button>
      </div>
      <div class="product-info">
        <div class="product-meta"><span class="product-category">${product.categoryLabel}</span><div class="color-dots" aria-label="Mavjud ranglar">${product.colors.map(color => `<i style="background:${color}"></i>`).join("")}</div></div>
        <button class="product-name" data-product="${product.id}">${product.name}</button>
        <p class="product-description">${product.description}</p>
        <div class="product-price"><strong>${formatPrice(product.price)}</strong>${product.oldPrice ? `<del>${formatPrice(product.oldPrice)}</del>` : ""}</div>
      </div>
    </article>`;
}

function renderProducts() {
  const filtered = state.category === "favorites"
    ? products.filter(product => state.favorites.includes(product.id))
    : state.category === "all"
      ? products
      : products.filter(product => product.category === state.category);

  $("#product-grid").innerHTML = filtered.map(productCard).join("");
  $("#product-grid").hidden = filtered.length === 0;
  $("#empty-state").hidden = filtered.length !== 0;
  $("#product-count").textContent = `${filtered.length} ta mahsulot`;
  if (state.category === "favorites") {
    $("#empty-state h3").textContent = "Sevimlilar hozircha bo‘sh";
    $("#empty-state p").textContent = "Mahsulotdagi yurak belgisini bosing, u shu yerda saqlanadi.";
  } else {
    $("#empty-state h3").textContent = "Hozircha bu yer bo‘sh";
    $("#empty-state p").textContent = "Boshqa toifani tanlang yoki barcha mahsulotlarni ko‘ring.";
  }
}

function setCategory(category) {
  state.category = category;
  $$(".category-tab").forEach(button => button.classList.toggle("active", button.dataset.category === category));
  renderProducts();
}

function toggleFavorite(id) {
  const product = getProduct(id);
  const index = state.favorites.indexOf(id);
  if (index === -1) {
    state.favorites.push(id);
    showToast(`${product.name} sevimlilarga qo‘shildi`, "♥");
  } else {
    state.favorites.splice(index, 1);
    showToast(`${product.name} sevimlilardan olindi`);
  }
  saveState();
  updateFavoriteCount();
  renderProducts();
}

function updateFavoriteCount() {
  $("#favorites-count").hidden = state.favorites.length === 0;
}

function addToCart(id, openDrawer = false) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveState();
  renderCart();
  showToast(`${getProduct(id).name} savatga qo‘shildi`);
  if (openDrawer) openCart();
}

function changeQuantity(id, amount) {
  state.cart[id] = (state.cart[id] || 0) + amount;
  if (state.cart[id] <= 0) delete state.cart[id];
  saveState();
  renderCart();
}

function removeFromCart(id) {
  const name = getProduct(id).name;
  delete state.cart[id];
  saveState();
  renderCart();
  showToast(`${name} savatdan olindi`);
}

function cartEntries() {
  return Object.entries(state.cart).filter(([id, quantity]) => getProduct(id) && quantity > 0);
}

function cartTotal() {
  return cartEntries().reduce((sum, [id, quantity]) => sum + getProduct(id).price * quantity, 0);
}

function renderCart() {
  const entries = cartEntries();
  const count = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  $("#cart-count").textContent = count;
  $("#cart-count").hidden = count === 0;
  $("#cart-title-count").textContent = `(${count})`;
  $("#cart-empty").hidden = count !== 0;
  $("#cart-summary").hidden = count === 0;
  $("#cart-items").innerHTML = entries.map(([id, quantity]) => {
    const product = getProduct(id);
    return `<article class="cart-item">
      <img src="${product.image}" alt="${product.name}">
      <div><h4>${product.name}</h4><span class="cart-item-price">${formatPrice(product.price)}</span><div class="quantity-control"><button data-quantity="${id}" data-amount="-1" aria-label="Miqdorni kamaytirish">−</button><span>${quantity}</span><button data-quantity="${id}" data-amount="1" aria-label="Miqdorni oshirish">+</button></div></div>
      <button class="remove-item" data-remove="${id}" aria-label="${product.name}ni savatdan olish">×</button>
    </article>`;
  }).join("");
  $("#cart-total").textContent = formatPrice(cartTotal());
}

function openCart() {
  closeMobileMenu();
  $("#drawer-backdrop").hidden = false;
  $("#cart-drawer").classList.add("open");
  $("#cart-drawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  $("#cart-close").focus({ preventScroll: true });
}

function closeCart() {
  $("#drawer-backdrop").hidden = true;
  $("#cart-drawer").classList.remove("open");
  $("#cart-drawer").setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

function openProduct(id) {
  const product = getProduct(id);
  if (!product) return;
  closeCart();
  if ($("#search-dialog").open) $("#search-dialog").close();
  $("#product-dialog-content").innerHTML = `<div class="product-modal-grid">
    <div class="product-modal-image"><img src="${product.image}" alt="${product.name}"></div>
    <div class="product-modal-copy"><div class="eyebrow">${product.categoryLabel.toUpperCase()} ${product.badge ? `• ${product.badge.toUpperCase()}` : ""}</div><h2>${product.name}</h2><p class="modal-description">${product.description} Zamonaviy dizayn va kundalik hayot uchun kuchli imkoniyatlar bir qurilmada.</p><span class="modal-price">${formatPrice(product.price)}</span><ul class="modal-features">${product.features.map(feature => `<li>${feature}</li>`).join("")}</ul><button class="button button-dark full-width" data-add="${product.id}">Savatga qo‘shish <span>+</span></button><span class="modal-stock"><i></i> Omborda mavjud • Bepul yetkazib berish</span></div>
  </div>`;
  $("#product-dialog").showModal();
}

function openSearch() {
  closeCart();
  closeMobileMenu();
  const dialog = $("#search-dialog");
  dialog.showModal();
  $("#search-input").value = "";
  renderSearchResults("");
  setTimeout(() => $("#search-input").focus(), 100);
}

function renderSearchResults(query) {
  const cleanQuery = query.trim().toLocaleLowerCase("uz");
  $("#popular-searches").hidden = cleanQuery.length > 0;
  if (!cleanQuery) {
    $("#search-hint").textContent = "Mashhur qidiruvlar";
    $("#search-results").innerHTML = "";
    return;
  }
  const results = products.filter(product => `${product.name} ${product.categoryLabel} ${product.description}`.toLocaleLowerCase("uz").includes(cleanQuery));
  $("#search-hint").textContent = results.length ? `${results.length} ta natija topildi` : "Qidiruv natijasi";
  $("#search-results").innerHTML = results.length
    ? results.map(product => `<button class="search-result" data-search-product="${product.id}"><img src="${product.image}" alt=""><span><strong>${product.name}</strong><small>${product.categoryLabel}</small></span><span>${formatPrice(product.price)}</span></button>`).join("")
    : `<div class="search-no-results">“${query.replace(/[<>]/g, "")}” bo‘yicha hech narsa topilmadi.<br>Boshqa so‘z bilan urinib ko‘ring.</div>`;
}

function openFavorites() {
  closeMobileMenu();
  setCategory("favorites");
  $("#products").scrollIntoView({ behavior: "smooth" });
  if (!state.favorites.length) showToast("Sevimli mahsulotlaringiz shu yerda ko‘rinadi", "♥");
}

function closeMobileMenu() {
  $("#mobile-nav").hidden = true;
  $("#menu-toggle").setAttribute("aria-expanded", "false");
}

document.addEventListener("click", event => {
  const target = event.target;
  const productButton = target.closest("[data-product]");
  const addButton = target.closest("[data-add]");
  const favoriteButton = target.closest("[data-favorite]");
  const quantityButton = target.closest("[data-quantity]");
  const removeButton = target.closest("[data-remove]");
  const searchProduct = target.closest("[data-search-product]");

  if (addButton) {
    event.stopPropagation();
    addToCart(addButton.dataset.add);
  } else if (favoriteButton) {
    event.stopPropagation();
    toggleFavorite(favoriteButton.dataset.favorite);
  } else if (productButton) {
    openProduct(productButton.dataset.product);
  } else if (quantityButton) {
    changeQuantity(quantityButton.dataset.quantity, Number(quantityButton.dataset.amount));
  } else if (removeButton) {
    removeFromCart(removeButton.dataset.remove);
  } else if (searchProduct) {
    openProduct(searchProduct.dataset.searchProduct);
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Enter" && event.target.matches(".product-image-wrap")) openProduct(event.target.dataset.product);
  if (event.key === "/" && !$("dialog[open]") && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    openSearch();
  }
  if (event.key === "Escape" && $("#cart-drawer").classList.contains("open")) closeCart();
});

$$(".category-tab").forEach(button => button.addEventListener("click", () => setCategory(button.dataset.category)));
$("#show-all").addEventListener("click", () => setCategory("all"));
$("#hero-buy").addEventListener("click", () => addToCart("phone-x1", true));
$("#cart-open").addEventListener("click", openCart);
$("#cart-close").addEventListener("click", closeCart);
$("#drawer-backdrop").addEventListener("click", closeCart);
$("#cart-shop").addEventListener("click", () => { closeCart(); $("#products").scrollIntoView({ behavior: "smooth" }); });
$("#search-open").addEventListener("click", openSearch);
$("#favorites-open").addEventListener("click", openFavorites);
$("#mobile-favorites").addEventListener("click", openFavorites);
$("#search-input").addEventListener("input", event => renderSearchResults(event.target.value));
$("#popular-searches").addEventListener("click", event => {
  if (event.target.tagName !== "BUTTON") return;
  $("#search-input").value = event.target.textContent;
  renderSearchResults(event.target.textContent);
});

$("#menu-toggle").addEventListener("click", () => {
  const opening = $("#mobile-nav").hidden;
  $("#mobile-nav").hidden = !opening;
  $("#menu-toggle").setAttribute("aria-expanded", String(opening));
});
$$("#mobile-nav a").forEach(link => link.addEventListener("click", closeMobileMenu));

$$("dialog").forEach(dialog => {
  $$(".dialog-close", dialog).forEach(button => button.addEventListener("click", () => dialog.close()));
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
});

$("#checkout-open").addEventListener("click", () => {
  closeCart();
  $("#checkout-total").textContent = formatPrice(cartTotal());
  $("#checkout-form-wrap").hidden = false;
  $("#order-success").hidden = true;
  $("#checkout-form").reset();
  $("#checkout-dialog").showModal();
});

$("#checkout-form").addEventListener("submit", event => {
  event.preventDefault();
  $("#checkout-form-wrap").hidden = true;
  $("#order-success").hidden = false;
  state.cart = {};
  saveState();
  renderCart();
});

$("#newsletter-form").addEventListener("submit", event => {
  event.preventDefault();
  showToast("Obuna uchun rahmat! Yangiliklarda ko‘rishamiz.", "✦");
  event.target.reset();
});

$("#support-chat").addEventListener("click", () => $("#chat-dialog").showModal());
$$("[data-chat-category]").forEach(button => button.addEventListener("click", () => {
  $("#chat-dialog").close();
  setCategory(button.dataset.chatCategory);
  $("#products").scrollIntoView({ behavior: "smooth" });
}));

renderProducts();
renderCart();
updateFavoriteCount();
