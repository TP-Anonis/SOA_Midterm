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

// Dữ liệu đơn hàng
let orders = [
    { id: 1, table: 5, items: [{ name: "Phở", quantity: 2 }, { name: "Bánh mì", quantity: 1 }], status: "Chưa giao", orderTime: new Date().toLocaleTimeString(), deliveryTime: "", paymentTime: "" },
    { id: 2, table: 3, items: [{ name: "Cơm gà", quantity: 1 }, { name: "Bún bò", quantity: 2 }], status: "Đã giao", orderTime: new Date().toLocaleTimeString(), deliveryTime: new Date().toLocaleTimeString(), paymentTime: "" }
];

let completedOrders = [
    { id: 101, table: 5, items: [{ name: "Phở", quantity: 2 }], total: "150,000đ", status: "Đã thanh toán", orderTime: "12:30 PM", deliveryTime: "12:35 PM", paymentTime: "12:40 PM" },
    { id: 102, table: 2, items: [{ name: "Bún chả", quantity: 1 }], total: "120,000đ", status: "Đã thanh toán", orderTime: "12:45 PM", deliveryTime: "12:50 PM", paymentTime: "12:55 PM" }
];

// Hiển thị avatar, mã nhân viên và đơn hàng khi trang tải
document.addEventListener("DOMContentLoaded", function () {
    const avatar = localStorage.getItem("avatar");
    const employeeCode = localStorage.getItem("employeeCode");
    if (avatar) {
        document.getElementById("navbarAvatar").src = avatar;
    }
    if (employeeCode) {
        document.getElementById("employeeCode").textContent = `${employeeCode}`;
    }
    renderOrders();
    calculateTotalRevenue();
});

// Hàm render đơn hàng
function renderOrders() {
    let ongoingHTML = "";
    let currentShiftHTML = "";
    let historyHTML = "";

    orders.forEach((order, index) => {
        ongoingHTML += `
            <tr>
                <td>${order.id}</td>
                <td>Bàn ${order.table}</td>
                <td>
                    <ul class="list-unstyled mb-0">
                        ${order.items.map(item => `<li>${item.name} x${item.quantity}</li>`).join("")}
                    </ul>
                </td>
                <td>${order.orderTime}</td>
                <td>${order.deliveryTime || ""}</td>
                <td><span class="badge ${order.status === 'Chưa giao' ? 'bg-warning' : 'bg-success'}">${order.status}</span></td>
                <td>
                    ${order.status === "Chưa giao" ? 
                        `<button class="btn btn-success btn-sm" onclick="confirmAction('Bạn có chắc muốn hoàn thành đơn hàng?', () => completeOrder(${index}))">Hoàn thành</button>` 
                        : ""}
                    ${order.status === "Đã giao" ? 
                        `<button class="btn btn-primary btn-sm" onclick="confirmAction('Bạn có chắc muốn thanh toán đơn hàng?', () => payOrder(${index}))">Thanh toán</button>` 
                        : ""}
                    <button class="btn btn-danger btn-sm" onclick="confirmAction('Bạn có chắc muốn xóa đơn hàng?', () => deleteOrder(${index}))">Xóa</button>
                </td>
            </tr>
        `;
        if (order.status === "Đã thanh toán") {
            currentShiftHTML += `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.total || "0đ"}</td>
                    <td>${order.paymentTime || ""}</td>
                </tr>
            `;
        }
    });

    completedOrders.forEach((order, index) => {
        historyHTML += `
            <tr style="background-color: #d4edda;">
                <td>${order.id}</td>
                <td>Bàn ${order.table}</td>
                <td>
                    <ul class="list-unstyled mb-0">
                        ${order.items.map(item => `<li>${item.name} x${item.quantity}</li>`).join("")}
                    </ul>
                </td>
                <td>${order.deliveryTime || ""}</td>
                <td>${order.paymentTime || ""}</td>
                <td><span class="badge bg-success">Đã thanh toán</span></td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="confirmAction('Bạn có chắc muốn xóa đơn hàng khỏi lịch sử?', () => deleteHistoryOrder(${index}))">Xóa</button>
                </td>
            </tr>
        `;
        if (!order.paymentTime.includes("AM") && !order.paymentTime.includes("PM")) {
            currentShiftHTML += `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.total || "0đ"}</td>
                    <td>${order.paymentTime}</td>
                </tr>
            `;
        }
    });

    document.getElementById("ongoing-orders").innerHTML = ongoingHTML;
    document.getElementById("current-shift-bills").innerHTML = currentShiftHTML;
    document.getElementById("order-history").innerHTML = historyHTML;
}

// Tính tổng doanh thu trong ca trực
function calculateTotalRevenue() {
    let total = completedOrders.reduce((sum, order) => {
        if (!order.paymentTime.includes("AM") && !order.paymentTime.includes("PM")) {
            return sum + parseInt(order.total.replace(/[^0-9]/g, ""));
        }
        return sum;
    }, 0);
    document.getElementById("total-revenue").textContent = `${total.toLocaleString()}đ`;
}

// Lọc đơn hàng theo ngày/tháng/năm
function filterOrders() {
    const filter = document.getElementById("revenue-filter").value;
    let filteredOrders = [...completedOrders];
    const now = new Date();

    if (filter === "day") {
        filteredOrders = completedOrders.filter(order => {
            const paymentDate = new Date(order.paymentTime);
            return paymentDate.toDateString() === now.toDateString();
        });
    } else if (filter === "month") {
        filteredOrders = completedOrders.filter(order => {
            const paymentDate = new Date(order.paymentTime);
            return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
        });
    } else if (filter === "year") {
        filteredOrders = completedOrders.filter(order => {
            const paymentDate = new Date(order.paymentTime);
            return paymentDate.getFullYear() === now.getFullYear();
        });
    }

    let historyHTML = "";
    filteredOrders.forEach((order, index) => {
        historyHTML += `
            <tr style="background-color: #d4edda;">
                <td>${order.id}</td>
                <td>Bàn ${order.table}</td>
                <td>
                    <ul class="list-unstyled mb-0">
                        ${order.items.map(item => `<li>${item.name} x${item.quantity}</li>`).join("")}
                    </ul>
                </td>
                <td>${order.deliveryTime || ""}</td>
                <td>${order.paymentTime || ""}</td>
                <td><span class="badge bg-success">Đã thanh toán</span></td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="confirmAction('Bạn có chắc muốn xóa đơn hàng khỏi lịch sử?', () => deleteHistoryOrder(${index}))">Xóa</button>
                </td>
            </tr>
        `;
    });
    document.getElementById("order-history").innerHTML = historyHTML;
}

function completeOrder(index) {
    try {
        orders[index].status = "Đã giao";
        orders[index].deliveryTime = new Date().toLocaleTimeString();
        renderOrders();
    } catch (error) {
        console.error("Lỗi khi hoàn thành đơn hàng:", error);
    }
}

function payOrder(index) {
    try {
        let paidOrder = orders.splice(index, 1)[0];
        paidOrder.status = "Đã thanh toán";
        paidOrder.paymentTime = new Date().toLocaleString();
        paidOrder.total = calculateOrderTotal(paidOrder);
        completedOrders.push(paidOrder);
        renderOrders();
        calculateTotalRevenue();
    } catch (error) {
        console.error("Lỗi khi thanh toán đơn hàng:", error);
    }
}

function calculateOrderTotal(order) {
    const pricePerItem = 50000;
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    return (totalItems * pricePerItem).toLocaleString() + "đ";
}

function deleteOrder(index) {
    try {
        orders.splice(index, 1);
        renderOrders();
    } catch (error) {
        console.error("Lỗi khi xóa đơn hàng:", error);
    }
}

function deleteHistoryOrder(index) {
    try {
        completedOrders.splice(index, 1);
        renderOrders();
        calculateTotalRevenue();
    } catch (error) {
        console.error("Lỗi khi xóa đơn hàng khỏi lịch sử:", error);
    }
}

function clearHistory() {
    confirmAction('Bạn có chắc muốn xóa toàn bộ lịch sử đơn hàng?', () => {
        completedOrders = [];
        renderOrders();
        calculateTotalRevenue();
    });
}

function confirmAction(message, callback) {
    document.getElementById("confirmMessage").innerText = message;
    document.getElementById("confirmModal").style.display = "flex";

    let confirmYes = document.getElementById("confirmYes");
    let newButton = confirmYes.cloneNode(true);
    confirmYes.parentNode.replaceChild(newButton, confirmYes);

    newButton.addEventListener("click", function () {
        callback();
        closeConfirmModal();
    });
}

function closeConfirmModal() {
    document.getElementById("confirmModal").style.display = "none";
}

document.getElementById("confirmNo").addEventListener("click", closeConfirmModal);