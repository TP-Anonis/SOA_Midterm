const menuItems = [
  { name: "Bánh Cuốn", price: 40000, img: "./img/BanhCuon.jpg", available: true },
  { name: "Bánh Mì", price: 25000, img: "./img/Banhmi.jpg", available: true },
  { name: "Bún Bò", price: 40000, img: "./img/BunBo.jpg", available: false },
  { name: "Bánh Xèo", price: 20000, img: "./img/BanhXeo.jpg", available: true },
  { name: "Bún Đậu", price: 80000, img: "./img/BunDau.jpg", available: false },
  { name: "Bún Riêu", price: 40000, img: "./img/BunRieu.jpg", available: true },
  { name: "Chả Giò", price: 40000, img: "./img/ChaGio.jpg", available: true },
  { name: "Cháo Gà", price: 40000, img: "./img/ChaoGa.jpg", available: true },
  { name: "Cơm Tấm", price: 50000, img: "./img/Comtam.jpg", available: true },
  { name: "Phở", price: 50000, img: "./img/pho.webp", available: true },
  { name: "Xôi", price: 30000, img: "./img/Xoi.jpg", available: false },
  { name: "Bánh Chưng", price: 60000, img: "./img/banhchung.jpg", available: true },
  { name: "Cơm Chiên Dương Châu", price: 50000, img: "./img/ComchienDuongChau.jpg", available: true },
  { name: "Nem Nướng", price: 80000, img: "./img/NemNuong.jpg", available: true },
  { name: "Cơm Chiên Hải Sản", price: 40000, img: "./img/ComChienHaiSan.jpg", available: false },
  { name: "Gỏi Cuốn", price: 40000, img: "./img/GoiCuon.jpg", available: true }
];
  let selectedTable = ""; // Lưu bàn đã chọn
let cart = [];
let orders = [];

function enableMenu() {
selectedTable = document.getElementById("table-select").value;
if (selectedTable) {
  document.getElementById("menu-container").style.pointerEvents = "auto";
} else {
  document.getElementById("menu-container").style.pointerEvents = "none";
}
}

// Render thực đơn như cũ
function renderMenu() {
  let menuHTML = "";
  menuItems.forEach((item, index) => {
      menuHTML += `
          <div class="col-md-4 col-lg-3">
              <div class="menu-item card p-2 shadow-sm">
                  <img src="${item.img}" alt="${item.name}">
                  <h5 class="mt-2">${item.name}</h5>
                  <p class="fw-bold">${item.price.toLocaleString()}đ</p>
                  <button class="btn ${item.available ? 'btn-success' : 'btn-secondary'}" 
                      onclick="addToCart(${index})" ${item.available ? '' : 'disabled'}>
                      ${item.available ? 'Đặt món' : 'Hết hàng'}
                  </button>
              </div>
          </div>`;
  });
  document.getElementById("menu-container").innerHTML = menuHTML;
}

function addToCart(index) {
  if (!selectedTable) {
      alert("Vui lòng chọn bàn trước khi đặt món!");
      return;
  }
  let item = menuItems[index];
  if (!item.available) {
      alert("Món ăn này đã hết hàng!");
      return;
  }
  let existing = cart.find(i => i.name === item.name);
  if (existing) {
      existing.quantity++;
  } else {
      cart.push({ ...item, quantity: 1 });
  }
  updateCart();
}

function updateCart() {
  let cartHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
      total += item.price * item.quantity;
      cartHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
              <span>${item.name} x${item.quantity}</span>
              <span>${(item.price * item.quantity).toLocaleString()}đ</span>
              <button class="btn btn-sm btn-danger" onclick="removeFromCart(${i})">Xóa</button>
          </li>`;
  });
  document.getElementById("cart-items").innerHTML = cartHTML;
  document.getElementById("cart-total").innerText = total.toLocaleString();
  document.getElementById("cart-count").innerText = cart.length;
}

function removeFromCart(index) {
cart.splice(index, 1);
updateCart();
}

function clearCart() {
cart = [];
updateCart();
}

function toggleCart() {
document.getElementById("cart").classList.toggle("show");
}

function showNoteInput() {
  document.getElementById("add-note-text").style.display = "none";
  document.getElementById("order-note").style.display = "block";
  document.getElementById("order-note").focus();
}


function enableMenu() {
    selectedTable = document.getElementById("table-select").value;
}

function toggleNote() {
    let noteContainer = document.getElementById("note-container");
    let noteInput = document.getElementById("order-note");
    let noteText = document.getElementById("note-text");

    if (noteContainer.style.display === "none" || noteContainer.style.display === "") {
        noteContainer.style.display = "block";
        noteInput.style.display = "block";
        noteText.style.display = "none";
        noteInput.focus();
    } else {
        noteContainer.style.display = "none";
        noteInput.style.display = "none";
        noteText.style.display = "block";
        noteText.innerText = "Thêm ghi chú";
    }
}

function placeOrder() {
    if (!selectedTable) {
        alert("Vui lòng chọn bàn trước khi đặt đơn!");
        return;
    }

    let orderItems = cart.map(item => ({
        name: item.name,
        quantity: item.quantity
    }));

    let orderNote = document.getElementById("order-note").value.trim();

    let newOrder = {
        id: new Date().getTime(), // ID duy nhất
        table: selectedTable,
        items: orderItems,
        note: orderNote,  // Ghi chú của đơn hàng
        status: "Chưa giao"
    };

    orders.push(newOrder); // Lưu vào biến orders trong bộ nhớ tạm

    alert("Đặt hàng thành công!");
    clearCart();
    document.getElementById("note-container").style.display = "none"; // Ẩn ghi chú sau khi đặt đơn
    document.getElementById("order-note").value = ""; // Reset ghi chú
    document.getElementById("note-text").innerText = "Thêm ghi chú";
    renderOrders(); // Cập nhật danh sách đơn hàng
}

function renderOrders() {
let orderHTML = "";
orders.forEach(order => {
  orderHTML += `
    <tr>
      <td>${order.id}</td>
      <td>Bàn ${order.table}</td>
      <td>
        <ul class="list-unstyled mb-0">
          ${order.items.map(item => `<li>${item.name} x${item.quantity}</li>`).join("")}
        </ul>
      </td>
      <td><span class="badge ${order.status === 'Chưa giao' ? 'bg-warning' : 'bg-success'}">${order.status}</span></td>
      <td>
        <button class="btn btn-sm btn-success" onclick="completeOrder(${order.id})">Hoàn thành</button>
      </td>
    </tr>
  `;
});
document.getElementById("order-history").innerHTML = orderHTML;
}

function completeOrder(orderId) {
let order = orders.find(o => o.id === orderId);
if (order) {
  order.status = "Đã giao";
  renderOrders();
}
}
function activateBootstrapTabs() {
  var tabElements = document.querySelectorAll('#navbarNav a[data-bs-toggle="tab"]');
  tabElements.forEach(function (tab) {
      tab.addEventListener('click', function (event) {
          event.preventDefault();
          var tabInstance = new bootstrap.Tab(tab);
          tabInstance.show();
      });
  });
}

document.addEventListener("DOMContentLoaded", activateBootstrapTabs);


// Gọi để render menu ngay khi tải trang
renderMenu();