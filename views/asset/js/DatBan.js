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
  if (avatar) {
    document.getElementById("navbarAvatar").src = avatar;
  }
  if (employeeCode) {
    document.getElementById("employeeCode").textContent = ` ${employeeCode}`;
  }
  renderTables();
});

// Dữ liệu bàn từ JS
let tables = JSON.parse(localStorage.getItem("tables")) || [
  { id: 1, seats: 2, status: "trong" },
  { id: 2, seats: 2, status: "trong" },
  { id: 3, seats: 4, status: "khach" },
  { id: 4, seats: 4, status: "trong" },
  { id: 5, seats: 4, status: "phucvu" },
  { id: 6, seats: 8, status: "trong" },
  { id: 7, seats: 6, status: "khach" },
  { id: 8, seats: 4, status: "phucvu" },
  { id: 9, seats: 8, status: "trong" },
  { id: 10, seats: 7, status: "khach" }
];

// Hiển thị danh sách bàn
function renderTables() {
  const tableContainer = document.getElementById("table-list");
  tableContainer.innerHTML = "";
  tables.forEach(table => {
    const statusText = {
      "trong": "Trống 🟢",
      "phucvu": "Đang phục vụ 🟡",
      "khach": "Đã có khách 🔴"
    };
    const statusColor = table.status === "trong" ? "success" : table.status === "phucvu" ? "warning" : "danger";

    let actionButtons = "";
    if (table.status === "trong") {
      actionButtons = `<button class="btn btn-custom-edit" onclick="editTable(${table.id})">Sửa</button>`;
    } else if (table.status === "phucvu") {
      actionButtons = `<button class="btn btn-custom-order" onclick="orderFood(${table.id})">Đặt Món</button>`;
    } else if (table.status === "khach") {
      actionButtons = `<button class="btn btn-custom-edit" onclick="editTable(${table.id})">Sửa</button>`;
    }

    tableContainer.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card table-card">
          <div class="card-body">
            <div>
              <h5 class="card-title">Bàn ${table.id} - ${table.seats} ghế</h5>
              <p class="card-text"><span class="badge bg-${statusColor}">${statusText[table.status]}</span></p>
            </div>
            <div class="btn-group">
              ${actionButtons}
              <button class="btn btn-custom-delete" onclick="deleteTable(${table.id})">Xóa</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  localStorage.setItem("tables", JSON.stringify(tables));
}

// Mở modal thêm bàn mới
function openAddTableModal() {
  document.getElementById("newTableId").value = "";
  document.getElementById("newTableSeats").value = "";
  document.getElementById("newTableStatus").value = "trong";
  new bootstrap.Modal(document.getElementById("addTableModal")).show();
}

// Thêm bàn mới
function addNewTable() {
  const newId = parseInt(document.getElementById("newTableId").value);
  const newSeats = parseInt(document.getElementById("newTableSeats").value);
  const newStatus = document.getElementById("newTableStatus").value;

  if (!newId || !newSeats || newId <= 0 || newSeats <= 0) {
    alert("Vui lòng nhập số bàn và số ghế hợp lệ!");
    return;
  }

  if (tables.some(table => table.id === newId)) {
    alert("Số bàn đã tồn tại! Vui lòng chọn số bàn khác.");
    return;
  }

  tables.push({ id: newId, seats: newSeats, status: newStatus });
  renderTables();
  bootstrap.Modal.getInstance(document.getElementById("addTableModal")).hide();
  alert("Thêm bàn mới thành công!");
}

// Mở modal cập nhật trạng thái (cho bàn trống) - Không còn dùng
function openUpdateModal(id) {
  const table = tables.find(t => t.id === id);
  document.getElementById("tableId").value = table.id;
  document.getElementById("tableSeats").value = table.seats;
  document.getElementById("tableStatus").value = table.status;
  document.getElementById("updateTableModalLabel").textContent = "Cập nhật trạng thái bàn " + table.id;
  document.getElementById("tableSeats").disabled = true;
  document.getElementById("tableStatus").disabled = false;
  document.querySelector("#updateTableForm button").textContent = "Lưu thay đổi";
  document.querySelector("#updateTableForm button").onclick = () => saveTableChanges();
  new bootstrap.Modal(document.getElementById("updateTableModal")).show();
}

// Mở modal thanh toán (trên danh sách bàn) - Không còn dùng trực tiếp từ danh sách
function openPaymentModal(id) {
  const table = tables.find(t => t.id === id);
  document.getElementById("tableId").value = table.id;
  document.getElementById("tableSeats").value = table.seats;
  document.getElementById("tableStatus").value = table.status;
  document.getElementById("updateTableModalLabel").textContent = "Thanh toán bàn " + table.id;
  document.getElementById("tableSeats").disabled = true;
  document.getElementById("tableStatus").disabled = true;
  document.querySelector("#updateTableForm button").textContent = "Xác nhận Thanh toán";
  document.querySelector("#updateTableForm button").onclick = () => payTable();
  new bootstrap.Modal(document.getElementById("updateTableModal")).show();
}

// Xác nhận thanh toán và chuyển trạng thái bàn về "trống"
function payTable() {
  const tableId = parseInt(document.getElementById("tableId").value);
  const table = tables.find(t => t.id === tableId);
  if (table) {
    const orderIndex = orders.findIndex(o => o.table === tableId && o.status === "Chưa giao");
    if (orderIndex !== -1) {
      orders.splice(orderIndex, 1);
    }
    table.status = "trong";
    renderTables();
    bootstrap.Modal.getInstance(document.getElementById("updateTableModal")).hide();
    alert("Thanh toán thành công! Bàn đã được đặt lại thành trống.");
  }
}

// Mở modal sửa bàn
function editTable(id) {
  const table = tables.find(t => t.id === id);
  document.getElementById("tableId").value = table.id;
  document.getElementById("tableSeats").value = table.seats;
  document.getElementById("tableStatus").value = table.status;
  document.getElementById("updateTableModalLabel").textContent = "Sửa thông tin bàn";
  document.getElementById("tableSeats").disabled = false;
  document.getElementById("tableStatus").disabled = false;
  document.querySelector("#updateTableForm button").textContent = "Lưu thay đổi";
  document.querySelector("#updateTableForm button").onclick = () => saveTableChanges();
  new bootstrap.Modal(document.getElementById("updateTableModal")).show();
}

// Lưu thay đổi bàn
function saveTableChanges() {
  const tableId = parseInt(document.getElementById("tableId").value);
  const newSeats = parseInt(document.getElementById("tableSeats").value);
  const newStatus = document.getElementById("tableStatus").value;
  const table = tables.find(t => t.id === tableId);
  if (table) {
    table.seats = newSeats;
    table.status = newStatus;
    renderTables();
    bootstrap.Modal.getInstance(document.getElementById("updateTableModal")).hide();
  }
}

// Xóa bàn
function deleteTable(id) {
  if (confirm("Bạn có chắc muốn xóa bàn này?")) {
    tables = tables.filter(t => t.id !== id);
    renderTables();
  }
}

// Dữ liệu món ăn
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
  { name: "Phở", price: 50000, img: "./img/pho.webp", available: true }
];

const chefInvoices = [
  { tableId: 1, dishes: [{ name: "Bánh Cuốn", quantity: 2, price: 40000 }, { name: "Chả Giò", quantity: 3, price: 35000 }], status: "Đang chế biến" },
  { tableId: 2, dishes: [{ name: "Phở", quantity: 1, price: 50000 }, { name: "Cơm Tấm", quantity: 2, price: 45000 }], status: "Đã giao" },
  { tableId: 1, dishes: [{ name: "Bún Bò Huế", quantity: 2, price: 55000 }, { name: "Nem Rán", quantity: 1, price: 30000 }], status: "Đã giao" }
];

let selectedTable = "";
let cart = [];
let orders = [];

// Dữ liệu lịch sử thanh toán
let paymentHistory = JSON.parse(localStorage.getItem("paymentHistory")) || [];

// Lưu vào localStorage khi có thay đổi
function savePaymentHistory() {
  localStorage.setItem("paymentHistory", JSON.stringify(paymentHistory));
}

function orderFood(tableId) {
  selectedTable = tableId;
  document.getElementById("selectedTable").innerText = tableId;
  renderMenu();
  new bootstrap.Modal(document.getElementById("orderModal")).show();
}

function renderMenu() {
  let menuHTML = "";
  menuItems.forEach((item, index) => {
    menuHTML += `
      <div class="col-md-4 col-lg-3 mb-4">
        <div class="card h-100 shadow-sm">
          <div class="position-relative">
            <img src="${item.img}" class="card-img-top" alt="${item.name}">
            ${item.available ? '' : `<div class="badge bg-danger position-absolute top-0 end-0 m-2">Hết món</div>`}
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text fw-bold">${item.price.toLocaleString()}đ</p>
            <div class="mt-auto">
              <button class="btn btn-${item.available ? 'primary' : 'secondary'} w-100" 
                      onclick="addToCart(${index})" ${item.available ? '' : 'disabled'}>
                ${item.available ? 'Thêm vào giỏ' : 'Hết món'}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  document.getElementById("menu-container").innerHTML = menuHTML;
}

function addToCart(index) {
  if (!selectedTable) {
    alert("Vui lòng chọn bàn trước khi đặt món!");
    return;
  }
  let item = menuItems[index];
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
      </li>
    `;
  });
  document.getElementById("cart-items").innerHTML = cartHTML;
  document.getElementById("cart-total").innerText = total.toLocaleString();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function placeOrder() {
  if (!selectedTable) {
    alert("Vui lòng chọn bàn trước khi đặt đơn!");
    return;
  }
  if (cart.length === 0) {
    alert("Giỏ hàng đang trống! Hãy thêm món trước khi đặt hàng.");
    return;
  }
  let now = new Date();
  let note = document.getElementById("order-note").value;
  let orderItems = cart.map(item => ({
    name: item.name,
    quantity: item.quantity
  }));
  let newOrder = {
    id: now.getTime(),
    table: parseInt(selectedTable),
    items: orderItems,
    status: "Chưa giao",
    orderTime: now.toLocaleString(),
    note: note
  };
  orders.push(newOrder);

  const table = tables.find(t => t.id === parseInt(selectedTable));
  if (table) {
    table.status = "phucvu";
  }

  alert("Đặt món thành công!");
  cart = [];
  updateCart();
  document.getElementById("order-note").value = "";
  bootstrap.Modal.getInstance(document.getElementById("orderModal")).hide();
  renderTables();
}

function renderTableList() {
  const tableListContainer = document.getElementById("tableList");
  tableListContainer.innerHTML = "";
  const tableIds = [...new Set(chefInvoices.map(invoice => invoice.tableId))];
  tableIds.forEach(tableId => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary";
    btn.textContent = `Bàn ${tableId}`;
    btn.onclick = () => showOrderHistory(tableId);
    tableListContainer.appendChild(btn);
  });
}

function showOrderHistory(tableId) {
  document.getElementById("tableListContainer").style.display = "none";
  document.getElementById("orderDetailsContainer").style.display = "block";
  document.getElementById("paymentHistoryContainer").style.display = "none";
  document.getElementById("selectedTableTitle").textContent = `Lịch sử đơn hàng - Bàn ${tableId}`;
  const tableBody = document.getElementById("orderHistoryTableBody");
  tableBody.innerHTML = "";
  const ordersForTable = chefInvoices.filter(invoice => invoice.tableId === tableId);
  ordersForTable.forEach(invoice => {
    invoice.dishes.forEach(dish => {
      const row = document.createElement("tr");
      let statusColor = invoice.status === "Đang chế biến" ? "text-warning" : invoice.status === "Đã giao" ? "text-success" : "text-primary";
      row.innerHTML = `
        <td>${dish.name}</td>
        <td>${dish.quantity}</td>
        <td>${dish.price.toLocaleString()}đ</td>
        <td class="${statusColor} fw-bold">${invoice.status}</td>
      `;
      tableBody.appendChild(row);
    });
  });
  const paymentBtnRow = document.createElement("tr");
  paymentBtnRow.innerHTML = `
    <td colspan="4" class="text-end">
      <button class="btn btn-primary" onclick="openPaymentModalFromHistory(${tableId})">Thanh Toán</button>
    </td>
  `;
  tableBody.appendChild(paymentBtnRow);
}

// Hiển thị modal chọn phương thức thanh toán
function showPaymentMethodModal() {
  new bootstrap.Modal(document.getElementById("paymentMethodModal")).show();
}

// Xác nhận phương thức thanh toán
function confirmPaymentMethod() {
  const selectedMethod = document.querySelector('#paymentMethodModal input[name="paymentMethod"]:checked').value;
  const tableId = parseInt(document.getElementById("paymentTableId").textContent);

  bootstrap.Modal.getInstance(document.getElementById("paymentMethodModal")).hide();

  if (selectedMethod === "cash") {
    showConfirmPaymentModal();
  } else if (selectedMethod === "bankTransfer") {
    document.getElementById("paymentDetails").style.display = "block";
  }
}

// Mở modal thanh toán từ lịch sử
function openPaymentModalFromHistory(tableId) {
  const ordersForTable = chefInvoices.filter(invoice => invoice.tableId === tableId);
  document.getElementById("paymentTableId").textContent = tableId;
  document.getElementById("paymentTableIdNote").textContent = tableId;
  const tableBody = document.getElementById("paymentTableBody");
  tableBody.innerHTML = "";
  let total = 0;

  ordersForTable.forEach(invoice => {
    invoice.dishes.forEach(dish => {
      const dishTotal = dish.price * dish.quantity;
      total += dishTotal;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${dish.name}</td>
        <td>${dish.quantity}</td>
        <td>${dish.price.toLocaleString()}đ</td>
        <td>${dishTotal.toLocaleString()}đ</td>
      `;
      tableBody.appendChild(row);
    });
  });

  document.getElementById("paymentTotal").textContent = total.toLocaleString();
  document.getElementById("paymentDetails").style.display = "none";
  document.getElementById("confirmPaymentBtn").style.display = "block";
  new bootstrap.Modal(document.getElementById("paymentModal")).show();
}

// Hiển thị modal xác nhận thanh toán cuối cùng
function showConfirmPaymentModal() {
  const tableId = document.getElementById("paymentTableId").textContent;
  document.getElementById("confirmTableIdModal").textContent = tableId;
  new bootstrap.Modal(document.getElementById("confirmPaymentModal")).show();
}

// Hoàn tất thanh toán
function finalizePayment() {
  const tableId = parseInt(document.getElementById("paymentTableId").textContent);
  const ordersForTable = chefInvoices.filter(invoice => invoice.tableId === tableId);
  const total = parseInt(document.getElementById("paymentTotal").textContent.replace(/[^0-9]/g, ""));
  const paymentTime = new Date().toLocaleString();
  const selectedMethod = document.querySelector('#paymentMethodModal input[name="paymentMethod"]:checked')?.value || "cash";

  const paymentEntry = {
    tableId: tableId,
    total: total,
    dishes: ordersForTable.flatMap(invoice => invoice.dishes.map(dish => ({
      name: dish.name,
      quantity: dish.quantity,
      price: dish.price
    }))),
    paymentTime: paymentTime,
    method: selectedMethod
  };
  paymentHistory.push(paymentEntry);
  savePaymentHistory();

  ordersForTable.forEach(invoice => {
    invoice.status = "Đã thanh toán";
  });

  const table = tables.find(t => t.id === tableId);
  if (table) {
    table.status = "trong";
  }

  renderTables();
  alert(`Thanh toán đã được xác nhận cho bàn ${tableId} bằng ${selectedMethod === "cash" ? "tiền mặt" : "chuyển khoản"}!`);
  bootstrap.Modal.getInstance(document.getElementById("confirmPaymentModal")).hide();
  bootstrap.Modal.getInstance(document.getElementById("paymentModal")).hide();
}

function showOrderDetails() {
  document.getElementById("paymentHistoryContainer").style.display = "none";
  document.getElementById("orderDetailsContainer").style.display = "block";
}

function showTableList() {
  document.getElementById("orderDetailsContainer").style.display = "none";
  document.getElementById("paymentHistoryContainer").style.display = "none";
  document.getElementById("tableListContainer").style.display = "block";
}

document.getElementById("orderHistoryModal").addEventListener("show.bs.modal", renderTableList);