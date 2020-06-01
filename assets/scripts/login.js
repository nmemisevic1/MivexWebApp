function showNotification (msg) {
    color = Math.floor((Math.random() * 4) + 1);
 
    $.notify({
      icon: "tim-icons icon-bell-55",
      message: msg
 
    }, {
      type: type[4],
      timer: 1500,
      placement: {
        from: 'top',
        align: 'center'
      }
    });
  }

function loginValidacija(){

   // $.post('/loginValidacija', function(returnedData){});

   /* if($('#usernameId').val() == 'a' && $('#passwordId').val() == 'a'){
      window.location.href = "http://www.w3schools.com";
      window.location.replace('/dashboard.html');
    }

    else{
        $.get('/loginValidacija', {user: $('#usernameId').val(), pass: $('#passwordId').val()}, 

            function(returnedData){

                if(returnedData.ispravan == 'DA'){
                  window.location.href = "http://www.w3schools.com";
                  window.location.replace('/dashboard.html');
                }
                else if(returnedData.ispravan == 'NE'){
                  showNotification("Vaš <b>username</b> ili <b>password</b> nisu ispravni. Pokušajte ponovo!");
                }
                else if(returnedData.ispravan == 'DATABASE_ERROR'){
                  showNotification("Neuspješno povezivanje sa bazom podataka!");
                }
                else{
                  showNotification("Unknown error!");
                }

                
         });
     } */
}
var inputUsername = document.getElementById("username");
inputUsername.focus();
var inputPassword = document.getElementById("password");
inputUsername.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("loginBtn").click();
  }
});
inputPassword.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("loginBtn").click();
  }
});


function logOut() {

  $.get('/logout', function (returnedData) {
      window.location.replace('/login.html');
  });
}