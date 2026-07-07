  const roleToggle = document.getElementById('roleToggle');
  const userRoleInput = document.getElementById('userRole');
  const formTitle = document.getElementById('formTitle');
  const customerTab = document.getElementById('customerTab');
  const bakerTab = document.getElementById('bakerTab');

  roleToggle.addEventListener('click', () => {
    roleToggle.classList.toggle('baker-active');
    const isBaker = roleToggle.classList.contains('baker-active');
    
    userRoleInput.value = isBaker ? "seller" : "customer"; 
    formTitle.innerText = isBaker ? "Baker Sign In" : "Customer Sign In";
    
    customerTab.classList.toggle('active-text', !isBaker);
    bakerTab.classList.toggle('active-text', isBaker);
  });

  document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = userRoleInput.value;

    let url = "";
    if (role === "customer") {
        url = "https://fullstackapi-two.vercel.app/customers/login";
    } else {
        url = "https://fullstackapi-two.vercel.app/seller/login"; 
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Login Successful!", false);

        setTimeout(() => {
          if (role === "customer") {
            localStorage.setItem('pEmail', data.email);
            localStorage.setItem('customer_id', data.customer_id);
            localStorage.setItem('pName', data.name);
            window.location.href = "../page/home.html";
          } else {
            localStorage.setItem('sellerEmail', data.email);
            localStorage.setItem('seller_id', data.seller_id);
            window.location.href = "../page/seller/seller_home.html";
          }
        }, 1500);

      } else {
        showToast("Error: " + (data.detail || "Invalid Credentials"), true);
      }
    } catch (err) {
      console.error(err);
      showToast("Server is offline. Check FastAPI.", true);
    }
  });

  function showToast(message, isError) {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
    toast.style.color = 'white';
    toast.style.padding = '15px 25px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    toast.style.zIndex = '1000';
    toast.style.fontWeight = 'bold';
    toast.style.transition = 'opacity 0.5s';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 2500);
  }
