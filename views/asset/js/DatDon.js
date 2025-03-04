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
  const tables = [
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

const chefInvoices = [
    {
      tableId: 1,
      chef: "Chef Hoàng",
      dishes: [
        { name: "Bánh Cuốn", quantity: 2, price: 40000 },
        { name: "Chả Giò", quantity: 3, price: 35000 }
      ],
      status: "Đang chế biến"
    },
    {
      tableId: 2,
      chef: "Chef Lan",
      dishes: [
        { name: "Phở", quantity: 1, price: 50000 },
        { name: "Cơm Tấm", quantity: 2, price: 45000 }
      ],
      status: "Đã giao"
    },
    {
      tableId: 1,
      chef: "Chef Minh",
      dishes: [
        { name: "Bún Bò Huế", quantity: 2, price: 55000 },
        { name: "Nem Rán", quantity: 1, price: 30000 }
      ],
      status: "Đã giao"
    }
];
function renderTables() {
const tableContainer = document.getElementById("table-list");
tableContainer.innerHTML = "";

tables.forEach(table => {
const statusText = {
    "trong": "Trống 🟢",
    "phucvu": "Đang phục vụ 🟡",
    "khach": "Đã có khách 🔴"
};

let orderButton = "";
if (table.status === "phucvu") {
    orderButton = `<button class="btn btn-success mt-2" onclick="orderFood(${table.id})">Đặt Món</button>`;
}

tableContainer.innerHTML += `
    <div class="col-md-3 mb-3">
        <div class="card text-center">
            <div class="card-header">Bàn ${table.id} - ${table.seats} người</div>
            <div class="card-body">
            <p class="card-text">${statusText[table.status]}</p>
            <div class="d-grid gap-2">
                <button class="btn btn-primary" onclick="openUpdateModal(${table.id})">Cập nhật</button>
                ${orderButton}
            </div>
        </div>

        </div>
    </div>
`;
});
}


function openUpdateModal(id) {
    const table = tables.find(t => t.id === id);
    document.getElementById("tableId").value = table.id;
    document.getElementById("tableStatus").value = table.status;
    new bootstrap.Modal(document.getElementById("updateTableModal")).show();
}

function saveTableStatus() {
const tableId = parseInt(document.getElementById("tableId").value);
const newStatus = document.getElementById("tableStatus").value;

const table = tables.find(t => t.id === tableId);
if (table) {
table.status = newStatus;
renderTables();
bootstrap.Modal.getInstance(document.getElementById("updateTableModal")).hide();
}
}

function orderFood(tableId) {
alert(`Mở trang đặt món cho bàn ${tableId}`);
// Chuyển hướng đến trang đặt món
window.location.href = `./DatMon.html?table=${tableId}`;
}

renderTables();
  let selectedTable = "";
  let cart = [];
  let orders = [];
  
  function enableMenu() {
    selectedTable = document.getElementById("table-select").value;
    document.getElementById("menu-container").style.display = selectedTable ? "block" : "none";
  }
// Hàm render menu (giữ nguyên hoặc cập nhật theo code bạn đã có)
function renderMenu() {
    let menuHTML = "";
    menuItems.forEach((item, index) => {
      menuHTML += `
        <div class="col-md-4 col-lg-3 mb-4">
          <div class="card h-100 shadow-sm">
            <div class="position-relative">
              <img src="${item.img}" class="card-img-top" alt="${item.name}">
              ${item.available ? '' : `<div class="badge bg-danger position-absolute top-0 end-0 m-2">Hết hàng</div>`}
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text fw-bold">${item.price.toLocaleString()}đ</p>
              <div class="mt-auto">
                <button class="btn btn-${item.available ? 'primary' : 'secondary'} w-100" 
                        onclick="addToCart(${index})" ${item.available ? '' : 'disabled'}>
                  ${item.available ? 'Thêm vào giỏ' : 'Hết hàng'}
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
    
    // Lấy thời gian hiện tại
    let now = new Date();
    
    // Lấy nội dung ghi chú từ textarea
    let note = document.getElementById("order-note").value;
    
    let orderItems = cart.map(item => ({
      name: item.name,
      quantity: item.quantity
    }));
    
    let newOrder = {
      id: now.getTime(), // Sử dụng thời gian làm ID
      table: selectedTable,
      items: orderItems,
      status: "Chưa giao",
      orderTime: now.toLocaleString(), // Lưu thời gian đặt món
      note: note // Ghi chú món ăn
    };
    
    orders.push(newOrder);
    alert("Đặt hàng thành công!");
    // Sau khi đặt hàng, làm trống giỏ hàng và xóa nội dung ghi chú (nếu cần)
    cart = [];
    updateCart();
    renderOrders();
    
    // Xóa nội dung ghi chú sau khi đặt món (tuỳ chọn)
    document.getElementById("order-note").value = "";
  }
  

// Giả sử hàm orderFood được gọi khi nhấn nút "Đặt món" từ trang bàn
function orderFood(tableId) {
    selectedTable = tableId;
    document.getElementById("selectedTable").innerText = tableId;
    renderMenu();
    new bootstrap.Modal(document.getElementById("orderModal")).show();
  }
// Hiển thị danh sách bàn có đơn hàng
function renderTableList() {
    const tableListContainer = document.getElementById("tableList");
    tableListContainer.innerHTML = "";
  
    // Lấy danh sách bàn có trong hóa đơn
    const tableIds = [...new Set(chefInvoices.map(invoice => invoice.tableId))];
  
    // Tạo danh sách nút bàn
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
    document.getElementById("selectedTableTitle").textContent = `Lịch sử đơn hàng - Bàn ${tableId}`;

    const tableBody = document.getElementById("orderHistoryTableBody");
    tableBody.innerHTML = "";

    const orders = chefInvoices.filter(invoice => invoice.tableId === tableId);

    orders.forEach(invoice => {
        invoice.dishes.forEach(dish => {
            const row = document.createElement("tr");

            // Xác định màu sắc cho trạng thái
            let statusColor = invoice.status === "Đang chế biến" ? "text-warning" : "text-success";

            row.innerHTML = `
              <td>${invoice.chef}</td>
              <td>${dish.name}</td>
              <td>${dish.quantity}</td>
              <td>${dish.price.toLocaleString()}đ</td>
              <td class="${statusColor} fw-bold">${invoice.status}</td>
            `;
            tableBody.appendChild(row);
        });
    });
}
  
  // Hiển thị lại danh sách bàn
  function showTableList() {
    document.getElementById("orderDetailsContainer").style.display = "none";
    document.getElementById("tableListContainer").style.display = "block";
  }
  
  // Gọi hàm khi mở modal
  document.getElementById("orderHistoryModal").addEventListener("show.bs.modal", renderTableList);
  
  document.addEventListener("DOMContentLoaded", renderMenu);
  