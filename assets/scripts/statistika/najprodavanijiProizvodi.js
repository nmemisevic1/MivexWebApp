$("#kategorija3").click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById("kategorije3").style.display = "block";
    $('#kategorije3').show();
});
$(document).click(function (e) {
    if (e.target.id == "kategorija3" || e.target.id == "kategorije3" || e.target.classList[0] == "li") {
        //alert("do't hide");  
    } else {
        document.getElementById("kategorije3").style.display = "none";
        //$(".login-panel").hide();

    }
});