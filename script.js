// ================== Authentication Check ==================
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isLoginPage = window.location.pathname.includes('login.html');

    if (!isLoggedIn && !isLoginPage) {
        window.location.href = 'login.html';
    } else if (isLoggedIn) {
        // Update user avatar
        const user = JSON.parse(localStorage.getItem('user'));
        const userAvatar = document.getElementById('userAvatar');
        if (user && userAvatar) {
            userAvatar.src = user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=random`;
        }
    }
}
checkAuth();

// ================== Logout Logic ==================
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}

// ================== Sidebar Toggle ==================
let list = document.querySelectorAll(".sidebar ul li");

function activeLink() {
    list.forEach((item) => {
        item.classList.remove("active");
    });
    this.classList.add("active");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink));

let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".sidebar");
let main = document.querySelector(".main-content");

if (toggle) {
    toggle.onclick = function () {
        navigation.classList.toggle("active");
        main.classList.toggle("active");
    };
}

// ================== Theme Switcher ==================
const themeToggle = document.getElementById('themeScan');
const body = document.body;
const icon = themeToggle ? themeToggle.querySelector('ion-icon') : null;

// Check LocalStorage (Default to Dark for Eclipse Theme)
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    if (icon) icon.setAttribute('name', 'moon-outline');
} else {
    // Default or explicitly dark
    body.classList.remove('light-mode');
    if (icon) icon.setAttribute('name', 'sunny-outline');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');

        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            icon.setAttribute('name', 'moon-outline');
        } else {
            localStorage.setItem('theme', 'dark');
            icon.setAttribute('name', 'sunny-outline');
        }

        // Redraw chart if exists
        if (typeof drawChart === 'function') drawChart();
    });
}

// ================== KPI & Chart Logic (Only on Dashboard) ==================
const kpiExists = document.getElementById('kpi-views');
if (kpiExists) {
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateKPIs() {
        const views = document.getElementById('kpi-views');
        const sales = document.getElementById('kpi-sales');
        const comments = document.getElementById('kpi-comments');
        const earning = document.getElementById('kpi-earning');

        if (!views) return;

        let currentViews = parseInt(views.innerText.replace(/,/g, ''));
        let currentSales = parseInt(sales.innerText);
        let currentComments = parseInt(comments.innerText);

        views.innerText = (currentViews + getRandomInt(-10, 50)).toLocaleString();
        sales.innerText = (currentSales + getRandomInt(-2, 5));
        comments.innerText = (currentComments + getRandomInt(-5, 10));

        let currentEarning = parseFloat(earning.innerText.replace(/[$,]/g, ''));
        let newEarning = currentEarning + (getRandomInt(-50, 200));
        earning.innerText = '$' + newEarning.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

        if (typeof updateChartData === 'function') updateChartData();
    }

    setInterval(updateKPIs, 5000);
}

// ================== Table Logic (Search & Sort) ==================
const tableBody = document.getElementById('ordersTableBody');
const searchInput = document.getElementById('tableSearch');
const sortBtn = document.getElementById('sortBtn');

if (tableBody) {
    let orders = [
        { name: "Star Refrigerator", price: 1200, status: "Delivered", statusClass: "delivered" },
        { name: "Dell Laptop", price: 1500, status: "Pending", statusClass: "pending" },
        { name: "Apple Watch", price: 400, status: "Return", statusClass: "return" },
        { name: "Addidas Shoes", price: 120, status: "In Progress", statusClass: "inProgress" },
        { name: "Samsung Mobile", price: 900, status: "Delivered", statusClass: "delivered" },
        { name: "Window Coolers", price: 110, status: "Due", statusClass: "pending" },
        { name: "Hp Laptop", price: 1400, status: "Delivered", statusClass: "delivered" },
        { name: "Apple MacBook", price: 1800, status: "In Progress", statusClass: "inProgress" },
    ];

    function renderTable(data) {
        tableBody.innerHTML = "";
        data.forEach(order => {
            let row = `<tr>
                <td>${order.name}</td>
                <td>$${order.price}</td>
                <td>Paid</td>
                <td><span class="status ${order.statusClass}">${order.status}</span></td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    }

    renderTable(orders);

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = orders.filter(order =>
                order.name.toLowerCase().includes(term) ||
                order.status.toLowerCase().includes(term)
            );
            renderTable(filtered);
        });
    }

    if (sortBtn) {
        let sortAsc = true;
        sortBtn.addEventListener('click', () => {
            if (sortAsc) {
                orders.sort((a, b) => a.price - b.price);
                sortBtn.innerText = "Sort by Price (Desc)";
            } else {
                orders.sort((a, b) => b.price - a.price);
                sortBtn.innerText = "Sort by Price (Asc)";
            }
            sortAsc = !sortAsc;
            renderTable(orders);
        });
    }
}

// ================== Simple Chart Implementation (Canvas) ==================
const canvas = document.getElementById('myChart');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 300;

    let chartData = [12, 19, 3, 5, 2, 3, 10, 15, 8, 12, 6, 14];

    window.drawChart = function () { // Expose to window for theme toggler
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.strokeStyle = document.body.classList.contains('light-mode') ? '#e2e8f0' : '#334155';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            let y = (canvas.height / 5) * i + 20;
            ctx.moveTo(40, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();

        const barWidth = 30;
        const spacing = 15;
        const startX = 50;
        const maxVal = 20;

        chartData.forEach((val, index) => {
            const x = startX + (index * (barWidth + spacing));
            const barHeight = (val / maxVal) * (canvas.height - 40);
            const y = canvas.height - barHeight - 20;

            let gradient = ctx.createLinearGradient(x, y, x, y + barHeight);

            if (document.body.classList.contains('light-mode')) {
                gradient.addColorStop(0, '#4F46E5');
                gradient.addColorStop(1, '#6366F1');
            } else {
                gradient.addColorStop(0, '#06B6D4');
                gradient.addColorStop(1, '#6366F1');
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            ctx.fillStyle = document.body.classList.contains('light-mode') ? '#64748B' : '#94A3B8';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(val, x + barWidth / 2, y - 5);
        });
    }

    drawChart();

    window.updateChartData = function () {
        chartData.shift();
        chartData.push(getRandomInt(2, 18));
        drawChart();
    }
}
