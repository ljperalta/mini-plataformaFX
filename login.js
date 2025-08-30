document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();
    console.log("Form submitted");
    let data = new FormData(this);

    fetch("db/auth.php", {
        method: "POST",
        body: data
    })
    .then(res => res.json())
    .then(resp => {
        if(resp.success){
            window.location.href = "dashboard/";
        } else {
            alert("Credenciales inválidas");
        }
    })
    .catch(err => console.error(err));
});
