const BACKEND = 'http://127.0.0.1:8000'; 

    function fmtDate(str) {
      if (!str) return '—';
      const d = new Date(str);
      return isNaN(d) ? str : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    const STATUS_LABELS = {
      pending: 'Pending', 
      accepted: 'Accepted',
      processing: 'Baking...',
      completed: 'Ready!', 
      delivered: 'Delivered', 
      cancelled: 'Cancelled'
    };

    function renderActiveOrders(orders) {
      const container = document.getElementById('active-order-container');
      if (!orders || orders.length === 0) {
        container.innerHTML = `<div class="empty-state"> No active orders found. <br><a href="product.html">Order some cakes!</a></div>`;
        return;
      }

      container.innerHTML = orders.map(o => {
        const items = o.items || [];
        const itemsHTML = items.map(item => `
          <div class="item-row">
            <span>${item.product_name || 'Delicious Cake'} (x${item.quantity})</span>
            <span>Rs. ${Number(item.price * item.quantity).toFixed(2)}</span>
          </div>`).join('');

        return `
        <div class="active-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <div style="font-weight:bold; font-size: 1.1rem;">Order #${o.id}</div>
            <div class="eta-badge">${STATUS_LABELS[o.status.toLowerCase()] || o.status}</div>
          </div>
          <div style="font-size:14px; color:#555; margin-bottom:10px;">
            <b>Delivery Date:</b> ${fmtDate(o.delivery_date)} <br>
            <b>Ordered on:</b> ${new Date(o.created_at).toLocaleString()}
          </div>
          <div class="items-list">${itemsHTML}</div>
          <div style="text-align:right; font-weight:bold; margin-top:15px; font-size:1.1rem; color:#ff4d88;">
            Total: Rs. ${Number(o.total_amount).toFixed(2)}
          </div>
        </div>`;
      }).join('');
    }

    async function loadOrders() {
      const container = document.getElementById('active-order-container');
      let customerId = localStorage.getItem('customer_id');
      const email = localStorage.getItem('pEmail');

      if (!email) {
        container.innerHTML = `<div class="empty-state">Please <a href="signin.html">Login</a> to view orders.</div>`;
        return;
      }

      try {
        if (!customerId || customerId === "undefined") {
          const res = await fetch(`${BACKEND}/customers/by-email?email=${encodeURIComponent(email)}`);
          if (res.ok) {
            const c = await res.json();
            customerId = c.id;
            localStorage.setItem('customer_id', customerId);
          }
        }

        const res = await fetch(`${BACKEND}/orders/customer/${customerId}`);
        if (!res.ok) throw new Error('Order Fetch Failed');

        const orders = await res.json();
        document.getElementById('order-count').textContent = `${orders.length} orders total`;
        
        renderActiveOrders(orders.sort((a,b) => b.id - a.id));

      } catch (err) {
        console.error(err);
        container.innerHTML = `<div class="empty-state">⚠️ Localhost connect aagala. Backend (Python) run aagudha nu check pannunga!</div>`;
      }
    }

    document.addEventListener('DOMContentLoaded', loadOrders);