const STORAGE_KEYS = {
  products: "willow-wing-products-v1",
};

const defaultProducts = [
  {
    id: "mabel",
    name: "Mabel",
    breed: "Speckled Sussex",
    age: 4,
    price: 32,
    stock: 4,
    available: true,
    description: "A sweet-natured little explorer with the prettiest speckled feathers. Mabel is curious, gentle, and happiest scratching around with a friend.",
    image: "https://images.pexels.com/photos/19038587/pexels-photo-19038587/free-photo-of-hen-on-ground.jpeg?auto=compress&cs=tinysrgb&w=900",
    traits: ["Friendly nature", "Good foragers", "Lovely brown eggs"],
  },
  {
    id: "daisy",
    name: "Daisy",
    breed: "Buff Orpington",
    age: 5,
    price: 38,
    stock: 3,
    available: true,
    description: "A golden girl with a calm, cuddly disposition. Daisy is a lovely choice for a first flock and brings a sunny presence wherever she goes.",
    image: "https://images.pexels.com/photos/30749936/pexels-photo-30749936/free-photo-of-close-up-portrait-of-a-resting-hen-in-coop.jpeg?auto=compress&cs=tinysrgb&w=900",
    traits: ["Calm & gentle", "Family favorite", "Hardy in cool weather"],
  },
  {
    id: "poppy",
    name: "Poppy",
    breed: "Rhode Island Red",
    age: 6,
    price: 42,
    stock: 2,
    available: true,
    description: "A confident, good-natured hen with rich chestnut feathers. Poppy is a dependable layer and a lively addition to an established coop.",
    image: "https://images.pexels.com/photos/36660076/pexels-photo-36660076/free-photo-of-free-range-brown-hen-in-sunny-pasture.jpeg?auto=compress&cs=tinysrgb&w=900",
    traits: ["Confident & curious", "Reliable layer", "Active forager"],
  },
  {
    id: "juniper",
    name: "Juniper",
    breed: "Barred Plymouth Rock",
    age: 5,
    price: 36,
    stock: 0,
    available: false,
    description: "A steady, easygoing bird with beautiful barred plumage. Juniper loves a roomy run, a dust bath, and the company of her flock.",
    image: "https://images.pexels.com/photos/38714284/pexels-photo-38714284/free-photo-of-close-up-of-free-range-hens-outdoors.jpeg?auto=compress&cs=tinysrgb&w=900",
    traits: ["Easygoing", "Great backyard bird", "Beautiful barred feathers"],
  },
];

const requestedProducts = [
  {
    id: "speckled-sussex",
    name: "Speckled Sussex",
    breed: "Speckled Sussex",
    age: 4,
    price: 32,
    stock: 4,
    available: true,
    description: "A curious, friendly Speckled Sussex with beautiful speckled plumage, ready to join a happy backyard flock.",
    image: "Image/Speckled Sussex.jpg",
    traits: ["Friendly nature", "Good foragers"],
  },
  {
    id: "buff-orpington",
    name: "Buff Orpington",
    breed: "Buff Orpington",
    age: 5,
    price: 38,
    stock: 3,
    available: true,
    description: "A calm, gentle Buff Orpington with soft golden feathers and a lovely temperament.",
    image: "Image/Buff Orpington.jpg",
    traits: ["Calm & gentle", "Family favorite"],
  },
  {
    id: "barred-plymouth-rock",
    name: "Barred Plymouth Rock",
    breed: "Barred Plymouth Rock",
    age: 5,
    price: 36,
    stock: 3,
    available: true,
    description: "A steady, friendly Barred Plymouth Rock with distinctive black-and-white barred plumage.",
    image: "Image/Barred Plymouth Rock.jpg",
    traits: ["Easygoing", "Hardy backyard bird"],
  },
  {
    id: "rhode-island-red",
    name: "Rhode Island Red",
    breed: "Rhode Island Red",
    age: 6,
    price: 42,
    stock: 2,
    available: true,
    description: "A confident Rhode Island Red with rich red-brown feathers and a lively, dependable nature.",
    image: "Image/Rhode Island Red.jpg",
    traits: ["Confident & curious", "Reliable layer"],
  },
];

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const formatPrice = (price) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
const safeImage = (url) => {
  try {
    const parsed = new URL(url, window.location.href);
    return ["file:", "http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.error(`Could not read ${key} from browser storage.`, error);
    showToast("Saved browser data could not be read.", true);
    return fallback;
  }
}

let products = readStorage(STORAGE_KEYS.products, defaultProducts);
if (!Array.isArray(products)) products = defaultProducts;
const newProducts = requestedProducts.filter((product) => !products.some((existing) => existing.id === product.id));
if (newProducts.length) {
  products = [...products, ...newProducts];
  persist(STORAGE_KEYS.products, products);
}
let activeCategory = "all";
let toastTimer;

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Could not save ${key} to browser storage.`, error);
    showToast("Could not save changes in this browser.", true);
    return false;
  }
  return true;
}

function showToast(message, isError = false) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.toggle("error", isError);
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

function ageLabel(age) {
  return age >= 6 ? "6+ months" : `${age} months`;
}

function getProduct(id) {
  return products.find((product) => product.id === id);
}

function renderCounts() {
  $("#count-all").textContent = products.length;
  $("#count-4").textContent = products.filter((product) => Number(product.age) === 4).length;
  $("#count-5").textContent = products.filter((product) => Number(product.age) === 5).length;
  $("#count-6").textContent = products.filter((product) => Number(product.age) >= 6).length;
}

function renderProducts() {
  const search = $("#product-search").value.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesAge = activeCategory === "all" || (activeCategory === "6" ? Number(product.age) >= 6 : Number(product.age) === Number(activeCategory));
    const matchesSearch = `${product.name} ${product.breed} ${product.description}`.toLowerCase().includes(search);
    return matchesAge && matchesSearch;
  });
  const grid = $("#product-grid");
  grid.innerHTML = filtered.map((product) => {
    const available = product.available && Number(product.stock) > 0;
    const image = safeImage(product.image);
    return `<article class="product-card">
      <div class="product-image-wrap">
        <button type="button" class="product-photo-button" data-detail="${escapeHtml(product.id)}" aria-label="View ${escapeHtml(product.name)} details">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(`${product.breed} chicken called ${product.name}`)}" loading="lazy" />
        <span class="product-badge ${available ? "" : "sold-out"}">${available ? `${escapeHtml(ageLabel(Number(product.age)))} · ${Number(product.stock)} available` : "Currently unavailable"}</span>
        </button>
      </div>
      <div class="product-meta">
        <div class="product-topline"><h3 class="product-name">${escapeHtml(product.name)}</h3><span class="product-price">${formatPrice(Number(product.price))}</span></div>
        <div class="product-breed">${escapeHtml(product.breed)} · ${escapeHtml(ageLabel(Number(product.age)))}</div>
        <button type="button" class="product-detail-link" data-detail="${escapeHtml(product.id)}">Meet ${escapeHtml(product.name)} <span>→</span></button>
      </div>
    </article>`;
  }).join("");
  $("#empty-state").hidden = filtered.length > 0;
  renderCounts();
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function openDetails(id) {
  const product = getProduct(id);
  if (!product) return;
  const available = product.available && Number(product.stock) > 0;
  $("#detail-content").innerHTML = `<div class="detail-layout">
    <div class="detail-image"><img src="${escapeHtml(safeImage(product.image))}" alt="${escapeHtml(product.breed)}" /></div>
    <div class="detail-copy">
      <div class="eyebrow"><span class="eyebrow-line"></span> ${available ? "A happy hen, ready for home" : "A little hen, not available just now"}</div>
      <h2>${escapeHtml(product.name)}</h2>
      <div class="detail-breed">${escapeHtml(product.breed)}</div>
      <div class="detail-price">${formatPrice(Number(product.price))}</div>
      <p class="detail-description">${escapeHtml(product.description)}</p>
      <div class="detail-facts"><span class="detail-fact">${escapeHtml(ageLabel(Number(product.age)))}</span><span class="detail-fact">${available ? `${Number(product.stock)} available` : "Out of stock"}</span>${(product.traits || []).map((trait) => `<span class="detail-fact">${escapeHtml(trait)}</span>`).join("")}</div>
    </div>
  </div>`;
  $("#detail-dialog").showModal();
}

function renderAdmin() {
  const available = products.filter((product) => product.available && Number(product.stock) > 0).length;
  $("#admin-stats").innerHTML = `<strong>${products.length}</strong> listings <span>·</span> <strong>${available}</strong> available`;
  $("#admin-list").innerHTML = products.length ? products.map((product) => `<div class="admin-row">
    <img src="${escapeHtml(safeImage(product.image))}" alt="" />
    <div><h3>${escapeHtml(product.name)}</h3><small>${escapeHtml(product.breed)} · ${escapeHtml(ageLabel(Number(product.age)))} · ${Number(product.stock)} in stock${product.available ? "" : " · unavailable"}</small></div>
    <span class="admin-row-price">${formatPrice(Number(product.price))}</span>
    <div class="admin-row-actions"><button data-edit="${escapeHtml(product.id)}">Edit</button><button class="delete-product" data-delete="${escapeHtml(product.id)}">Delete</button></div>
  </div>`).join("") : `<div class="admin-empty">No chicken listings yet. Add your first chicken above.</div>`;
}

function openProductForm(product = null) {
  const form = $("#product-form");
  form.reset();
  form.elements.id.value = product?.id || "";
  form.elements.name.value = product?.name || "";
  form.elements.breed.value = product?.breed || "";
  form.elements.age.value = String(product?.age || 4);
  form.elements.price.value = product?.price ?? "";
  form.elements.stock.value = product?.stock ?? "";
  form.elements.image.value = product?.image || "";
  form.elements.description.value = product?.description || "";
  form.elements.available.checked = product?.available ?? true;
  $("#form-title").innerHTML = product ? "Edit a <em>chicken.</em>" : "Add a <em>chicken.</em>";
  $("#product-form-dialog").showModal();
}

$("#category-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  $$(".category-tab").forEach((tab) => tab.classList.toggle("active", tab === button));
  renderProducts();
});

$("#product-search").addEventListener("input", renderProducts);
$("#product-grid").addEventListener("click", (event) => {
  const details = event.target.closest("[data-detail]");
  if (details) openDetails(details.dataset.detail);
});

$("#admin-trigger").addEventListener("click", () => {
  renderAdmin();
  $("#admin-dialog").showModal();
});
$("#add-product").addEventListener("click", () => openProductForm());
$("#admin-list").addEventListener("click", (event) => {
  const edit = event.target.closest("[data-edit]");
  const remove = event.target.closest("[data-delete]");
  if (edit) openProductForm(getProduct(edit.dataset.edit));
  if (remove) {
    const product = getProduct(remove.dataset.delete);
    if (!product || !window.confirm(`Remove ${product.name} from your chicken listings?`)) return;
    products = products.filter((entry) => entry.id !== product.id);
    if (!persist(STORAGE_KEYS.products, products)) return;
    renderAdmin();
    renderProducts();
    showToast(`${product.name} removed from listings.`);
  }
});

$("#product-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const image = safeImage(values.get("image"));
  const price = Number(values.get("price"));
  const stock = Number(values.get("stock"));
  const name = String(values.get("name")).trim();
  const breed = String(values.get("breed")).trim();
  const description = String(values.get("description")).trim();
  if (!image || !name || !breed || !description || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    showToast("Please check the listing details and photo URL.", true);
    return;
  }
  const id = String(values.get("id") || `chicken-${Date.now()}`);
  const previous = getProduct(id);
  const product = {
    id, name, breed, age: Number(values.get("age")), price, stock,
    image, description, available: values.get("available") === "on",
    traits: previous?.traits || [],
  };
  const nextProducts = previous ? products.map((entry) => entry.id === id ? product : entry) : [...products, product];
  if (!persist(STORAGE_KEYS.products, nextProducts)) return;
  products = nextProducts;
  $("#product-form-dialog").close();
  renderAdmin();
  renderProducts();
  showToast(previous ? `${name}’s listing has been updated.` : `${name} added to the flock.`);
});

$$("[data-close]").forEach((button) => button.addEventListener("click", () => {
  const dialog = document.getElementById(button.dataset.close);
  if (dialog?.open) dialog.close();
}));

$$("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

const menuToggle = $("#menu-toggle");
menuToggle.addEventListener("click", () => {
  const isOpen = $("#main-nav").classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
$("#main-nav").addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    $("#main-nav").classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
$("#year").textContent = new Date().getFullYear();
renderProducts();
