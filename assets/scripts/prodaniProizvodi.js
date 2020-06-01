function showNotification (msg,boja) {
  var ikona;
  if(boja==1){
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
function stornirajProizvod(){
  //if storniranje proslo ok
  var nazivProizvoda = "Maska galaxy s6";
  showNotification("Proizvod "+nazivProizvoda+" uspješno storniran!",1);
}
function prodaniProizvodiOnLoad(){
    for(var i=0;i<50;i++){/*i<brojProdatihProizvoda*/
        var tabela = document.getElementById('tabelaProdanihProizvoda');
    let slikaProizvoda = kreirajElement('img',{"style":"max-height:100px;max-width:100px;","src":"../assets/img/mivexMaska1.jpg"});
    let btnStorniraj = kreirajElement('input',{"class":"btn btn-danger","value":"Storniraj","type":"button","onClick":"stornirajProizvod()"});
    var row = tabela.insertRow(1);

    var tt1 = row.insertCell(0);
    var tt2 = row.insertCell(1);
    var tt3 = row.insertCell(2);
    var tt4 = row.insertCell(3);

    tt4.classList.add("text-center");
    tt1.appendChild(slikaProizvoda);
    tt2.innerText = "Galaxy s6 maska";
    tt3.innerText = "Vedad";
    tt4.appendChild(btnStorniraj);
    }
}