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

    app.post('/dodajNovuVrstuTroska', ensureAuthenticated, function(req,res){

        let vrstaTroska = req.body.vrstaTroska;

        let newObject = {vrstaTroska:vrstaTroska};

        client.db(nazivMongoBaze).collection("vrsteTroskova").find(newObject).toArray(function(err1,result){
            
            if(err1){
                res.send({"poruka":"Greška prilikom pretrage baze podataka!"});
            }
            else if(result.length != 0){
                res.send({"poruka":"Vrsta troška sa ovim imenom već postoji!"});
            }
            else{                    
                
                client.db(nazivMongoBaze).collection("vrsteTroskova").insertOne(newObject, function(err2,result2){

                    if(err2){
                        res.send({"poruka":"Greška prilikom upisa u bazu podataka!"});
                    }
                    else{
                        logZapis('Dodana nova vrsta troska: ' + vrstaTroska, req);
                        res.send({"poruka":"Uspješno dodana nova vrsta troška!"});
                    }
                });
            }
        });                   
    });


    app.get('/dajSveVrsteTroskova', ensureAuthenticated, function(req,res){
    
        client.db(nazivMongoBaze).collection("vrsteTroskova").find({}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                
                res.send({"poruka":"OK", "rezultat":result});
            }
        });
    });


    app.post('/obrisiVrstuTroska', ensureAuthenticated, function(req,res){

        let vrstaTroska = req.body.vrstaTroska;
    
        client.db(nazivMongoBaze).collection("vrsteTroskova").deleteOne({vrstaTroska:vrstaTroska}, function(err1,obj){

            if(err1){
                res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"}); 
            }
            else{
                logZapis('Obrisana vrsta troska: ' + vrstaTroska, req);
                res.send({"ispravan":"DA", "poruka":"Uspješno obrisana vrsta troška!"});
            }
        });      
    });


    app.post('/dodajTrosak', ensureAuthenticated, function(req,res){

        let vrstaTroska = req.body.vrstaTroska;
        let iznosTroska = parseFloat(req.body.iznosTroska.replace(',','.'));
        let datumTroska = req.body.datumTroska;

        let noviTrosak = {vrstaTroska:vrstaTroska, iznosTroska:iznosTroska, datumTroska:datumTroska};

        client.db(nazivMongoBaze).collection("troskovi").insertOne(noviTrosak, function(error,result){

            if(error){
                res.send({"poruka":"Greška prilikom upisa u bazu podataka!"});                
            }
            else{
                logZapis('Dodan novi trosak vrste: ' + vrstaTroska + '. Iznos: ' + iznosTroska + ' KM.', req);
                res.send({"poruka":"Uspješno registrovan novi trošak!"});
            }
        });
    });


        //Vraca posljednjih 30 prijavljenih troskova
    app.get('/dajSveTroskove', ensureAuthenticated, function(req,res){

        client.db(nazivMongoBaze).collection("troskovi").find({}).limit(50).sort({_id:-1}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                
                res.send({"poruka":"OK", "rezultat":result});
            }
        });
    });


    app.post('/obrisiTrosak', ensureAuthenticated, function(req,res){

        let vrstaTroska = req.body.vrstaTroska;
        let iznosTroska = parseFloat(req.body.iznosTroska.replace(',','.'));
        let datumTroska = req.body.datumTroska;

        let trazeniObjekat = {vrstaTroska:vrstaTroska, iznosTroska:iznosTroska, datumTroska:datumTroska};

        client.db(nazivMongoBaze).collection("troskovi").deleteOne(trazeniObjekat, function(err1,obj){

            if(err1){
                res.send({"poruka":"Greška pri pokušaju brisanja iz baze podataka!"}); 
            }
            else{                 
                logZapis('Obrisan trosak vrste: ' + vrstaTroska + '. Iznos: ' + iznosTroska + ' KM.', req);   
                res.send({"poruka":"Uspješno obrisan trošak!"});
            }
        });      
    });
}