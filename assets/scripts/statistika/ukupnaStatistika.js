$("#kategorija1").click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("kategorije1").style.display = "block";
    $('#kategorije1').show();
});
$(document).click(function (e) {
    if (e.target.id == "kategorija1" || e.target.id == "kategorije1" || e.target.classList[0] == "li") {
        //alert("do't hide");  
    } else {
        document.getElementById("kategorije1").style.display = "none";
        //$(".login-panel").hide();

    }
});