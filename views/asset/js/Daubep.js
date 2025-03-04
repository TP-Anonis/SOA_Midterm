let menuItems = [
    { name: "Phở bò", available: true },
    { name: "Bún chả", available: true },
    { name: "Gỏi cuốn", available: true },
    { name: "Cơm tấm", available: true }
];

let orders = [
    { id: 1, table: 2, items: [{ name: "Phở bò", quantity: 1 }], note: "Không hành", status: "Chưa xong" },
    { id: 2, table: 3, items: [{ name: "Bún chả", quantity: 2 }], note: "Ít nước mắm", status: "Chưa xong" }
];

// Hiển thị danh sách món ăn có sẵn
function renderMenu() {
    let menuList = document.getElementById("menu-list");
    menuList.innerHTML = "";
    menuItems.forEach((item, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            ${item.name}
            <button class="btn btn-sm ${item.available ? 'btn-success' : 'btn-danger'}" onclick="toggleAvailability(${index})">
                ${item.available ? "Còn món" : "Hết món"}
            </button>
        `;
        menuList.appendChild(li);
    });
}

// Bật/tắt trạng thái món ăn
function toggleAvailability(index) {
    menuItems[index].available = !menuItems[index].available;
    renderMenu();
}

// Hiển thị danh sách đơn hàng
function renderOrders() {
    let orderList = document.getElementById("order-list");
    orderList.innerHTML = "";
    orders.forEach((order, index) => {
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.innerHTML = `
            <strong>Bàn ${order.table}</strong> - Trạng thái: <span class="${order.status === "Hoàn thành" ? "text-success" : "text-warning"}">${order.status}</span>
            <ul>
                ${order.items.map(item => `<li>${item.name} x${item.quantity}</li>`).join("")}
            </ul>
            <p><strong>Ghi chú:</strong> ${order.note || "Không có"}</p>
            <button class="btn btn-sm btn-primary" onclick="markOrderComplete(${index})">Hoàn thành</button>
        `;
        orderList.appendChild(li);
    });
}

// Đánh dấu đơn hàng hoàn thành
function markOrderComplete(index) {
    orders[index].status = "Hoàn thành";
    renderOrders();
}

// Khởi chạy
renderMenu();
renderOrders();
