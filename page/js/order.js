const BACKEND = 'https://fullstackapi-two.vercel.app';

    function showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function initPage() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemsDiv = document.getElementById('orderItems');
        let subtotal = 0;

        if (cart.length === 0) {
            itemsDiv.innerHTML = '<p style="text-align:center;color:#aaa;padding:20px;">No items in cart</p>';
            return;
        }

        itemsDiv.innerHTML = cart.map(item => {
            let price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
            subtotal += price * item.quantity;
            return `<div class="summary-row">
                <span>${item.name} (x${item.quantity})</span>
                <span>Rs. ${price * item.quantity}</span>
            </div>`;
        }).join('');

        document.getElementById('subtotal').innerText = 'Rs. ' + subtotal;
        document.getElementById('grandTotal').innerText = 'Rs. ' + (subtotal + 50);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        document.getElementById('deliveryDate').value = dateStr;
        document.getElementById('deliveryDate').min = dateStr;
    }

    async function processOrder() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const delDate = document.getElementById('deliveryDate').value;
        const email = localStorage.getItem('pEmail');
        let customerId = localStorage.getItem('customer_id');

        if (cart.length === 0) { showToast('Cart is empty!'); return; }
        if (!email || !customerId) { 
            showToast('Please login first!'); 
            setTimeout(() => window.location.href = '../page/signin.html', 1500);
            return; 
        }

        
        const payload = {
            customer_id: parseInt(customerId),
            items: cart.map(i => ({
                product_id: parseInt(i.id),
                quantity: parseInt(i.quantity)
            })),
            delivery_date: delDate 
        };

        try {
            showToast('Placing your order...');
            const response = await fetch(`${BACKEND}/orders/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('last_order_id', data.id);
                localStorage.removeItem('cart'); 
                showToast('Order successful!');
                setTimeout(() => window.location.href = 'upi.html', 1500);
            } else {
                const errDetail = await response.json();
                console.log("Error Detail:", errDetail);
                showToast('Storage fail: Check console');
            }
        } catch (e) {
            console.error('Server error:', e);
            showToast('Connection failed! Is backend running?');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        initPage();
        document.getElementById('confirmBtn').addEventListener('click', processOrder);
    });
