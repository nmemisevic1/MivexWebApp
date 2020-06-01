function showNotification (msg,boja) {
    var ikona;
    if(boja==1 || boja == 2){
        ikona = "tim-icons icon-check-2";
    }
    else{
        ikona = "tim-icons icon-alert-circle-exc";
    }
    
    $.notify({
      icon: ikona,
      message: msg
  
    }, {
      type: type[boja],
      timer: 1500,
      placement: {
        from: 'top',
        align: 'center'
      }
    });
  }

  
  function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }
  
  function kreirajElement(element, atributi){
  
    let el = document.createElement(element);
    setAttributes(el,atributi);
    return el;
  }


function editujNazivBaze(input1){

  $.post('/baza/edit', {stariNaziv:input1.getAttribute("value"), noviNaziv:input1.value} , function(returnedData){

      if(returnedData.ispravan == "DA"){
        showNotification(returnedData.poruka,2);
        input1.setAttribute("value", input1.value);         
      }
      else{
          showNotification(returnedData.poruka,4);            
      }        
  });
}

function obrisiBazu(naziv,tabela,tr){

    const potvrda = confirm("Brisanjem baze bit ce obrisani i svi proizvodi koji pripadaju toj bazi. Da li zelite obrisati bazu?");

    if(potvrda){
        $.post('/baza/remove', {nazivBaze:naziv}, function(returnedData){      

          $.post('/user/ukiniBazu2', {ukinutaBaza:naziv}, function(returnedData2){

              if(returnedData.ispravan == "DA"){
                showNotification(returnedData.poruka,2);  
                tabela.removeChild(tr);
              }
              else{
                showNotification(returnedData.poruka,4);            
              }
          });         
        });
    }    
}

function spasiNazivBaze(){
    //.
    //.
    //.
    //ako je sve ok
    showNotification("Baza uspješno izmijenjena!",2);
    document.getElementById("spasiNazivBazeButton").style.visibility = "hidden";
}

function kreirajBazu(table){

    let novaBaza = document.getElementById('novaBaza');

    if(novaBaza.value == ''){
      showNotification('Potrebno je unijeti naziv baze!', 4);
      return;
    }

    $.post('/baza/add', {nazivBaze:novaBaza.value}, function(returnedData){

        if(returnedData.poruka == "Uspješno dodana nova baza!"){

           $.post('/user/dodijeliBazu2', {novaBaza:novaBaza.value}, function(returnedData2){

                showNotification(returnedData.poruka,2); 
                dodajRedUListuBaza(document.getElementById('novaBaza').value);           
                document.getElementById('novaBaza').value = ""; 
            });                       
        }
        else{
            showNotification(returnedData.poruka,4);
        }
    });
}


function ucitajBaze(){

    $.get('/baza/getAll', function(returnedData){

        if(returnedData == null || returnedData.rezultat == null) return;

        let sveBaze = Object.values(returnedData.rezultat);         

        for(let i=0; i<sveBaze.length; i++){
            dodajRedUListuBaza(sveBaze[i].naziv);            
        }
    });
}

            

function dodajRedUListuBaza(naziv){

  let tabela = document.getElementById('ubacitiBaze');

  let tr = kreirajElement('tr',{"class":"row"});
  let th1 = kreirajElement('th', {});
  let input1 = kreirajElement('input', {"class":"form-control", "type":"text", "value":naziv, "style":"margin-left:0px;color:white!important;"});
  input1.readOnly = true;
  
  let div1 = kreirajElement('div',{"class":"col-xs-12 col-sm-12"});
  div1.appendChild(input1);
  th1.appendChild(div1);       
            
  let th3 = kreirajElement('th', {"class":"text-center"});
  let button1 = kreirajElement('button', {"class":"btn btn-danger", "style":"margin-top:10px; margin-left: 5px; width: 225px" });
  button1.onclick = function(){ obrisiBazu(naziv, tabela, tr); };
  button1.innerHTML = "Obriši bazu";

  /*let button2 = kreirajElement('button', {"class":"btn btn-info", "style":"margin-top:10px; margin-left: 5px;"});
  button2.innerHTML = "Promijeni naziv baze";

  button2.onclick = function() {              
    editujNazivBaze(input1);
  };*/

  let div2 = kreirajElement('div',{"class":"col-xs-12 col-sm-6"});
  div2.appendChild(button1);
  //div2.appendChild(button2);
  th3.appendChild(div2);
  tr.appendChild(th1);
  tr.appendChild(th3);

  tabela.appendChild(tr);
}

function logOut() {

  $.get('/logout', function (returnedData) {
      window.location.replace('/login.html');
  });
}