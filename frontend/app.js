/* 
  Neon Drinks - Frontend Logic 
  Handles API requests, dynamic UI rendering, Auth, and Cart state.
*/

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : '/api';

// --- State Management ---
let state = {
    token: localStorage.getItem('token') || null,
    user: null, // Will fetch or decode later if needed
    shops: [],
    drinks: [],
    cart: [],
    cartOpen: false
};

// --- API Status UI ---
let apiStatusTimeout = null;
function showAPIStatus(statusType, message) {
    const toast = document.getElementById('apiStatus');
    const text = document.getElementById('apiStatusText');

    // Clear previous classes
    toast.className = 'api-status-toast visible';
    toast.classList.add(statusType); // 'connecting', 'success', 'error'
    text.innerText = message;

    if (apiStatusTimeout) clearTimeout(apiStatusTimeout);

    // Auto-hide on success or error after 3 seconds
    if (statusType !== 'connecting') {
        apiStatusTimeout = setTimeout(() => {
            toast.classList.remove('visible');
        }, 3000);
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    fetchShops();
    fetchDrinks();
});

function initUI() {
    updateAuthUI();
    renderCart();

    // Close modals on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (state.cartOpen) toggleCart();
            const authModal = document.getElementById('authModal');
            if (authModal.classList.contains('active')) {
                authModal.classList.remove('active');
            }
        }
    });
}

// --- Auth UI Management ---
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userGreeting = document.getElementById('userGreeting');

    if (state.token) {
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userGreeting.classList.remove('hidden');
        userGreeting.innerText = 'Đã kết nối';
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userGreeting.classList.add('hidden');
    }
}

function openAuthModal(type) {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const title = document.getElementById('authTitle');
    const lErr = document.getElementById('loginError');
    const sErr = document.getElementById('signupError');

    // Reset states
    lErr.classList.add('hidden');
    sErr.classList.add('hidden');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';

    if (type === 'login') {
        title.innerText = 'Chào Mừng Trở Lại';
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    } else {
        title.innerText = 'Đăng Ký Tài Khoản';
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }

    modal.classList.add('active');
}

function closeModal(e) {
    if (e.target.id === 'authModal') {
        e.target.classList.remove('active');
    }
}

function logout() {
    localStorage.removeItem('token');
    state.token = null;
    state.cart = []; // clear cart on logout
    updateAuthUI();
    renderCart();
}

// --- Auth API Actions ---
async function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');

    btn.innerHTML = 'Đang xử lý...';
    btn.disabled = true;
    errorEl.classList.add('hidden');

    showAPIStatus('connecting', 'Đang kết nối: Đang xác thực...');

    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Đăng nhập thất bại');

        state.token = data.token;
        localStorage.setItem('token', data.token);
        document.getElementById('authModal').classList.remove('active');
        updateAuthUI();

        showAPIStatus('success', 'Kết nối thành công: Đã đăng nhập');
        btn.innerHTML = 'Đăng Nhập';
    } catch (err) {
        showAPIStatus('error', `Lỗi máy chủ: ${err.message}`);
        errorEl.innerText = err.message;
        errorEl.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Đăng Nhập';
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    const errorEl = document.getElementById('signupError');

    btn.innerHTML = 'Đang xử lý...';
    btn.disabled = true;
    errorEl.classList.add('hidden');

    showAPIStatus('connecting', 'Đang kết nối: Tạo tài khoản...');

    try {
        const res = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Đăng ký thất bại');

        if (data.token) {
            state.token = data.token;
            localStorage.setItem('token', data.token);
            document.getElementById('authModal').classList.remove('active');
            updateAuthUI();
            showAPIStatus('success', 'Thành công: Đã tạo tài khoản & đăng nhập');
        } else {
            openAuthModal('login');
            document.getElementById('loginEmail').value = email;
            showAPIStatus('success', 'Thành công: Đã tạo tài khoản. Vui lòng đăng nhập.');
        }
    } catch (err) {
        showAPIStatus('error', `Lỗi máy chủ: ${err.message}`);
        errorEl.innerText = err.message;
        errorEl.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Đăng Ký';
    }
}

// --- Data Fetching ---
async function fetchShops() {
    showAPIStatus('connecting', 'Đang kết nối: Tải cửa hàng...');
    const container = document.getElementById('shopGrid');
    try {
        const res = await fetch(`${API_BASE_URL}/shops`);
        if (!res.ok) throw new Error('Tải cửa hàng thất bại');
        const shops = await res.json();

        showAPIStatus('success', `Kết nối thành công: Tải ${shops.length} cửa hàng`);
        state.shops = shops;
        renderShops(shops, container);
    } catch (err) {
        showAPIStatus('error', `Lỗi máy chủ: ${err.message}`);
        container.innerHTML = `<div class="error-msg" style="grid-column: 1/-1">${err.message}</div>`;
    }
}

async function fetchDrinks() {
    showAPIStatus('connecting', 'Đang kết nối: Tải thực đơn...');
    const container = document.getElementById('drinkGrid');
    try {
        const res = await fetch(`${API_BASE_URL}/drinks`);
        if (!res.ok) throw new Error('Tải thực đơn thất bại');
        const drinks = await res.json();

        showAPIStatus('success', `Kết nối thành công: Tải ${drinks.length} thức uống`);
        state.drinks = drinks;
        renderDrinks(drinks, container);
    } catch (err) {
        showAPIStatus('error', `Lỗi máy chủ: ${err.message}`);
        container.innerHTML = `<div class="error-msg" style="grid-column: 1/-1">${err.message}</div>`;
    }
}

// --- Rendering ---
function renderShops(shops, container) {
    if (shops.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color: var(--text-muted)">Không tìm thấy cửa hàng nào.</div>';
        return;
    }

    container.innerHTML = shops.map(shop => `
    <div class="item-card">
      <div class="item-image" style="background-image: url('https://www.highlandscoffee.com.vn/vnt_upload/news/02_2020/834x417_A.png');">
      </div>
      <div class="item-content">
        <h3 class="item-title">${shop.name}</h3>
        <p class="item-desc">${shop.location || 'Địa điểm cao cấp'}</p>
        <button class="btn btn-outline btn-block" onclick="document.getElementById('menu').scrollIntoView({behavior: 'smooth'})">Xem Thực Đơn</button>
      </div>
    </div>
  `).join('');
}

const DRINK_IMAGES = {
    'Phin Sữa Đá': 'https://www.highlandscoffee.com.vn/vnt_upload/product/04_2023/Phin_Sua_Da_VN.png',
    'Phin Đen Đá': 'https://www.highlandscoffee.com.vn/vnt_upload/product/04_2023/Phin_Den_Da_VN.png',
    'Bạc Xỉu Đá': 'https://www.highlandscoffee.com.vn/vnt_upload/product/04_2023/Bac_Xiu_Da.png',
    'Phindi Hạnh Nhân': 'https://www.highlandscoffee.com.vn/vnt_upload/product/04_2023/Phindi_Hanh_Nhan_VN.jpg',
    'Phindi Choco': 'https://www.highlandscoffee.com.vn/vnt_upload/product/04_2023/Phindi_Choco_VN.jpg',
    'Trà Sen Vàng': 'https://www.highlandscoffee.com.vn/vnt_upload/product/04_2023/Tra_Sen_Vang_VN.png',
    'Trà Thạch Đào': 'https://www.highlandscoffee.com.vn/vnt_upload/product/04_2023/Tra_Thach_Dao_VN.png',
    'Trà Thanh Đào': 'https://www.highlandscoffee.com.vn/vnt_upload/product/04_2023/Tra_Thanh_Dao_VN.png',
    'Freeze Trà Xanh': 'https://www.highlandscoffee.com.vn/vnt_upload/product/04_2023/Freeze_Tra_Xanh_VN.jpg',
    'Caramel Phin Freeze': 'https://www.highlandscoffee.com.vn/vnt_upload/product/04_2023/Caramel_Phin_Freeze_VN.jpg'
};

function renderDrinks(drinks, container) {
    if (drinks.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; color: var(--text-muted)">Không tìm thấy thực đơn nào.</div>';
        return;
    }

    container.innerHTML = drinks.map(drink => {
        const imgUrl = DRINK_IMAGES[drink.name] || 'https://via.placeholder.com/300x200?text=Drink';
        return `
    <div class="item-card">
      <div class="item-image" style="background-image: url('${imgUrl}');">
      </div>
      <div class="item-content">
        <div class="item-meta">
          <span class="badge">${drink.shop?.name || 'Cửa hàng'}</span>
        </div>
        <h3 class="item-title">${drink.name}</h3>
        <p class="item-desc">${drink.description || 'Thức uống thủ công tuyệt hảo.'}</p>
        <div class="item-meta" style="margin-top: auto; margin-bottom: 0;">
          <span class="item-price">${Number(drink.price).toFixed(0)}đ</span>
          <button class="btn-add-circle" onclick="addToCart('${drink.id}')">+</button>
        </div>
      </div>
    </div>
  `;
    }).join('');
}

function getDrinkEmoji(name) {
    const n = name.toLowerCase();
    if (n.includes('tea') || n.includes('matcha')) return '🍵';
    if (n.includes('juice') || n.includes('smoothie')) return '🍹';
    if (n.includes('boba') || n.includes('bubble')) return '🧋';
    return '☕';
}

// --- Cart & Order Interactions ---
function toggleCart() {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');

    state.cartOpen = !state.cartOpen;

    if (state.cartOpen) {
        document.body.classList.add('cart-active');
    } else {
        document.body.classList.remove('cart-active');
    }
    renderCart();
}

function addToCart(drinkId) {
    const idNum = Number(drinkId);
    const drink = state.drinks.find(d => d.id === idNum);
    if (!drink) return;

    const existing = state.cart.find(i => i.drinkId === idNum);
    if (existing) {
        existing.quantity += 1;
    } else {
        state.cart.push({ drinkId: drink.id, name: drink.name, price: drink.price, shopId: drink.shopId, quantity: 1 });
    }

    renderCart();

    // Quick visual feedback
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => cartBtn.style.transform = '', 200);
}

function removeFromCart(drinkId) {
    const idNum = Number(drinkId);
    state.cart = state.cart.filter(i => i.drinkId !== idNum);
    renderCart();
}

function updateCartQuantity(drinkId, delta) {
    const idNum = Number(drinkId);
    const item = state.cart.find(i => i.drinkId === idNum);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(idNum);
    } else {
        renderCart();
    }
}

function renderCart() {
    const countEl = document.getElementById('cartCount');
    const itemsContainer = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotalValue');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Calculate totals
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

    countEl.innerText = totalItems;
    totalEl.innerText = `${totalPrice.toFixed(0)}đ`;

    // Empty state
    if (state.cart.length === 0) {
        itemsContainer.innerHTML = '<div class="empty-cart">Giỏ hàng của bạn đang trống</div>';
        checkoutBtn.disabled = true;
        return;
    }

    checkoutBtn.disabled = false;
    itemsContainer.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-price">${Number(item.price).toFixed(0)}đ</div>
        <div class="cart-qty-controls">
          <button class="qty-btn" onclick="updateCartQuantity('${item.drinkId}', -1)">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQuantity('${item.drinkId}', 1)">+</button>
        </div>
      </div>
      <button class="close-btn" style="font-size: 1.5rem" onclick="removeFromCart('${item.drinkId}')">&times;</button>
    </div>
  `).join('');
}

async function checkout() {
    if (!state.token) {
        toggleCart(); // close cart
        openAuthModal('login');
        return;
    }

    if (state.cart.length === 0) return;

    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.innerHTML = 'Đang xử lý...';
    checkoutBtn.disabled = true;

    showAPIStatus('connecting', 'Đang kết nối: Đặt hàng...');

    try {
        const shopId = state.cart[0].shopId;
        const items = state.cart.map(c => ({
            drinkId: c.drinkId,
            quantity: c.quantity
        }));

        const res = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify({ shopId, items })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Đặt hàng thất bại');
        }

        const data = await res.json();

        showAPIStatus('success', `Thành công: Đã đặt hàng!`);
        alert(`Đặt hàng thành công! Mã đơn: ${data.id}`);

        // Clear cart and close
        state.cart = [];
        renderCart();
        toggleCart();

    } catch (err) {
        showAPIStatus('error', `Lỗi: ${err.message}`);
        alert(`Lỗi: ${err.message}`);
    } finally {
        checkoutBtn.innerHTML = 'Thanh Toán';
        checkoutBtn.disabled = false;
    }
}
