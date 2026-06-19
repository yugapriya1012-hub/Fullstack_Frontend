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
        alert("Login Successful!");

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

      } else {
        alert("Error: " + (data.detail || "Invalid Credentials"));
      }
    } catch (err) {
      console.error(err);
      alert("Server is offline. Check FastAPI.");
    }
  });
