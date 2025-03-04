let orders = [
    { id: 1, table: 5, items: [{ name: "Phở", quantity: 2 }, { name: "Bánh mì", quantity: 1 }], status: "Chưa giao", orderTime: new Date().toLocaleTimeString(), deliveryTime: "", paymentTime: "" },
    { id: 2, table: 3, items: [{ name: "Cơm gà", quantity: 1 }, { name: "Bún bò", quantity: 2 }], status: "Đã giao", orderTime: new Date().toLocaleTimeString(), deliveryTime: new Date().toLocaleTimeString(), paymentTime: "" }
];

let completedOrders = [];

function renderOrders() {
    let ongoingHTML = "";
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
    });

    document.getElementById("ongoing-orders").innerHTML = ongoingHTML;
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
        paidOrder.paymentTime = new Date().toLocaleTimeString();
        completedOrders.push(paidOrder);
        renderOrders();
    } catch (error) {
        console.error("Lỗi khi thanh toán đơn hàng:", error);
    }
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
    } catch (error) {
        console.error("Lỗi khi xóa đơn hàng khỏi lịch sử:", error);
    }
}

function clearHistory() {
    confirmAction('Bạn có chắc muốn xóa toàn bộ lịch sử đơn hàng?', () => {
        completedOrders = [];
        renderOrders();
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

document.addEventListener("DOMContentLoaded", renderOrders);
