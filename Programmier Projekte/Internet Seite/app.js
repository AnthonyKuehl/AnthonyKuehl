const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

loginButton.addEventListener("click", () => {
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "Admin" && password === "1234") {
        open("http://127.0.0.1:5500/sucess.html");
        location.reload();
    } else {
        loginErrorMsg.style.opacity = 1;
    }
})