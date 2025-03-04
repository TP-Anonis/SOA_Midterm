document.addEventListener("DOMContentLoaded", function () {
    // Mẫu dữ liệu đơn hàng hiện tại trong ca trực
    let currentShiftOrders = [
        { id: 101, table: 5, time: "12:30 PM", total: "150,000đ", status: "Đang phục vụ" },
        { id: 102, table: 2, time: "12:45 PM", total: "120,000đ", status: "Chưa thanh toán" },
        { id: 103, table: 7, time: "1:00 PM", total: "180,000đ", status: "Đã thanh toán" }
    ];

    // Mẫu dữ liệu lịch sử đơn hàng
    let historyOrders = [
        { id: 90, table: 4, time: "10:15 AM", total: "200,000đ", status: "Đã thanh toán" },
        { id: 91, table: 6, time: "11:00 AM", total: "250,000đ", status: "Đã thanh toán" },
        { id: 92, table: 8, time: "11:45 AM", total: "300,000đ", status: "Đã thanh toán" }
    ];

    function renderOrders() {
        let currentHTML = "";
        let historyHTML = "";

        currentShiftOrders.forEach(order => {
            currentHTML += `
                <tr>
                    <td>${order.id}</td>
                    <td>Bàn ${order.table}</td>
                    <td>${order.time}</td>
                    <td>${order.total}</td>
                    <td><span class="badge ${order.status === "Đã thanh toán" ? "bg-success" : "bg-warning"}">${order.status}</span></td>
                </tr>
            `;
        });

        historyOrders.forEach(order => {
            historyHTML += `
                <tr>
                    <td>${order.id}</td>
                    <td>Bàn ${order.table}</td>
                    <td>${order.time}</td>
                    <td>${order.total}</td>
                    <td><span class="badge bg-success">Đã thanh toán</span></td>
                </tr>
            `;
        });

        document.getElementById("current-shift-orders").innerHTML = currentHTML;
        document.getElementById("history-orders").innerHTML = historyHTML;
    }

    renderOrders();
});
