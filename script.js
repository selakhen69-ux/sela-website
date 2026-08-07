// ===============================
// Telegram Settings
// ===============================

const BOT_TOKEN = "8957383635:AAEm-_fOaoM_uI_y_6t4xTio9HCdOkDwzi4";
const CHAT_ID = "8845329448";


// ===============================
// Cart
// ===============================

let cart = [];


// បន្ថែមសៀវភៅ
function addToCart(name, price) {

    cart.push({
        name: name,
        price: price
    });

    showCart();

    alert("✅ បានបន្ថែម " + name + " ទៅក្នុងកន្ត្រក!");
}


// បង្ហាញកន្ត្រក
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
            </p>
        `;

        total += Number(item.price);
    });

    html += `
        <hr>
        <h3>💰 សរុប៖ $${total}</h3>
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
// Confirm Payment
// ===============================

async function confirmOrder() {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    // ពិនិត្យព័ត៌មានអតិថិជន
    if (!name || !phone || !address) {

        alert("⚠️ សូមបំពេញ ឈ្មោះ លេខទូរស័ព្ទ និងអាសយដ្ឋាន!");
        return;
    }


    // ពិនិត្យកន្ត្រក
    if (cart.length === 0) {

        alert("⚠️ មិនមានសៀវភៅក្នុងកន្ត្រកទេ!");
        return;
    }


    // ===============================
    // បង្កើត Order
    // ===============================

    let total = 0;

    let products = "";

    cart.forEach((item, index) => {

        products += `${index + 1}. ${item.name} - $${item.price}\n`;

        total += Number(item.price);
    });


    const message =
`📚 NEW BOOK ORDER

👤 ឈ្មោះ: ${name}
📞 ទូរស័ព្ទ: ${phone}
📍 អាសយដ្ឋាន: ${address}

📦 សៀវភៅ:
${products}
💰 សរុប: $${total}

💳 ស្ថានភាព: បង់ប្រាក់ជោគជ័យ ✅`;



    // ===============================
    // Alert Payment Success
    // ===============================

    alert("📩 ការបញ្ជាទិញត្រូវបានផ្ញើទៅហាង!\n\nសូមរង់ចាំការបញ្ជាក់ពីហាង។");

    // ===============================
    // Send Telegram
    // ===============================

    try {

        const url =
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

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

            alert("🎉 ការបញ្ជាទិញបានផ្ញើទៅ Telegram ជោគជ័យ!");

            // សម្អាតកន្ត្រក
            cart = [];

            showCart();

            // សម្អាត Form
            document.querySelector("form").reset();

            // បិទ QR
            closeQR();

        } else {

            console.error(data);

            alert("❌ ផ្ញើទៅ Telegram មិនបានជោគជ័យ!");

        }

    } catch (error) {

        console.error(error);

        alert("❌ មានបញ្ហាក្នុងការភ្ជាប់ Telegram!");

    }
}


// ===============================
// Prevent Form Submit
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