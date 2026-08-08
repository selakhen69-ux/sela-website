// ===============================
// Telegram Settings
// ===============================
const BOT_TOKEN = "8920437438:AAGfKDgZ6SEy_jwUkshhoR7WqQuPNIDsN5w";
const CHAT_ID = "8183785692";

// ===============================
// Cart
// ===============================
let cart = [];

// ➕ Add to Cart
function addToCart(name, price) {
    cart.push({
        name: name,
        price: price
    });

    showCart();

    alert("✅ បានបន្ថែម " + name + " ទៅក្នុងកន្ត្រក!");
}

// ❌ Remove Item
function removeItem(index) {
    cart.splice(index, 1);
    showCart();
}

// 🗑 Clear Cart
function clearCart() {
    cart = [];
    showCart();
}

// 📦 Show Cart
function showCart() {
    const cartDiv = document.getElementById("cart");

    if (!cartDiv) return;

    if (cart.length === 0) {
        cartDiv.innerHTML = "🛒 កន្ត្រកទទេ";
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item, index) => {

        html += `
            <p>
                ${index + 1}. ${item.name} - $${item.price}
                <button onclick="removeItem(${index})"
                style="background:red;color:white;border:none;padding:5px 10px;border-radius:5px;margin-left:10px;">
                    ❌ Remove
                </button>
            </p>
        `;

        total += Number(item.price);
    });

    html += `
        <hr>
        <h3>💰 សរុប៖ $${total}</h3>
        <button onclick="clearCart()" 
        style="background:black;color:white;padding:8px 15px;border:none;border-radius:5px;">
            🗑 Clear Cart
        </button>
    `;

    cartDiv.innerHTML = html;
}

// ===============================
// QR Popup
// ===============================
function openQR() {
    if (cart.length === 0) {
        alert("⚠️ សូមជ្រើសរើសសៀវភៅជាមុនសិន!");
        return;
    }

    document.getElementById("qrModal").style.display = "block";
}

function closeQR() {
    document.getElementById("qrModal").style.display = "none";
}

// ===============================
// Confirm Order + Telegram
// ===============================
async function confirmOrder() {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    if (!name || !phone || !address) {
        alert("⚠️ សូមបំពេញព័ត៌មានអោយពេញ!");
        return;
    }

    if (cart.length === 0) {
        alert("⚠️ មិនមានសៀវភៅក្នុងកន្ត្រកទេ!");
        return;
    }

    let total = 0;
    let products = "";

    cart.forEach((item, index) => {
        products += `${index + 1}. ${item.name} - $${item.price}\n`;
        total += Number(item.price);
    });

    const message = `📚 NEW BOOK ORDER

👤 ឈ្មោះ: ${name}
📞 ទូរស័ព្ទ: ${phone}
📍 អាសយដ្ឋាន: ${address}

📦 សៀវភៅ:
${products}
💰 សរុប: $${total}

💳 ស្ថានភាព: បង់ប្រាក់ជោគជ័យ ✅`;

    alert("📩 កំពុងផ្ញើ Order...");

    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message
            })
        });

        const data = await response.json();

        if (data.ok) {
            alert("🎉 ផ្ញើទៅ Telegram ជោគជ័យ!");

            cart = [];
            showCart();

            document.querySelector("form").reset();
            closeQR();
        } else {
            alert("❌ Telegram error!");
            console.error(data);
        }

    } catch (error) {
        console.error(error);
        alert("❌ Connection error!");
    }
}

// ===============================
// Prevent Reload
// ===============================
function sendOrder(event) {
    event.preventDefault();
}

// ===============================
// Close QR when click outside
// ===============================
window.onclick = function(event) {
    const modal = document.getElementById("qrModal");
    if (event.target === modal) {
        closeQR();
    }
};

// ===============================
// Start
// ===============================
showCart();