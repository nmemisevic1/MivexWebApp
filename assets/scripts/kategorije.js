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

function saveNotification(messagee){

  
    color = Math.floor((Math.random() * 4) + 1);
 
    $.notify({
      icon: "tim-icons icon-bell-55",
      message: messagee
 
    }, {
      type: type[1],
      timer: 50,
      placement: {
        from: 'top',
        align: 'center'
      }
    });
  }

$.fn.extend({
    treed: function(o){
        var openedClass = 'icon-simple-delete';
        var closedClass = 'icon-simple-add';

        if(typeof o != 'undefined'){
            if(typeof o.openedClass != 'undefined'){
                openedClass = o.openedClass;
            }
            if(typeof o.closedClass != 'undefined'){
                closedClass = o.closedClass;
            }
        };

        var tree = $(this);
        tree.addClass("tree");
        tree.find('li').has("ul").each(function(){
            var branch = $(this); //li with children ul
            branch.prepend("<i class='indicator tim-icons " + closedClass + "' style='color:white;cursor:pointer;list-style-type:none;'></i>");
            branch.addClass('branch');
            branch.on('click',function(e){
                if(this == e.target){
                    var icon = $(this).children('i:first');
                    icon.toggleClass(openedClass + " " + closedClass);
                    $(this).children().children().toggle();
                }
            })
            branch.children().children().toggle();
        });
        //fire event from the dynamiccally added icon
        tree.find('.branch .indicator').each(function(){
            $(this).on('click',function(){
                $(this).closest('li').click();
            });
        });
        //fire event to open branch if the li contains an anchor instead of text
        tree.find('.branch>a').each(function(){
            $(this).on('click',function(e){
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
        //fire event to open branch if the li contains a button instead of text
        tree.find('.branch>button').each(function(){
            $(this).on('click',function(e){
                $(this).closest('li').click();
                e.preventDefault();
            });
        });
    }
});

function addDeleteButton(){
    const list = document.querySelectorAll("li");
    for(var i=0;i<list.length;i++){
        const delBtn = document.createElement("button");
        delBtn.className = "categoryDeleteButton";
        delBtn.TextContent ="X";
        list[i].appendChild(delBtn);
    }
}
function filtriraj() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('Input1');
    filter = input.value.toUpperCase();
    ul = document.getElementById("Depth1");
    li = ul.getElementsByTagName('li');
    ul.style.display="block";
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
}
function LiClick(){
    /*Stari input treba da se popuni odabranom vrijednoscu ovo je ovdje hardkodirano */
    oldInput = document.getElementById("Input1");
    oldInput.value="Maske HC";

    /*Stara lista se sakriva*/
    oldUl = document.getElementById("Depth1");
    oldUl.style.display="none";
}

function dodajKategoriju(){

    $.get('/user/current/allPrivileges', function(returnedData){

        if(returnedData.poruka == 'OK'){            

            let pKategorija = null;
            let pKategorija2 = null;
            let pKategorija3 = null;
            
            if(returnedData == null || returnedData.rezultat == null) return;
            
            let privilegije = Object.values(returnedData.rezultat);

            for(let i=0; i<privilegije.length; i++){
                if(privilegije[i] == 'Dodaj kategoriju') pKategorija = document.getElementById('parentKategorija1');
                else if(privilegije[i] == 'Izmijeni kategoriju') pKategorija2 = document.getElementById('parentKategorija2');
                else if(privilegije[i] == 'Obrisi kategoriju') pKategorija3 = document.getElementById('parentKategorija3');
            }

            let nKategorije = document.getElementById('nazivKategorije');

            if(nKategorije.value == ''){
                showNotification('Unesite naziv kategorije!', 4);
                return;
            }

            $.post('/dodajNovuKategoriju', {nazivKategorije:nKategorije.value, parentKategorija: pKategorija.value}, function(returnedData2){
                
                if(returnedData2.poruka == "Uspješno dodana nova kategorija!"){

                    let option1 = document.createElement('option');
                    option1.text = nKategorije.value;
                    option1.setAttribute('style', 'color:#000');

                    let option2 = document.createElement('option');
                    option2.text = nKategorije.value;
                    option2.setAttribute('style', 'color:#000');

                    let option3 = document.createElement('option');
                    option3.text = nKategorije.value;
                    option3.setAttribute('style', 'color:#000');

                    if(pKategorija) pKategorija.add(option1);
                    if(pKategorija2) pKategorija2.add(option2);
                    if(pKategorija3) pKategorija3.add(option3);

                    showNotification(returnedData2.poruka, 2);
                }

                pKategorija.value = '';
                nKategorije.value = '';
            }); 
        }
        else{
            showNotification(returnedData.poruka,4);
        }
    });
}

function validnaIzmjenaKategorije(){

    if(document.getElementById('parentKategorija2').value == ""){
        showNotification("Molimo selektirajte kategoriju za izmjenu!",4);
        return false;
    }
    else if(document.getElementById('nazivKategorije2').value == ""){
        showNotification("Molimo unesite novi naziv kategorije!",4);
        return false;
    }

    return true;    
}


function izmijeniKategoriju(){

    if(!validnaIzmjenaKategorije()) return;

    let odabranaKategorija = document.getElementById('parentKategorija2').value;
    let modificiraniNaziv = document.getElementById('nazivKategorije2').value;

    $.post('/kategorija/edit', {stariNaziv:odabranaKategorija, noviNaziv:modificiraniNaziv}, function(returnedData){

        if(returnedData.ispravan == "DA"){

            showNotification(returnedData.poruka,2);
            azurirajDropdowneNakonEdita(odabranaKategorija,modificiraniNaziv);
            document.getElementById('parentKategorija2').value = "";
            document.getElementById('nazivKategorije2').value = "";            
            return false;
        }
        else{
            showNotification(returnedData.poruka,4);
            return false;
        }
    });
}

function obrisiKategoriju(){

    let kategorija = document.getElementById('parentKategorija3').value;

    if(kategorija == ""){
        showNotification("Odaberite kategoriju koju želite obrisati!",4);
    }
    else{

        $.post('/kategorija/remove', {naziv:kategorija}, function(returnedData){

            if(returnedData.ispravan == "NE"){
                showNotification(returnedData.poruka,4);                
            }
            else{
                showNotification(returnedData.poruka,2);
                azurirajDropdowneNakonBrisanja(kategorija);
                document.getElementById('parentKategorija3').value = "";                
            }
        });
    }
}

function azurirajDropdowneNakonBrisanja(naziv){

    let parentDropdown1 = document.getElementById('parentKategorija1');
    let parentDropdown2 = document.getElementById('parentKategorija2');
    let parentDropdown3 = document.getElementById('parentKategorija3');

    for(let i=0; i<parentDropdown1.options.length; i++){

        if(parentDropdown1.options[i].text == naziv){
            parentDropdown1.remove(i);
            parentDropdown2.remove(i);
            parentDropdown3.remove(i);
            break;
        }
    }
}


function azurirajDropdowneNakonEdita(stariNaziv,noviNaziv){

    let parentDropdown1 = document.getElementById('parentKategorija1');
    let parentDropdown2 = document.getElementById('parentKategorija2');
    let parentDropdown3 = document.getElementById('parentKategorija3'); 

    for(let i=0; i<parentDropdown1.options.length; i++){

        if(parentDropdown1.options[i].text == stariNaziv){
            parentDropdown1.options[i].text = noviNaziv;
            parentDropdown2.options[i].text = noviNaziv;
            parentDropdown3.options[i].text = noviNaziv;
            break;
        }
    }
}

function kategorijeOnload(){

    $.get('/user/current/allPrivileges', function(returnedData){

        if(returnedData.poruka == 'OK'){            

            let parentDropdown1 = null;
            let parentDropdown2 = null;
            let parentDropdown3 = null;
            
            if(returnedData == null || returnedData.rezultat == null) return;

            let privilegije = Object.values(returnedData.rezultat);

            for(let i=0; i<privilegije.length; i++){
                if(privilegije[i] == 'Dodaj kategoriju') parentDropdown1 = document.getElementById('parentKategorija1');
                else if(privilegije[i] == 'Izmijeni kategoriju') parentDropdown2 = document.getElementById('parentKategorija2');
                else if(privilegije[i] == 'Obrisi kategoriju') parentDropdown3 = document.getElementById('parentKategorija3');
            }

            $.get('/dajSveKategorije', function(returnedData2){

                if(returnedData2 == null || returnedData2.rezultat == null) return;
        
                let sveKategorije = Object.values(returnedData2.rezultat); 
        
                for(let i=0; i<sveKategorije.length; i++){
        
                    let option1 = document.createElement('option');
                    option1.setAttribute('style', 'color:#000');
                    option1.text = sveKategorije[i].naziv;
        
                    let option2 = document.createElement('option');
                    option2.setAttribute('style', 'color:#000');
                    option2.text = sveKategorije[i].naziv;
        
                    let option3 = document.createElement('option');
                    option3.setAttribute('style', 'color:#000');
                    option3.text = sveKategorije[i].naziv;

                    if(parentDropdown1) parentDropdown1.add(option1);
                    if(parentDropdown2) parentDropdown2.add(option2);
                    if(parentDropdown3) parentDropdown3.add(option3);
                }
        
                if(parentDropdown1) parentDropdown1.value = '';
                if(parentDropdown2) parentDropdown2.value = '';
                if(parentDropdown3) parentDropdown3.value = '';
            });
        }
        else{
            showNotification(returnedData.poruka,4);
        }
    });

    /*let parentDropdown1 = document.getElementById('parentKategorija1');
    let parentDropdown2 = document.getElementById('parentKategorija2');
    let parentDropdown3 = document.getElementById('parentKategorija3');  */  

    
}


function changeForm(a){
    var prva = document.getElementById("dodavanjeKategorije");
    var druga = document.getElementById("izmjenaKategorije");
    var treca = document.getElementById("brisanjeKategorije");

    var prviButton = document.getElementById("button1");
    var drugiButton = document.getElementById("button2");
    var treciButton = document.getElementById("button3");

    if(prva == null)prva = document.getElementById("haha");
    if(druga == null)druga = document.getElementById("haha");
    if(treca == null)treca = document.getElementById("haha");
    if(prviButton == null)prviButton = document.getElementById("haha");
    if(drugiButton == null)drugiButton = document.getElementById("haha");
    if(treciButton == null)treciButton = document.getElementById("haha");

    if(a==1){
      prviButton.classList.add("active");
      drugiButton.classList.remove("active");
      treciButton.classList.remove("active");

      prva.style.display = "block";
      druga.style.display = "none";
      treca.style.display = "none";

      window.location='#dodavanjeKategorije';
    }
    else if(a==2){
        prviButton.classList.remove("active");
        drugiButton.classList.add("active");
        treciButton.classList.remove("active");
  
        prva.style.display = "none";
        druga.style.display = "block";
        treca.style.display = "none";
  
        window.location='#izmjenaKategorije';
    }
    else if(a==3){
        prviButton.classList.remove("active");
        drugiButton.classList.remove("active");
        treciButton.classList.add("active");
  
        prva.style.display = "none";
        druga.style.display = "none";
        treca.style.display = "block";
  
        window.location='#brisanjeKategorije';
    }
    else{
      prviButton.classList.add("active");
      drugiButton.classList.remove("active");
      treciButton.classList.remove("active");

      prva.style.display = "block";
      druga.style.display = "none";
      treca.style.display = "none";
    }
}

function testnaFunkcija(){

    $.post('/proizvod/remove', {naziv:'iPhone 7 siva'}, function(returnedData){

        console.log(returnedData.poruka);
    });
}

function logOut() {

    $.get('/logout', function (returnedData) {
        window.location.replace('/login.html');
    });
}