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
// ================== Curved Area Chart Implementation ==================
const canvas = document.getElementById('myChart');
const ctx = canvas ? canvas.getContext('2d') : null;
let chartData = [5, 9, 7, 12, 8, 14, 10, 16, 11, 15, 13, 17]; // 12 months of sample data

// Set canvas size
if (canvas) {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 300;
}

window.drawChart = function () {
    if (!canvas || !ctx) return; // Exit if canvas not found

    const width = canvas.width;
    const height = canvas.height;
    const padding = 50; // Increased padding for labels

    ctx.clearRect(0, 0, width, height);

    // Define Theme Colors
    const isLight = document.body.classList.contains('light-mode');
    const gridColor = isLight ? '#e2e8f0' : '#334155';
    const axisColor = isLight ? '#94a3b8' : '#64748b';
    const textColor = isLight ? '#64748b' : '#94a3b8';
    const lineColor = isLight ? '#6366f1' : '#06b6d4'; // Indigo/Cyan

    // --- 1. Draw Grid Lines & Y-Axis Labels ---
    const rows = 5;
    const yMax = 20; // Max revenue value (assumed or calculated)

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.font = '11px Inter';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    // Draw horizontal grid lines and Y labels
    for (let i = 0; i <= rows; i++) {
        const y = padding + ((height - 2 * padding) / rows) * i;
        const yValue = Math.round(yMax - (yMax / rows) * i);

        // Grid Line
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();

        // Y Label
        ctx.fillText(yValue, padding - 10, y);
    }

    // Y-Axis Title
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText("Revenue ($k)", 0, 0);
    ctx.restore();

    // --- 2. Calculate coordinates for Spline ---
    const dataPoints = chartData.map((val, index) => {
        const x = padding + (index * (width - 2 * padding) / (chartData.length - 1));
        const y = padding + (height - 2 * padding) * (1 - val / yMax);
        return { x, y };
    });

    // --- 3. Draw Gradient Fill (Area) ---
    ctx.beginPath();
    ctx.moveTo(dataPoints[0].x, height - padding); // Start bottom-left
    ctx.lineTo(dataPoints[0].x, dataPoints[0].y); // Move to first point

    // Draw curved lines (Catmull-Rom or simple Bezier midpoint approximation)
    for (let i = 0; i < dataPoints.length - 1; i++) {
        const p0 = dataPoints[i];
        const p1 = dataPoints[i + 1];
        // Midpoint control smoothing
        const midX = (p0.x + p1.x) / 2;
        ctx.quadraticCurveTo(p0.x, p0.y, midX, (p0.y + p1.y) / 2);
        ctx.quadraticCurveTo(midX, (p0.y + p1.y) / 2, p1.x, p1.y);
    }

    ctx.lineTo(dataPoints[dataPoints.length - 1].x, height - padding); // Line to bottom-right
    ctx.closePath();

    // Create Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    if (isLight) {
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)'); // Indigo low opacity
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
    } else {
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.4)'); // Cyan low opacity
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
    }
    ctx.fillStyle = gradient;
    ctx.fill();

    // --- 4. Draw Line Stroke (Top Edge) ---
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.moveTo(dataPoints[0].x, dataPoints[0].y);

    // Same smooth curve logic for stroke
    for (let i = 0; i < dataPoints.length - 1; i++) {
        const p0 = dataPoints[i];
        const p1 = dataPoints[i + 1];
        const midX = (p0.x + p1.x) / 2;
        const midY = (p0.y + p1.y) / 2;
        ctx.quadraticCurveTo(p0.x, p0.y, midX, midY);
        ctx.quadraticCurveTo(midX, midY, p1.x, p1.y);
    }
    ctx.stroke();

    // --- 5. Draw Points on Line (Optional for detail) ---
    ctx.fillStyle = isLight ? '#ffffff' : '#1e293b';
    dataPoints.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke(); // Stroke with current line color
    });

    // --- 6. Draw X-Axis Labels ---
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    dataPoints.forEach((p, i) => {
        // Show label for every point, or skip if too crowded
        if (i < months.length) {
            ctx.fillText(months[i], p.x, height - padding + 10);
        }
    });

    // X-Axis Title
    ctx.fillText("Time (Months)", width / 2, height - 15);
}

if (canvas) {
    drawChart();
}

window.updateChartData = function () {
    chartData.shift();
    chartData.push(getRandomInt(2, 18));
    drawChart();
}

// ================== Topbar Search Functionality ==================
const topbarSearch = document.getElementById('topbarSearch');

if (topbarSearch) {
    topbarSearch.addEventListener('keyup', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        // Dashboard page - search orders table
        if (tableBody) {
            const rows = tableBody.getElementsByTagName('tr');
            Array.from(rows).forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }

        // Users page - search users table
        const usersTableBody = document.getElementById('usersTableBody');
        if (usersTableBody) {
            const rows = usersTableBody.getElementsByTagName('tr');
            Array.from(rows).forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }

        // Orders page - search orders table
        const ordersPageTableBody = document.getElementById('ordersPageTableBody');
        if (ordersPageTableBody) {
            const rows = ordersPageTableBody.getElementsByTagName('tr');
            Array.from(rows).forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }

        // Products page - search products table
        const productsTableBody = document.getElementById('productsTableBody');
        if (productsTableBody) {
            const rows = productsTableBody.getElementsByTagName('tr');
            Array.from(rows).forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        }
    });
}

