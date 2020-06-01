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

    app.post('/dodajNovuKategoriju',  ensureAuthenticated,  function(req,res){
    
        client.db(nazivMongoBaze).collection("kategorije").find({naziv:req.body.nazivKategorije.trim()}).toArray(function(err1,result){

            if(err1){
                res.send({"poruka":"Greška pri pristupu bazi podataka!"});
            }
            else if(result.length == 0){
                
                let noviObjekat = {naziv:req.body.nazivKategorije.trim(), parent:req.body.parentKategorija};
                client.db(nazivMongoBaze).collection("kategorije").insertOne(noviObjekat, function(error,result){

                    if(error){
                        res.send({"poruka":"Greška pri pristupu bazi podataka!"});
                    }
                    else{
                        logZapis("Dodana nova kategorija. Naziv: " + req.body.nazivKategorije.trim(),req);
                        res.send({"poruka":"Uspješno dodana nova kategorija!"});
                    }
                });
            }
            else{
                res.send({"poruka":"Kategorija sa unesenim imenom već postoji!"});
            }
        });
    });


    app.get('/dajSveKategorije', ensureAuthenticated, function(req,res){
    
        client.db(nazivMongoBaze).collection("kategorije").find({}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                
                res.send({"poruka":"OK", "rezultat":result});
            }
        });
    });


    app.get('/dajDjecuKategorije', ensureAuthenticated, function(req,res){
    
        client.db(nazivMongoBaze).collection("kategorije").find({parent:req.query.roditelj}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                
                res.send({"poruka":"OK", "rezultat":result});
            }
        });
    });


    app.post('/kategorija/edit', ensureAuthenticated, function(req,res){

        let noviNaziv = req.body.noviNaziv.trim();
        let stariNaziv = req.body.stariNaziv;
    
        client.db(nazivMongoBaze).collection("kategorije").find({naziv:stariNaziv}).toArray(function(err1,result){

            if(err1){
                res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"});
            }
            else if(result.length == 0){
                res.send({"ispravan":"NE", "poruka":"Kategorija sa ovim imenom nije pronađena u bazi!"});
            }
            else{

                client.db(nazivMongoBaze).collection("kategorije").find({naziv:noviNaziv}).toArray(function(err3,result3){

                    if(err3){
                        res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"});
                    }
                    else if(result3.length != 0){
                        res.send({"ispravan":"NE", "poruka":"Kategorija sa ovim imenom već postoji u bazi!"});
                    }
                    else{
                        client.db(nazivMongoBaze).collection("kategorije").updateOne(

                            {naziv:stariNaziv}, 
                            { $set: {naziv: noviNaziv} }, 
                                                                
                            function(err2,result1){
    
                                if(err2){
                                    res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"});
                                }
                                else{
                                    logZapis("Editovana kategorija. Stari naziv: " + stariNaziv + ", Novi naziv: " + noviNaziv,req);                                            
                                    res.send({"ispravan":"DA", "poruka":"Uspješno ažurirani podaci!"});
                                }
                        } );
                    }
                });
                
            }
        });
    });

    
    app.post('/kategorija/remove', ensureAuthenticated, function(req,res){

        let nazivKategorije = req.body.naziv;
    
        client.db(nazivMongoBaze).collection("kategorije").deleteOne({naziv:nazivKategorije}, function(err1,obj){

            if(err1){
                res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"}); 
            }
            else{
                logZapis("Obrisana kategorija. Naziv kategorije: " + nazivKategorije,req);
                res.send({"ispravan":"DA", "poruka":"Uspješno obrisana kategorija!"});
            }
        });      
    });
}