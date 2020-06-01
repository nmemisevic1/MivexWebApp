var brojNeprocitanihPoruka;

function ucitajPorukeUsera(){

    $.get('/obavijest/user', function(returnedData){

        if(returnedData == null) return;

        let poruke = [];
        let odKorisnika = [];

        for(let i=0; i<returnedData.rezultat.length; i++){
            poruke.push(returnedData.rezultat[i].tekst);
            odKorisnika.push(returnedData.rezultat[i].sender);
        }
        
        brojNeprocitanihPoruka = returnedData.rezultat.length;        
        var porukeSettingsActions = kreirajElement("a",{"class":"dropdown-item","style":"cursor:pointer;"});
        porukeSettingsActions.innerText = "Označi sve kao pročitane";

        porukeSettingsActions.onclick = function(){
            // OZNAČITI SVE PORUKE KAO PROČITANE BACKEND

            $.post('/obavijest/sveProcitane', function(returnedData2){

                if(returnedData2 == null) return;

                if(returnedData2.poruka == 'OK'){
                    for(let i=0;i<returnedData.rezultat.length;i++){
                        document.getElementById("poruka"+i.toString()).classList.add("text-muted");
                        document.getElementById("odKorisnika"+i.toString()).classList.add("text-muted");
                    }
                    brojNeprocitanihPoruka = 0;
                    document.getElementById("headercicPoruke").innerText = "Poruke (" + brojNeprocitanihPoruka.toString() + ")";
                }
                else{
                    showNotification(returnedData2.poruka,4);
                }                  
            });  
        }

        document.getElementById("porukeSettingsActions").appendChild(porukeSettingsActions);        
        document.getElementById("headercicPoruke").innerText = "Poruke (" + brojNeprocitanihPoruka.toString() + ")";

        for(let i=0; i<returnedData.rezultat.length; i++){
            var tr = kreirajElement("tr",{});

            var td1 = kreirajElement("td",{});
            //td1.innerHTML = "<div class='form-check'><label class='form-check-label'><input class='form-check-input' type='checkbox' value=''><span class='form-check-sign'><span class='check'></span></span></label></div>";   
                        
            var td3 = kreirajElement("td",{"id":"kvakica"+i.toString()});
            td3.innerHTML = "<button type='button' rel='tooltip' title='' class='btn btn-link' data-original-title='Edit Task'><i class='tim-icons icon-check-2'></i></button>";
            td3.onclick = function(){
                var procitana = false;
                // ako je bila procitana stavi je na neprocitanu i obrnuto u backendu!
                var idP = this.id.substring(7,this.id.length);
                let tekstPoruke = document.getElementById("poruka"+idP).innerHTML;

                if(document.getElementById("poruka"+idP).classList.length>0){
                    
                    $.post('/obavijest/procitana', {tekst:tekstPoruke, procitana:false}, function(returnedData){
                        
                        if(returnedData == null) return;

                        if(returnedData.poruka == 'OK'){
                            document.getElementById("poruka"+idP).classList.remove("text-muted");
                            procitana = false;
                        }
                        else{
                            showNotification(returnedData.poruka,4);
                        }
                        
                        if(document.getElementById("odKorisnika"+idP).classList.length>1)document.getElementById("odKorisnika"+idP).classList.remove("text-muted");
                        else document.getElementById("odKorisnika"+idP).classList.add("text-muted");

                        if(procitana){brojNeprocitanihPoruka--;}
                        else brojNeprocitanihPoruka++;
                        document.getElementById("headercicPoruke").innerText = "Poruke (" + brojNeprocitanihPoruka + ")";
                    });                    
                }
                else {
                    
                    $.post('/obavijest/procitana', {tekst:tekstPoruke, procitana:true}, function(returnedData){
                        
                        if(returnedData == null) return;

                        if(returnedData.poruka == 'OK'){
                            document.getElementById("poruka"+idP).classList.add("text-muted");
                            procitana = true;
                        }
                        else{
                            showNotification(returnedData.poruka, 4);
                        }

                        if(document.getElementById("odKorisnika"+idP).classList.length>1)document.getElementById("odKorisnika"+idP).classList.remove("text-muted");
                        else document.getElementById("odKorisnika"+idP).classList.add("text-muted");

                        if(procitana)brojNeprocitanihPoruka--;
                        else brojNeprocitanihPoruka++;
                        document.getElementById("headercicPoruke").innerText = "Poruke (" + brojNeprocitanihPoruka + ")";
                    });                    
                }
                                
            };
            
            var td2 = kreirajElement("td",{});
            var naslovPoruke = odKorisnika[i];
            var porukica = poruke[i];

            var title = kreirajElement("p",{"class":"title","id":"odKorisnika"+i.toString()});
            var messageBody = kreirajElement("p",{"class":"","id":"poruka"+i.toString()});
            

            title.innerText = naslovPoruke;
            messageBody.innerText = porukica;
            td2.appendChild(title);
            td2.appendChild(messageBody);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            document.getElementById("notifikacijeKorisnika").appendChild(tr);

            // ubacivanje poruka u onaj gore kurac lafo notifikator..... bullshit
            var li = kreirajElement("li",{"class":"nav-link"});
            var a = kreirajElement("a",{"href":"#notifikacije","class":"nav-item dropdown-item"});
            a.innerHTML = "<b>"+odKorisnika[i]+"</b>: "+ porukica;
            //a.innerText = odKorisnika[i] + ":" + porukica;
            li.appendChild(a);
            document.getElementById("notifikacijaNotifikacije").appendChild(li);
        }
    });
}