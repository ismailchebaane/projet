const handleLogout = () => {


    localStorage.removeItem("token"); // If using sessionStorage, use sessionStorage.removeItem()
    sessionStorage.removeItem("token"); 
    window.location.href = "/login"; // Redirect to login page
  };
  