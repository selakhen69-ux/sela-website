function buy(product) {
  alert("You selected: " + product);
}

function filterProduct(category) {
  let cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    if (category === "all") {
      card.style.display = "block";
    } else {
      if (card.getAttribute("data-category") === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    }
  });
}
document.getElementById("orderForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let order = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    product: document.getElementById("product").value
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);

  localStorage.setItem("orders", JSON.stringify(orders));

  alert("Order saved!");
});
function viewOrders() {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  console.log(orders);
  alert("Check console (F12) to see orders");
}