function main() {
  const registerBtn = document.getElementById("register");
  registerBtn.addEventListener(
    "click",
    () => (window.location.href = "/login")
  );
}

main();
