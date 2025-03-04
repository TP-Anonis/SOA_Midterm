// Khởi tạo trạng thái đăng nhập (không sử dụng localStorage)
let isLoggedIn = false;

document.addEventListener("DOMContentLoaded", () => {
    updateUI();
    // Gán sự kiện cho form đăng nhập khi DOM đã sẵn sàng
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLoginSubmit);
    }
    // Gán sự kiện cho nút đăng nhập
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.onclick = showLoginForm;
    }
});

function showLoginForm() {
    const loginModal = document.getElementById("loginModal");
    // Hiển thị modal đăng nhập
    loginModal.style.display = "flex";
}

function closeLoginForm() {
    const loginModal = document.getElementById("loginModal");
    // Ẩn modal đăng nhập
    loginModal.style.display = "none";
}

function handleLoginSubmit(event) {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const employeeId = document.getElementById("employeeId").value.trim();

    // Lấy phần tử Toast (đảm bảo Toast đã được thêm trong HTML)
    const toastElement = document.getElementById("loginToast");
    let toastMessage = "";
    let toastClass = ""; // Sẽ gán bg-success hoặc bg-danger

    // Kiểm tra đăng nhập (giả lập)
    if (username === "admin" && password === "1234" && employeeId === "NV001") {
        isLoggedIn = true;
        updateUI();
        toastMessage = "Đăng nhập thành công!";
        toastClass = "bg-success";
        closeLoginForm(); // Ẩn modal đăng nhập sau khi đăng nhập thành công
    } else {
        toastMessage = "Thông tin đăng nhập không đúng!";
        toastClass = "bg-danger";
    }

    // Hiển thị Toast với delay 3000ms và tự ẩn
    if (toastElement) {
        const toastBody = toastElement.querySelector(".toast-body");
        if (toastBody) {
            toastBody.textContent = toastMessage;
        }
        // Xóa các lớp màu cũ nếu có và thêm lớp màu mới
        toastElement.classList.remove("bg-success", "bg-danger");
        toastElement.classList.add(toastClass);

        // Tạo đối tượng Toast của Bootstrap
        const toast = new bootstrap.Toast(toastElement, {
            autohide: true,
            delay: 3000
        });
        toast.show();
    } else {
        // Nếu không có Toast, sử dụng alert() như fallback
        alert(toastMessage);
    }
}

function updateUI() {
    const links = document.querySelectorAll(".nav-link");
    // Nếu không có phần tử viewMenuBtn, bỏ qua
    const viewMenuBtn = document.getElementById("view-menu-btn");

    if (isLoggedIn) {
        links.forEach(link => link.classList.remove("disabled"));
        if (viewMenuBtn) {
            viewMenuBtn.classList.remove("disabled");
            viewMenuBtn.removeAttribute("tabindex");
        }
        document.getElementById("login-btn").textContent = "Đăng xuất";
        document.getElementById("login-btn").onclick = handleLogout;
    } else {
        links.forEach(link => link.classList.add("disabled"));
        if (viewMenuBtn) {
            viewMenuBtn.classList.add("disabled");
            viewMenuBtn.setAttribute("tabindex", "-1");
        }
        document.getElementById("login-btn").textContent = "Đăng nhập";
        document.getElementById("login-btn").onclick = showLoginForm;
    }
}

function handleLogout() {
    isLoggedIn = false;
    updateUI();
    closeLoginForm();
}
