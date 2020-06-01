module.exports = (app, upload, ensureAuthenticated, client, nazivMongoBaze) => {

    const fs = require("fs");
    const path = require("path");
    const VRIJEDNOST_DOLARA = 1.8;

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

    app.post('/dodajNoviProizvod', ensureAuthenticated, upload.single("files" /* name attribute of <file> element in your form */), (req,res) => {

        let nazivProizvoda = req.body.nazivProizvoda.trim();
        let ebayPretraga = req.body.ebayPretraga;
        let nabavnaCijena = parseFloat(req.body.nabavnaCijena.replace(',','.'));
        let prodajnaCijena = parseFloat(req.body.prodajnaCijena.replace(',','.'));
        let brojKomada = parseInt(req.body.brojKomada);
        let kategorija = req.body.parentKategorija;
        let baza = req.body.baza; 
        let datumNabavke = new Date(getCurrentDate());       

    
        client.db(nazivMongoBaze).collection("proizvodi").find({nazivProizvoda:req.body.nazivProizvoda}).toArray(function(error,result){

                if(error){
                    res.send({"poruka":"Greška pri pristupu bazi podataka!"});            
                }
                else{
                    if(result.length != 0){
                        
                        for(let i=0; i<result.length; i++){
                            if(result[i].baza == baza){
                                res.send({"poruka":"Proizvod sa istim imenom već postoji u bazi!"});
                                return;
                            }
                        }
                        
                        client.db(nazivMongoBaze).collection("proizvodi").insertOne(
                            {
                                nazivProizvoda:nazivProizvoda,
                                ebayPretraga:ebayPretraga,
                                nabavnaCijena:nabavnaCijena,
                                prodajnaCijena:prodajnaCijena,
                                brojKomada:brojKomada,
                                kategorija:kategorija,
                                //ekstenzijaSlike:path.extname(req.file.originalname),
                                ekstenzijaSlike: path.extname(req.file.originalname).toLocaleLowerCase(),
                                baza:baza,
                                narucitiAlert: true,
                                datumNabavke: datumNabavke,
                                datumPosljednjeProdaje: new Date(),
                                //pocetniBrojKomada: brojKomada,
                                prosjekProdaje: 0,
                                ukupnoProdano:0                                                                           
                            }
                        , function(error1,result1){

                            if(error1){
                                res.send({"poruka":"Greška pri pristupu upisu u podataka!"});            
                            }
                            else{  
                                client.db(nazivMongoBaze).collection("proizvodi").findOne({nazivProizvoda:nazivProizvoda} ,function(error2,result2){

                                    if(error2){
                                        res.send({"poruka":"Greška pri pristupu bazi podataka!"});            
                                    }
                                    else{        
                                                                    
                                        const tempPath = req.file.path;
                                        const targetPath = path.join(__dirname, "/../assets/img/" + result2._id + path.extname(req.file.originalname).toLowerCase());
        
                                        fs.rename(tempPath, targetPath, function(err3) {
                                            if (err3){
                                                res.send({"poruka":"Greška prilikom spašavanje slike na server!"})
                                            }
                                            else{       
                                                logZapis("Dodan novi proizvod. Naziv: "+nazivProizvoda + ", broj komada: " + brojKomada + ", baza: " + baza + ", nabavna: " + nabavnaCijena + ", prodajna: " + prodajnaCijena,req);                                                                                         
                                                res.send({"poruka":"Uspješno dodan novi proizvod"});
                                            }                              
                                        });                                  
                                            
                                    }
                                }); 
                            }
                        });

                    
                    }
                    else{                                                                                     

                        client.db(nazivMongoBaze).collection("proizvodi").insertOne(
                            {
                                nazivProizvoda:nazivProizvoda,
                                ebayPretraga:ebayPretraga,
                                nabavnaCijena:nabavnaCijena,
                                prodajnaCijena:prodajnaCijena,
                                brojKomada:brojKomada,
                                kategorija:kategorija,
                                //ekstenzijaSlike:path.extname(req.file.originalname),
                                ekstenzijaSlike: path.extname(req.file.originalname).toLocaleLowerCase(),
                                baza:baza,
                                narucitiAlert: true,
                                datumNabavke: datumNabavke,
                                datumPosljednjeProdaje: new Date(),
                                //pocetniBrojKomada: brojKomada,
                                prosjekProdaje: 0,
                                ukupnoProdano: 0                                                                           
                            }
                        , function(error1,result1){

                            if(error1){
                                res.send({"poruka":"Greška pri pristupu upisu u podataka!"});            
                            }
                            else{  
                                client.db(nazivMongoBaze).collection("proizvodi").findOne({nazivProizvoda:nazivProizvoda} ,function(error2,result2){

                                    if(error2){
                                        res.send({"poruka":"Greška pri pristupu bazi podataka!"});            
                                    }
                                    else{        
                                                                    
                                        const tempPath = req.file.path;
                                        const targetPath = path.join(__dirname, "/../assets/img/" + result2._id + path.extname(req.file.originalname).toLowerCase());
        
                                        fs.rename(tempPath, targetPath, function(err3) {
                                            if (err3){
                                                res.send({"poruka":"Greška prilikom spašavanje slike na server!"})
                                            }
                                            else{
                                                logZapis("Dodan novi proizvod. Naziv: "+nazivProizvoda + ", Broj komada: " + brojKomada + ", Baza: " + baza + ", Nabavna: " + nabavnaCijena + ", Prodajna: " + prodajnaCijena,req);                                                                                         
                                                res.send({"poruka":"Uspješno dodan novi proizvod"});
                                            }                              
                                        });                                  
                                            
                                    }
                                }); 
                            }
                        });                           
                    }
                }
        });
    });


    app.get('/dajSveProizvode', ensureAuthenticated, function(req,res){

        client.db(nazivMongoBaze).collection("proizvodi").find({}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                
                res.send({"poruka":"OK", "rezultat":result});
            }
        });            
    });


    app.post('/prodajProizvod', ensureAuthenticated, function(req,res){
    
        client.db(nazivMongoBaze).collection("proizvodi").findOne({nazivProizvoda:req.body.nazivProizvoda}, function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else if(result.length == 0){                
                res.send({"poruka":"Iz nekog razloga proizvod nije pronađen u bazi. Obavijestiti developera!"});
            }
            else{
                if(result.brojKomada < parseInt(req.body.brojKomada)){
                    res.send({"poruka":"Na stanju je dostupno " + result.brojKomada.toString() + " komada, a Vi želite prodati " + req.body.brojKomada.toString() + " komada!"});
                }
                else{
                    const date1 = new Date();
                    const date2 = result.datumNabavke;
                    const date3 = result.datumPosljednjeProdaje;
                    
                    //Broj dana izmedju danasnjeg dana i dana nabavke
                    const diffTime1 = Math.abs(date2.getTime() - date1.getTime());
                    const diffDays1 = Math.ceil(diffTime1 / (1000 * 60 * 60 * 24));

                    //Broj dana izmedju dana posljednje prodaje i nabavke
                    const diffTime2 = Math.abs(date2.getTime() - date3.getTime());
                    const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));

                    let noviProsjekProdaje;
                    let brojKomadaProslost = 0;

                    /*if(diffDays == 0) noviProsjekProdaje = result.pocetniBrojKomada-(result.brojKomada-parseInt(req.body.brojKomada));
                    else noviProsjekProdaje = (result.pocetniBrojKomada-(result.brojKomada-parseInt(req.body.brojKomada)))/diffDays;*/
                    if(diffDays2 == 0) brojKomadaProslost = result.prosjekProdaje;
                    else brojKomadaProslost = parseFloat(result.prosjekProdaje) * diffDays2;

                    if(diffDays1 == 0) noviProsjekProdaje = parseFloat(result.prosjekProdaje) + parseInt(req.body.brojKomada);
                    else noviProsjekProdaje = (brojKomadaProslost + parseInt(req.body.brojKomada))/diffDays1;
                    
                    let newvalues = { 
                        $set: {
                            brojKomada: result.brojKomada-parseInt(req.body.brojKomada),
                            prosjekProdaje:noviProsjekProdaje,
                            ukupnoProdano: result.ukupnoProdano + parseInt(req.body.brojKomada),
                            datumPosljednjeProdaje: new Date() 
                        }
                    };

                    client.db(nazivMongoBaze).collection("proizvodi").updateOne({nazivProizvoda:req.body.nazivProizvoda}, newvalues, function(err2, res2) {
                        if (err2){
                            res.send({"poruka":"Update stanja u bazi nije uspio!"});
                        }
                        else{
                            zabiljeziProdajuProizvoda(req.body.nazivProizvoda, parseInt(req.body.brojKomada), result.nabavnaCijena, result.prodajnaCijena, result.kategorija);
                            logZapis("Prodan proizvod. Naziv: " + req.body.nazivProizvoda + ", Broj komada: " + req.body.brojKomada,req);
                            res.send({"poruka":"Uspješno prodan proizvod"});
                        }                         
                        
                    });
                }                    
            }
        });
    });


    function zabiljeziProdajuProizvoda(nazivProizvoda, brojKomada, nabavnaCijena, prodajnaCijena, kategorija){

        client.db(nazivMongoBaze).collection("sales-records").insertOne(
            {
                nazivProizvoda:nazivProizvoda,
                brojKomada:brojKomada,
                datum:getCurrentDate(),
                prihod: brojKomada * prodajnaCijena,
                rashod: brojKomada * nabavnaCijena * VRIJEDNOST_DOLARA,
                kategorija: kategorija
            }, 
            
            function(error,result){
            }
        );
    }


    app.get('/dajPodatkeProizvoda', ensureAuthenticated, function(req,res){

        let nazivProizvoda = req.query.nazivProizvoda;
    
        client.db(nazivMongoBaze).collection("proizvodi").findOne({nazivProizvoda:nazivProizvoda}, function(error,result){

            if(error){
                res.send({"poruka":"Greška prilikom pristupa bazi podataka!"});
            }
            else if(result.length == 0){
                res.send({"poruka":"Proizvod nije pronađen u bazi. Obavijestiti developera o ovoj greški!"});
            }
            else{
                res.send({"poruka":"OK", "rezultat":result});
            }
        });
    });


    app.post('/editProizvod', ensureAuthenticated, upload.single("files" /* name attribute of <file> element in your form */), (req,res) => {
        
        let nazivProizvoda = req.body.imeProizvodaEdit.trim();
        let ebayPretraga = req.body.ebayPretragaEdit;
        let nabavnaCijena = parseFloat(req.body.nabavnaCijenaEdit.replace(',','.'));
        let prodajnaCijena = parseFloat(req.body.prodajnaCijenaEdit.replace(',','.'));
        let brojKomada = parseInt(req.body.brojKomadaEdit);
        let kategorija = req.body.parentKategorija;
        let baza = req.body.baza;
        let stariNazivProizvoda = req.body.stariNazivProizvoda;
        let narudzbaAlert = (req.body.narudzbaAlert == "true"); 


        let newValues = {$set: {nazivProizvoda:nazivProizvoda, ebayPretraga:ebayPretraga, nabavnaCijena:nabavnaCijena, prodajnaCijena:prodajnaCijena, brojKomada:brojKomada, kategorija:kategorija, baza:baza, narucitiAlert:narudzbaAlert}};

        client.db(nazivMongoBaze).collection("proizvodi").updateOne({nazivProizvoda:stariNazivProizvoda}, newValues, function(err2,res2){

            if(err2){                     
                res.send({"poruka":"Greška prilikom dodavanja!"});
            }
            else{

            if(typeof req.file === 'undefined'){
                logZapis('Editovan proizvod. Naziv proizvoda: ' + stariNazivProizvoda,req);
                res.send({"poruka":"Uspješno ažurirani podaci za proizvod"});
            }
            }
        });

        client.db(nazivMongoBaze).collection("proizvodi").findOne({nazivProizvoda:nazivProizvoda} ,function(error2,result2){

        if(error2){
            res.send({"poruka":"Greška pri pristupu bazi podataka!"});            
        }
        else{                      
            
            if(typeof req.file != 'undefined'){

                const tempPath = req.file.path;
                const targetPath = path.join(__dirname, "/../assets/img/" + result2._id + path.extname(req.file.originalname).toLowerCase());

                fs.rename(tempPath, targetPath, function(err3) {
                    if (err3){
                        res.send({"poruka":"Greška prilikom spašavanje slike na server!"})
                    }
                    else{
                        logZapis('Editovan proizvod. Naziv proizvoda: ' + stariNazivProizvoda,req);
                        res.send({"poruka":"Uspješno ažurirani podaci za proizvod"});
                    }                              
                });
            }                                                           
            
        }
        }); 
    });


     app.post('/stornirajProdajuProizvoda', ensureAuthenticated, function(req,res){

        let nazivProizvoda = req.body.nazivProizvoda;
        let brojStorniranihKomada = parseInt(req.body.brojStorniranihKomada);


        client.db(nazivMongoBaze).collection("proizvodi").findOne({nazivProizvoda:nazivProizvoda}, function(error, result){

            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else if(result.length == 0){                
                res.send({"poruka":"Iz nekog razloga proizvod nije pronađen u bazi. Obavijestiti developera!"});
            }
            else{
                let newValues = {
                    $set: {
                        brojKomada: brojStorniranihKomada + parseInt(result.brojKomada),
                        ukupnoProdano: result.ukupnoProdano - brojStorniranihKomada
                    }
                };

                client.db(nazivMongoBaze).collection("proizvodi").updateOne({nazivProizvoda:nazivProizvoda}, newValues, function(err2,res2){
        
                    if(err2){
                        res.send({"poruka":"Greška prilikom dodavanja novih proizvoda na stanje!"});
                    }
                    else{
                        logZapis('Stornirana prodaja. Naziv proizvoda: ' + nazivProizvoda + ', Broj storniranih komada: ' + brojStorniranihKomada,req);
                        res.send({"poruka":"Uspješno ažurirani podaci za proizvod!"});
                    }
                });
        
            }
        });
     });

     app.post('/dodajNaStanje', ensureAuthenticated, function(req,res){

        let nazivProizvoda = req.body.nazivProizvoda;
        let brojKomada = parseInt(req.body.brojKomada);

        client.db(nazivMongoBaze).collection("proizvodi").findOne({nazivProizvoda:nazivProizvoda}, function(error, result){

            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else if(result.length == 0){                
                res.send({"poruka":"Iz nekog razloga proizvod nije pronađen u bazi. Obavijestiti developera!"});
            }
            else{
                let newValues;

                if(result.brojKomada == 0) newValues = {$set: {brojKomada: brojKomada.toString(), prosjekProdaje:0, datumNabavke:new Date(getCurrentDate())}};
                else newValues = {$set: {brojKomada: (brojKomada + parseInt(result.brojKomada)).toString()}};

                client.db(nazivMongoBaze).collection("proizvodi").updateOne({nazivProizvoda:nazivProizvoda}, newValues, function(err2,res2){
        
                    if(err2){
                        res.send({"poruka":"Greška prilikom dodavanja novih proizvoda na stanje!"});
                    }
                    else{
                        logZapis('Dodan određeni broj komada na stanje. Naziv proizvoda: ' + nazivProizvoda + ', Broj dodanih komada: ' + brojKomada,req);
                        res.send({"poruka":"Uspješno ažurirani podaci za proizvod!"});
                    }
                });
            }
        });
     });


     app.get('/proizvod/allDatabases', ensureAuthenticated, function(req,res){

        let nazivProizvoda = req.query.nazivProizvoda;
    
        client.db(nazivMongoBaze).collection("proizvodi").find({nazivProizvoda:nazivProizvoda}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                       
                res.send({"poruka":"OK", "rezultat":result[0].baza});
            }
        });
    });

    //Vraca sve proizvode iz kategorije koja je proslijedjena preko GET zahtjeva
    app.get('/proizvod/category', ensureAuthenticated, function(req,res){

        let kategorija = req.query.kategorija;
                
        client.db(nazivMongoBaze).collection("users-session-info").find({user:req.user.username}).toArray(function(error, result){

            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka prilikom očitavanja podataka sesije za trenutnog korisnika!", "rezultat":null});
            }
            else if(result.length == 0){
                res.send({"poruka":"Trenutni korisnik nije pronađen u bazi prilikom očitavanja podataka sesije za trenutnog korisnika! Obavijestiti developera!", "rezultat":null});
            }
            else{

                client.db(nazivMongoBaze).collection("proizvodi").find({kategorija:kategorija, baza:result[0].aktivnaBaza}).toArray(function(error, result){
            
                    if(error){
                        res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
                    }
                    else{                       
                        res.send({"poruka":"OK", "rezultat":result});
                    }
                });
                // res.send({"poruka":"OK", "rezultat":result[0].aktivnaBaza});
            }
        });
    });

    //Vraca sve nazive proizvoda kao niz stringova. Koristi se za filter u pretrazi proizvoda
    app.get('/proizvodi/nazivi', ensureAuthenticated, function(req,res){

        client.db(nazivMongoBaze).collection("proizvodi").find({}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{
                let sviNazivi = [];                        
                for(let i=0; i<result.length; i++) sviNazivi.push(result[i].nazivProizvoda);

                res.send({"poruka":"OK", "rezultat":sviNazivi});
            }
        });            
    });

    //Vraca sve proizvode koji odgovaraju datoj pretrazi
    app.get('/proizvodi/pretraga', ensureAuthenticated, function(req,res){

        let pretraga = req.query.pretraga;

        client.db(nazivMongoBaze).collection("users-session-info").find({user:req.user.username}).toArray(function(error1, result1){

            if(error1){
                res.send({"poruka":"Greška pri pristupu bazi podataka prilikom očitavanja podataka sesije za trenutnog korisnika!", "rezultat":null});
            }
            else if(result1.length == 0){
                res.send({"poruka":"Trenutni korisnik nije pronađen u bazi prilikom očitavanja podataka sesije za trenutnog korisnika! Obavijestiti developera!", "rezultat":null});
            }
            else{
                client.db(nazivMongoBaze).collection("proizvodi").find({baza:result1[0].aktivnaBaza}).toArray(function(error, result){
            
                    if(error){
                        res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
                    }
                    else{
                        
                        let rijeci = pretraga.split(' ');
                        let rez = [];

                        for(let i=0; i<result.length; i++){                            

                            let pass = true;
                            for(let j=0; j<rijeci.length; j++){
                                
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
            }
        });                           
    });

    //Brise proizvod za datim nazivom
    app.post('/proizvod/remove', ensureAuthenticated, function(req,res){

        let naziv = req.body.naziv;

        client.db(nazivMongoBaze).collection("proizvodi").find({nazivProizvoda:naziv}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{

                if(result == null){
                    res.send({"poruka":"Proizvod nije pronađen u bazi!"});
                    return;
                }

                let proizvodId = result[0]._id;
                let ekstenzijaSlike = result[0].ekstenzijaSlike;

                client.db(nazivMongoBaze).collection("proizvodi").deleteOne({nazivProizvoda:naziv}, function(err1,obj){

                    if(err1){
                        res.send({"poruka":"Greška pri pristupu bazi podataka!"}); 
                    }
                    else{
        
                        if(obj.result.n == 0) {
                            res.send({"poruka":"Proizvod nije pronađen u bazi!"});
                        }
                        else{
                            //console.log(__dirname + '/../assets/img/'+proizvodId.toString()+ekstenzijaSlike);
                            
                            client.db(nazivMongoBaze).collection("sales-records").deleteMany({nazivProizvoda:naziv}, function(err2,res2){

                                if (err2){
                                    res.send({"poruka":"Greška prilikom brisanja zapisa svih prodaja zabiljezenih za ovaj proizvod!"}); 
                                }
                                else{
                                    fs.unlink(__dirname + '/../assets/img/'+proizvodId.toString()+ekstenzijaSlike, (err) => {

                                        if (err){
                                          res.send({"poruka":"Greška prilikom brisanja slike ali proizvod je izbrisan iz baze!"}); 
                                        }
                                        else{
                                          logZapis("Obrisan proizvod. Naziv proizvoda: " + naziv,req);                        
                                          res.send({"poruka":"Uspješno obrisan proizvod!"});
                                        }
                                    });
                                }
                            }); 
                        }                        
                    }
                });   
            }
        });     
    });

    //Postavlja atribut za upozorenje za narudzbu na false. Proizvod se vise nece pojavljivati u preporucenim za naruciti
    app.post('/proizvod/editNarudzbaAlert', ensureAuthenticated, function(req,res){

        let narudzbaAlert = (req.body.narudzbaAlert == "true");
        let nazivProizvoda = req.body.nazivProizvoda;
               
        let newValues = {$set: {narucitiAlert:narudzbaAlert}};

        client.db(nazivMongoBaze).collection("proizvodi").updateOne({nazivProizvoda:nazivProizvoda}, newValues, function(err2,res2){

            if(err2){                     
                res.send({"poruka":"Greška prilikom ažuriranja postavki za obavijest o narudžbama!"});
            }
            else{
                res.send({"poruka":"Ovaj proizvod se više neće pojavljivati u preporukama za narudžbe!"});
            }
        });
    });

    function getDifferenceInDays(date1, date2){

        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    }

    //Vraca sve proizvode koje je potrebno naručiti. To su proizvodi sa 0 ili 1 komada na stanju, i proizvodi koji bi
    //trebali nestati u narednih 25 dana
    app.get('/proizvod/potrebnoNaruciti', ensureAuthenticated, function(req,res){

        client.db(nazivMongoBaze).collection("proizvodi").find({narucitiAlert: true }).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{   
                client.db(nazivMongoBaze).collection("narudzbe").find({}).toArray(function(error2, result2){

                    if(error2){                        
                        res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
                    }
                    else{
                        let rez = [];
                        let potrebnoNaruciti = [];
                        
                        for(let i=0; i<result.length; i++){
                            
                            let ukupanBrojKomada = result[i].brojKomada;

                            for(let j=0; j<result2.length; j++){                                        
                                if(result[i]._id == result2[j].proizvodID) ukupanBrojKomada += result2[j].brojKomada;
                            }

                            let procjenaPreostalihDana = 25;

                            //Broj dana od dana nabavke pa do danasnjeg dana
                            let dayDiff = getDifferenceInDays(result[i].datumNabavke, new Date());
                            //Broj dana od dana nabavke do dana posljednje prodaje
                            let differenceInDays = getDifferenceInDays(result[i].datumNabavke, result[i].datumPosljednjeProdaje);

                            //Broj komada prodanih u periodu od nabavke do dana posljednje prodaje
                            let brojKomada = differenceInDays * result[i].prosjekProdaje;
                            
                            //Pravi prosjek je ukupan broj prodanih komada kroz broj dana od nabavke pa do danas
                            let praviProsjekProdaje = brojKomada;

                            if(dayDiff != 0){
                                praviProsjekProdaje = brojKomada/dayDiff;
                            }
                            

                            if(praviProsjekProdaje != 0) procjenaPreostalihDana = ukupanBrojKomada/praviProsjekProdaje;

                            if(ukupanBrojKomada < 2 || procjenaPreostalihDana < 25 ){

                                let potrebnoNarucitiKomada = Math.ceil((25-procjenaPreostalihDana)*result[i].prosjekProdaje);

                                //Modifikovat cemo prosjek sa pravim prosjekom, da se pravi prikaze na frontu
                                result[i].prosjekProdaje = praviProsjekProdaje;

                                rez.push(result[i]);
                                potrebnoNaruciti.push({potrebnoNarucitiKomada});
                            } 
                        }
                        
                        res.send({"poruka":"OK", "rezultat":rez, "potrebnoNaruciti":potrebnoNaruciti});
                    }                            
                });                          
            }
        });            
    });
}