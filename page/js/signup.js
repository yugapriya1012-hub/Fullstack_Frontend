    const roleToggle = document.getElementById('roleToggle');
    const customerTab = document.getElementById('customerTab');
    const bakerTab = document.getElementById('bakerTab');
    const formTitle = document.getElementById('formTitle');
    const submitBtn = document.getElementById('submitBtn');
    const userRoleInput = document.getElementById('userRole');
    const signupForm = document.getElementById('signupForm');

   
    roleToggle.addEventListener('click', () => {
        roleToggle.classList.toggle('baker-active');
        const isBaker = roleToggle.classList.contains('baker-active');

        if (isBaker) {
            userRoleInput.value = "baker";
            formTitle.innerText = "Baker Sign Up";
            submitBtn.innerText = "Create Baker Account";
            customerTab.classList.remove('active-text');
            bakerTab.classList.add('active-text');
        } else {
            userRoleInput.value = "customer";
            formTitle.innerText = "Customer Sign Up";
            submitBtn.innerText = "Create Customer Account";
            bakerTab.classList.remove('active-text');
            customerTab.classList.add('active-text');
        }
    });

  
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
 
        const name = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phoneNumber').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

       
        if (password !== confirmPassword) {
            alert("Passwords do not match! Please try again.");
            return;
        }

        
        const role = userRoleInput.value;
        const url = role === "customer" 
            ? "http://127.0.0.1:8000/customers/" 
            : "http://127.0.0.1:8000/seller/signup";

        const payload = {
            name: name,
            email: email,
            password: password,
            phone: phone
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "Registration Successful!");
                window.location.href = "../page/signin.html";
            } else {
                
                alert("Error: " + (result.detail || "Signup failed"));
            }
        } catch (error) {
            console.error("Connection Error:", error);
            alert("Cannot connect to server. Ensure FastAPI is running and CORS is enabled.");
        }
    });