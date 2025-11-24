/***********************************
  NAVBAR ACTIVE LINK HIGHLIGHT
************************************/

const currentPage = window.location.pathname.split("/").pop();
const menuLinks = document.querySelectorAll(".nav-links a");

menuLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
    }
});


/***********************************
  SIMPLE FORM VALIDATION
************************************/
function validateLoginForm() {
    const email = document.querySelector("input[name='email']");
    const password = document.querySelector("input[name='password']");

    if (!email || !password) return true;  // for pages without forms

    if (email.value.trim() === "" || password.value.trim() === "") {
        alert("Please fill in all fields.");
        return false;
    }
    return true;
}

function validateRegisterForm() {
    const inputs = document.querySelectorAll("form input");

    if (inputs.length === 0) return true;

    for (let input of inputs) {
        if (input.value.trim() === "") {
            alert("Please fill in all fields.");
            return false;
        }
    }
    return true;
}


/***********************************
  SMOOTH SCROLL FOR SAME-PAGE LINKS
************************************/
const smoothLinks = document.querySelectorAll("a[href^='#']");

smoothLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});


/***********************************
  MOBILE MENU (optional use)
************************************/
const menuIcon = document.querySelector(".menu-icon");
const navLinksContainer = document.querySelector(".nav-links");

if (menuIcon) {
    menuIcon.addEventListener("click", () => {
        navLinksContainer.classList.toggle("show-menu");
    });
}



/***********************************
   🛒 CART SYSTEM (LOCALSTORAGE)
************************************/

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add an item to cart
function addToCart(name, price, img) {
    const item = cart.find(p => p.name === name);

    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price, img, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
}


// Load cart items on cart page
function loadCart() {
    const tableBody = document.getElementById("cartTableBody");
    const totalElement = document.getElementById("cartTotal");

    // If not on cart page, skip
    if (!tableBody || !totalElement) return;

    tableBody.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const row = `
            <tr>
                <td><img src="${item.img}" width="60"> ${item.name}</td>
                <td>${item.price}</td>
                <td>
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    ${item.qty}
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </td>
                <td>${item.price * item.qty}</td>
                <td><button class="remove-btn" onclick="removeItem(${index})">X</button></td>
            </tr>
        `;

        tableBody.innerHTML += row;
        total += item.price * item.qty;
    });

    totalElement.innerText = total;
}


// Change item quantity
function changeQty(index, value) {
    cart[index].qty += value;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}


// Remove an item from cart
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}


// Clear full cart
function clearCart() {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
}

function goToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    window.location.href = "checkout.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("checkoutForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("fullName").value;
            const phone = document.getElementById("phone").value;
            const address = document.getElementById("address").value;
            const payment = document.getElementById("payment").value;

            const orderData = {
                customerName: name,
                phone: phone,
                address: address,
                paymentMethod: payment,
                items: cart,
                orderTime: new Date().toLocaleString()
            };

            localStorage.setItem("order", JSON.stringify(orderData));

            // Clear cart after placing order
            cart = [];
            localStorage.setItem("cart", JSON.stringify(cart));

            window.location.href = "ordersucces.html";
        });
    }
});

function farmerLogin() {
    window.location.href = "farmeraddproduct.html";
}
// ============================
// FARMER ADD PRODUCT SYSTEM
// ============================
let farmerProducts = JSON.parse(localStorage.getItem("farmerProducts")) || [];

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addProductForm");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("pName").value;
            const price = document.getElementById("pPrice").value;
            const image = document.getElementById("pImage").value;

            farmerProducts.push({
                name: name,
                price: price,
                image: image
            });

            localStorage.setItem("farmerProducts", JSON.stringify(farmerProducts));

        

            form.reset();
        });
    }
});

// ============================
// SHOW FARMER PRODUCTS
// ============================

function loadFarmerProducts() {
    const list = document.getElementById("productList");
    if (!list) return; // Not on this page

    list.innerHTML = "";

    farmerProducts.forEach((item, index) => {
        const card = `
            <div class="product-card">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Price: ₹${item.price} / kg</p>
                <button class="remove-btn" onclick="deleteFarmerProduct(${index})">Delete</button>
            </div>
        `;
        list.innerHTML += card;
    });
}

function deleteFarmerProduct(index) {
    farmerProducts.splice(index, 1);
    localStorage.setItem("farmerProducts", JSON.stringify(farmerProducts));
    loadFarmerProducts();
}

function loadCustomerProducts() {
    const container = document.getElementById("customerProductList");
    if (!container) return;

    // Load existing products added by farmer
    let farmerProducts = JSON.parse(localStorage.getItem("farmerProducts")) || [];

    farmerProducts.forEach(p => {
        const card = `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>Freshly added by farmer.</p>
                <span class="price">₹${p.price} / kg</span>
                <button class="add-cart-btn" onclick="addToCart('${p.name}', ${p.price}, '${p.image}')">Add to cart</button>
            </div>`;
        
        container.innerHTML += card;
    });
}

function customerLogin() {
    window.location.href = "product.html";
}

window.onload = function () {
    // Always load cart if cart elements exist
    loadCart();

    // If on farmer product list page
    if (window.location.href.includes("farmerproducts.html")) {
        loadFarmerProducts();
    }

    // If on customer product page
    if (window.location.href.includes("product.html")) {
        loadCustomerProducts();
    }
};

function goToCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    window.location.href = "checkout.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("checkoutForm");

    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            let orderData = new FormData();

            orderData.append("full_name", document.getElementById("fullName").value);
            orderData.append("phone", document.getElementById("phone").value);
            orderData.append("address", document.getElementById("address").value);
            orderData.append("cart", JSON.stringify(cart));

            let response = await fetch("http://localhost/Farm2Home/backend/place_order.php", {
                method: "POST",
                body: orderData
            });

            let result = await response.text();

            if (result.trim() === "SUCCESS") {
                cart = [];
                localStorage.setItem("cart", JSON.stringify(cart));
                window.location.href = "http://localhost/Farm2Home/ordersucces.html";
            } else {
                alert("Error placing order: " + result);
            }
        });
    }
});



