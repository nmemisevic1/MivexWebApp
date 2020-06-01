
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

    app.post('/baza/add', ensureAuthenticated, function(req,res){

        let nazivBaze = req.body.nazivBaze;    
    
        client.db(nazivMongoBaze).collection("baza").find({naziv:nazivBaze}).toArray(function(err1,result){

            if(err1){
                res.send({"poruka":"Greška pri pristupu bazi podataka!"});
            }
            else if(result.length == 0){
                
                let noviObjekat = {naziv:nazivBaze};
                client.db(nazivMongoBaze).collection("baza").insertOne(noviObjekat, function(error,result){

                    if(error){
                        res.send({"poruka":"Greška pri pristupu bazi podataka!"});
                    }
                    else{                                   
                        logZapis("Dodana nova baza: " + nazivBaze,req);
                        res.send({"poruka":"Uspješno dodana nova baza!"});                               
                        
                    }
                });
            }
            else{
                res.send({"poruka":"Baza sa unesenim imenom već postoji!"});
            }
        });
    });

    app.post('/baza/remove', ensureAuthenticated, function(req,res){

        let nazivBaze = req.body.nazivBaze;
    
        client.db(nazivMongoBaze).collection("baza").deleteOne({naziv:nazivBaze}, function(err1,obj){

            if(err1){
                res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"}); 
            }
            else{
                logZapis("Obrisana baza: " + nazivBaze,req);
                res.send({"ispravan":"DA", "poruka":"Uspješno obrisana baza!"});

                client.db(nazivMongoBaze).collection("proizvodi").deleteMany({baza:nazivBaze}, function(err2, obj2){})
            }
        });      
    });

    app.post('/baza/edit', ensureAuthenticated, function(req,res){

        let noviNaziv = req.body.noviNaziv;
        let stariNaziv = req.body.stariNaziv;
    
    
        client.db(nazivMongoBaze).collection("baza").find({naziv:stariNaziv}).toArray(function(err,result){

            if(err){
                res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"});
            }
            else if(result.length == 0){
                res.send({"ispravan":"NE", "poruka":"Baza sa ovim imenom nije pronađena u bazi!"});
            }
            else{
                client.db(nazivMongoBaze).collection("baza").updateOne(

                    {naziv:stariNaziv}, 
                    { $set: {naziv: noviNaziv} }, 
                                                        
                    function(err1,result1){

                        if(err1){
                            res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"});
                        }
                        else{
                            let azuriraniKorisniciPoruka = updateBazeKodKorisnika(stariNaziv, noviNaziv);

                            if(azuriraniKorisnici == 'OK'){
                                logZapis("Editovna baza: " + stariNaziv + ". Novi naziv baze: " + noviNaziv,req);
                                res.send({"ispravan":"DA", "poruka":"Uspješno ažurirani podaci!"});
                            }
                            else{
                                res.send({"ispravan":"NE", "poruka":azuriraniKorisniciPoruka});
                            }                                    
                        }
                    } );
            }
        });
    });

    app.get('/baza/getAll', function(req,res){
    
        client.db(nazivMongoBaze).collection("baza").find({}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                
                res.send({"poruka":"OK", "rezultat":result});
            }
        });
    });

    app.post('/baza/changeActive', ensureAuthenticated, function(req,res){

        //console.log("CHanged active rute: " + req.body.aktivnaBaza);
        let aktivnaBaza = req.body.aktivnaBaza;        

        client.db(nazivMongoBaze).collection("users-session-info").find({user:req.user.username}).toArray(function(error, result){

            // console.log(result.length);

            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka prilikom očitavanja podataka sesije za trenutnog korisnika!", "rezultat":null});
            }

            else if(result.length == 0){

                let noviObjekat = {user:req.user.username, aktivnaBaza:aktivnaBaza};
                client.db(nazivMongoBaze).collection("users-session-info").insertOne(noviObjekat, function(error1,result){

                    if(error1){
                        res.send({"poruka":"Greška prilikom prvog upisa korisnika i aktivne baze u bazu podataka!"});
                    }
                    else{
                        res.send({"poruka":"Uspješno upisani podaci sesije za korisnika"});
                    }
                });                        
            }

            else{

                client.db(nazivMongoBaze).collection("users-session-info").updateOne(

                    {user:req.user.username}, 
                    { $set: {aktivnaBaza: aktivnaBaza} }, 
                                                        
                    function(err3,result1){

                        if(err3){
                            res.send({"ispravan":"NE", "poruka":"Greška prilikom ažuriranja trenutno aktivne baze u bazi podataka!"});
                        }
                        else{                                    
                            res.send({"ispravan":"DA", "poruka":"Uspješno ažurirani podaci!"});
                        }
                });
            }
        });
    });
}