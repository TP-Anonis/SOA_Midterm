// Danh sách món ăn mở rộng
let menuItems = [
  { name: "Phở bò", available: true },
  { name: "Bún chả", available: true },
  { name: "Gỏi cuốn", available: true },
  { name: "Cơm tấm", available: true },
  { name: "Bánh mì", available: false },
  { name: "Chả giò", available: true },
  { name: "Bò kho", available: true }
];

let orders = [
  { id: 1, table: 2, items: [{ name: "Phở bò", quantity: 1 }], note: "Không hành", status: "Chưa xong" },
  { id: 2, table: 3, items: [{ name: "Bún chả", quantity: 2 }], note: "Ít nước mắm", status: "Chưa xong" },
  { id: 3, table: 5, items: [{ name: "Gỏi cuốn", quantity: 3 }, { name: "Chả giò", quantity: 1 }], note: "Thêm rau", status: "Chưa xong" },
  { id: 4, table: 1, items: [{ name: "Cơm tấm", quantity: 2 }], note: "Không mỡ hành", status: "Hoàn thành" }
];

// Hàm đăng xuất
function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("employeeCode");
  localStorage.removeItem("avatar");
  window.location.href = "DangNhap.html";
}

// Hàm đổi avatar
function changeAvatar(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const newAvatar = e.target.result;
      document.getElementById("navbarAvatar").src = newAvatar;
      localStorage.setItem("avatar", newAvatar);
    };
    reader.readAsDataURL(file);
  }
}

// Hiển thị avatar và mã nhân viên khi trang tải
document.addEventListener("DOMContentLoaded", function () {
  const avatar = localStorage.getItem("avatar");
  const employeeCode = localStorage.getItem("employeeCode");
  if (avatar) document.getElementById("navbarAvatar").src = avatar;
  if (employeeCode) document.getElementById("employeeCode").textContent = `${employeeCode}`;
  renderMenu(); // Render mặc định tab "Món ăn có sẵn"
  renderOrders();
});

// Hiển thị danh sách món ăn
function renderMenu() {
  let menuList = document.getElementById("menu-list");
  menuList.innerHTML = "";
  menuList.className = "menu-container";

  menuItems.forEach((item, index) => {
    let col = document.createElement("div");
    col.className = "card menu-card shadow-sm";
    col.innerHTML = `
      <div class="card-body text-center">
        <h5 class="card-title">${item.name}</h5>
        <button class="btn ${item.available ? 'btn-success' : 'btn-danger'} mt-2" onclick="toggleAvailability(${index})">
          ${item.available ? "Bật" : "Tắt"}
        </button>
      </div>
    `;
    menuList.appendChild(col);
  });
}

// Bật/tắt trạng thái món ăn
function toggleAvailability(index) {
  menuItems[index].available = !menuItems[index].available;
  renderMenu();
}

// Tìm kiếm món ăn
function searchMenu() {
  const searchValue = document.getElementById("searchMenu").value.toLowerCase();
  let filteredMenu = menuItems.filter(item => item.name.toLowerCase().includes(searchValue));
  let menuList = document.getElementById("menu-list");
  menuList.innerHTML = "";
  menuList.className = "menu-container";

  filteredMenu.forEach((item, index) => {
    let col = document.createElement("div");
    col.className = "card menu-card shadow-sm";
    col.innerHTML = `
      <div class="card-body text-center">
        <h5 class="card-title">${item.name}</h5>
        <button class="btn ${item.available ? 'btn-success' : 'btn-danger'} mt-2" onclick="toggleAvailability(${index})">
          ${item.available ? "Còn món" : "Hết món"}
        </button>
      </div>
    `;
    menuList.appendChild(col);
  });
}

// Hiển thị danh sách đơn hàng
function renderOrders() {
  let orderList = document.getElementById("order-list");
  let completedOrderList = document.getElementById("completed-order-list");
  orderList.innerHTML = "";
  completedOrderList.innerHTML = "";

  orderList.className = "order-container";
  completedOrderList.className = "order-container";

  let pendingOrders = orders.filter(order => order.status === "Chưa xong");
  let completedOrders = orders.filter(order => order.status === "Hoàn thành");

  // Đơn hàng đang chờ
  pendingOrders.forEach(order => {
    let card = document.createElement("div");
    card.className = "card order-card";
    card.innerHTML = `
      <div class="card-header bg-warning text-white">
        <strong>Bàn ${order.table}</strong> - <span>Chưa xong</span>
      </div>
      <div class="card-body">
        <ul class="list-unstyled mb-2">
          ${order.items.map(item => `<li>${item.name} x${item.quantity}</li>`).join("")}
        </ul>
        <p class="mb-2"><strong>Ghi chú:</strong> ${order.note || "Không có"}</p>
        <button class="btn btn-sm btn-primary w-100" onclick="markOrderComplete(${order.id})">Hoàn thành</button>
      </div>
    `;
    orderList.appendChild(card);
  });

  // Đơn hàng đã hoàn thành
  completedOrders.forEach(order => {
    let card = document.createElement("div");
    card.className = "card order-card";
    card.innerHTML = `
      <div class="card-header bg-success text-white">
        <strong>Bàn ${order.table}</strong> - <span>Hoàn thành</span>
      </div>
      <div class="card-body">
        <ul class="list-unstyled mb-2">
          ${order.items.map(item => `<li>${item.name} x${item.quantity}</li>`).join("")}
        </ul>
        <p class="mb-2"><strong>Ghi chú:</strong> ${order.note || "Không có"}</p>
      </div>
    `;
    completedOrderList.appendChild(card);
  });
}

// Đánh dấu đơn hàng hoàn thành
function markOrderComplete(orderId) {
  let order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = "Hoàn thành";
    renderOrders();
  }
}