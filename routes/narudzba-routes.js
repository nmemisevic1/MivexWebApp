module.exports = (app, ensureAuthenticated, client, nazivMongoBaze) => {

    function logZapis(zapis,req){
      
        let trenutniDatum = dajTrenutnoVrijemeIDatum();                      
        let noviObjekat = {korisnik:req.user.username, datum:trenutniDatum.datum, vrijeme:trenutniDatum.vrijeme, zapis:zapis};

        client.db(nazivMongoBaze).collection("log-files").insertOne(noviObjekat, function(error,result){

            if(error){
                //res.send({"poruka":"Greška prilikom upisa log files u bazu podataka!"});
            }
            else{
                // res.send({"poruka":"Uspješno dodan log files zapis!"});
            }
        });                                  
    }
    
    function dajTrenutnoVrijemeIDatum(){
    
        var datum = new Date();
        
        var dan = datum.getUTCDate();
        var mjesec = datum.getUTCMonth()+1;
        var godina = datum.getUTCFullYear();

        //Kreiramo trenutno vrijeme
        let sati = datum.getHours();
        if(sati < 10) sati = "0" + sati;

        let minute = datum.getMinutes();
        if(minute < 10) minute = "0" + minute;

        let sekunde = datum.getSeconds();
        if(sekunde < 10) sekunde = "0" + sekunde;

        var vrijeme = sati + ":" + minute + ":" + sekunde;
    
        var datumString = godina + "-" + mjesec + "-" + dan;
        
        return {datum:new Date(datumString), vrijeme: vrijeme};
    }  

    //Funkcija koja vraca danasnji datum u formatu yyyy-mm-dd
    function getCurrentDate(){        
        
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }

    app.post('/dodajNovuNarudzbu', ensureAuthenticated, function(req,res){

        let nazivProizvoda = req.body.nazivProizvoda;
        let brojKomada = parseInt(req.body.brojKomada);
        let datumNarudzbe = req.body.datumNarudzbe;
        let datumIsporuke = req.body.datumIsporuke;
        let racun = req.body.racun;
        let nabavnaCijena = parseFloat(req.body.nabavnaCijena.replace(',','.'));
        let ekstenzijaSlike = req.body.ekstenzijaSlike;
        let proizvodID = req.body.proizvodID;
        let trackingNumber = req.body.trackingNumber;
        let ebayPretraga = req.body.ebayPretraga;

        let novaNarudzba = {nazivProizvoda:nazivProizvoda, brojKomada:brojKomada, datumNarudzbe:datumNarudzbe ,datumIsporuke:datumIsporuke,
                            racun:racun, nabavnaCijena:nabavnaCijena, proizvodID:proizvodID, ekstenzijaSlike:ekstenzijaSlike,
                            trackingNumber:trackingNumber, ebayPretraga:ebayPretraga};

        client.db(nazivMongoBaze).collection("narudzbe").insertOne(novaNarudzba, function(error,result){

            if(error){
                res.send({"poruka":"Greška prilikom upisa u bazu podataka!"});                
            }
            else{
                logZapis('Registrovana nova narudžba. Naziv proizvoda: ' + nazivProizvoda + ", Broj komada: " + brojKomada + ", Tracking number: " + trackingNumber,req);
                res.send({"poruka":"Uspješno registrovana nova narudžba!"});
            }
        });
    });


    app.get('/dajSveNarudzbe', ensureAuthenticated, function(req,res){
    
        client.db(nazivMongoBaze).collection("narudzbe").find({}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                
                res.send({"poruka":"OK", "rezultat":result});
            }
        });
    });

    app.post('/obrisiNarudzbu', ensureAuthenticated, function(req,res){

        let nazivProizvoda = req.body.nazivProizvoda;
        let brojKomada = parseInt(req.body.brojKomada); 
        let racun = req.body.racun;               
        let datumNarudzbe = req.body.datumNarudzbe;
        let datumIsporuke = req.body.datumIsporuke;        
        //let nabavnaCijena = parseFloat(req.body.nabavnaCijena.replace(',','.'));
        let trackingNumber = req.body.trackingNumber;

        let objekatZaObrisati = {nazivProizvoda:nazivProizvoda, brojKomada:brojKomada, datumNarudzbe:datumNarudzbe, datumIsporuke:datumIsporuke,racun:racun,
                                 trackingNumber:trackingNumber};

        client.db(nazivMongoBaze).collection("narudzbe").deleteOne(objekatZaObrisati , function(err1,obj){
            
            if(err1){
                res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"}); 
            }
            else{
                logZapis('Obrisana narudžba. Naziv proizvoda: ' + nazivProizvoda + ", Broj komada: " + brojKomada,req);
                res.send({"ispravan":"DA", "poruka":"Uspješno obrisana narudžba!"});
            }
        });      
    });


    app.post('/narudzba/edit', ensureAuthenticated, function(req,res){

        let nazivProizvoda = req.body.nazivProizvoda;
        let brojKomada = parseInt(req.body.brojKomada); 
        let racun = req.body.racun;               
        let datumNarudzbe = req.body.datumNarudzbe;
        let datumIsporuke = req.body.datumIsporuke;        
        let nabavnaCijena = parseFloat(req.body.nabavnaCijena.replace(',','.'));
        let trackingNumber = req.body.trackingNumber;

        let stariNazivProizvoda = req.body.stariNazivProizvoda;
        let stariBrojKomada = parseInt(req.body.stariBrojKomada); 
        let stariRacun = req.body.stariRacun;               
        let stariDatumNarudzbe = req.body.stariDatumNarudzbe;
        let stariDatumIsporuke = req.body.stariDatumIsporuke;        
        let staraNabavnaCijena = parseFloat(req.body.staraNabavnaCijena.replace(',','.'));
        let stariTrackingNumber = req.body.stariTrackingNumber;

        let newValues = {$set: {nazivProizvoda:nazivProizvoda, nabavnaCijena:nabavnaCijena, brojKomada:brojKomada, racun:racun, datumNarudzbe:datumNarudzbe,
                                datumIsporuke:datumIsporuke, trackingNumber:trackingNumber}};

        client.db(nazivMongoBaze).collection("narudzbe").updateOne({nazivProizvoda:stariNazivProizvoda, brojKomada:stariBrojKomada, datumNarudzbe:stariDatumNarudzbe,
        datumIsporuke:stariDatumIsporuke, racun:stariRacun, nabavnaCijena:staraNabavnaCijena, trackingNumber:stariTrackingNumber}, newValues, function(err2,res2){

            if(err2){
                res.send({"poruka":"Greška prilikom upisa u bazi podataka!"});
            }
            else{
                logZapis('Editovana narudžba. Naziv proizvoda: ' + nazivProizvoda + ", Stari broj komada: " + stariBrojKomada + 
                ", Novi broj komada: " + brojKomada + ", Stara nabavna cijena: " + staraNabavnaCijena + ", Nova nabavna cijena: " + nabavnaCijena,req);

                res.send({"poruka":"Uspješno ažurirani podaci za narudžbu!"});
            }
        });
    });


    app.post('/narudzba/delivered', ensureAuthenticated, function(req,res){

        let nazivProizvoda = req.body.nazivProizvoda;
        let brojKomada = parseInt(req.body.brojKomada); 
        let racun = req.body.racun;               
        let datumNarudzbe = req.body.datumNarudzbe;
        let datumIsporuke = req.body.datumIsporuke;        
        let nabavnaCijena = parseFloat(req.body.nabavnaCijena.replace(',','.'));
        let trackingNumber = req.body.trackingNumber;

    
        client.db(nazivMongoBaze).collection("narudzbe").deleteOne({nazivProizvoda:nazivProizvoda, brojKomada:brojKomada, datumNarudzbe:datumNarudzbe, datumIsporuke:datumIsporuke, racun:racun, nabavnaCijena:nabavnaCijena, trackingNumber:trackingNumber}, function(err1,obj){

            if(err1){
                res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"}); 
            }
            else{                        

                client.db(nazivMongoBaze).collection("proizvodi").find({nazivProizvoda:nazivProizvoda}).toArray(function(error,result){

                    if(error){
                        res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"});
                    }
                    else if(result.length == 0){
                        res.send({"ispravan":"NE", "poruka":"Proizvod nije pronađen u bazi. Vjerovatno je obrisan iz baze proizvoda u međuvremenu."});
                    }
                    else{
                        
                        let novaNabavnaCijena = parseFloat((result[0].brojKomada*parseFloat(result[0].nabavnaCijena)+brojKomada*parseFloat(nabavnaCijena))/ (result[0].brojKomada+brojKomada)); 
                        let ukupnoKomada = parseInt(result[0].brojKomada)+brojKomada;
                        let newValues;

                        if(result[0].brojKomada == 0){
                            newValues = {$set: {brojKomada:ukupnoKomada, nabavnaCijena:novaNabavnaCijena, prosjekProdaje:0, pocetniBrojKomada:brojKomada, datumNabavke:new Date(getCurrentDate())}};
                        }
                        else{
                            newValues = {$set: {brojKomada:ukupnoKomada, nabavnaCijena:novaNabavnaCijena}};
                        }
                        

                        client.db(nazivMongoBaze).collection("proizvodi").updateOne({nazivProizvoda:nazivProizvoda}, newValues, function(err2,res2){
    
                            if(err2){                                        
                                res.send({"ispravan":"NE", "poruka":"Greška prilikom dodavanja novih proizvoda na stanje!"});                                        
                            }
                            else{
                                logZapis('Registrovana pristigla narudžba. Naziv proizvoda: ' + nazivProizvoda + ', Broj komada: ' + brojKomada,req);                               
                                res.send({"ispravan":"DA", "poruka":"Uspješno registrovana pristigla narudžba"});        
                            }
                        });
                    }
                });                       
                
            }   
            
        });      
    });

    app.get('/narudzba/pretraga', ensureAuthenticated, function(req,res){

        let pretraga = req.query.pretraga;


        client.db(nazivMongoBaze).collection("narudzbe").find({}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{
                
                let rijeci = pretraga.split(' ');
                let rez = [];

                for(let i=0; i<result.length; i++){                            

                    let pass = true;
                    for(let j=0; j<rijeci.length; j++){

                        if(result[i].trackingNumber.includes(rijeci[j])){
                            pass = true;
                            break;
                        } 
                        
                        if(!result[i].nazivProizvoda.toUpperCase().includes(rijeci[j].toUpperCase())){
                            pass=false;
                            break;
                        }                                
                    }                            
                    
                    if(pass) rez.push(result[i]);
                }
                res.send({"poruka":"OK", "rezultat":rez});
            }
        });            
    });

    //Vraca sve ebay narudzbe koje kasne sa dostavom
    app.get('/narudzbe/kasnjenje', ensureAuthenticated, function(req,res){
    
        client.db(nazivMongoBaze).collection("narudzbe").find({}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{
                let rez = [];

                for(let i=0; i<result.length; i++){

                    if(new Date(result[i].datumIsporuke) < new Date()){
                        rez.push(result[i]);
                    }
                }                
                res.send({"poruka":"OK", "rezultat":rez});
            }
        });
    });
}