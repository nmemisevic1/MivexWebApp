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

    function dajStringSvihKorisnika(listaKorisnika){

        let s = "";

        for(let i=0; i<listaKorisnika.length; i++){
            s += listaKorisnika[i]
            if(i != listaKorisnika.length-1)  s  += ', ';
        }

        return s;
    }

    app.post('/obavijest/add', ensureAuthenticated, function(req,res){
        
        let tekstObavijesti = req.body.tekstObavijesti;
        let datumIsteka = new Date(req.body.datumIsteka);
        let listaKorisnika = req.body.listaKorisnika;
        let sender = req.user.username;
        let read = new Array(listaKorisnika.length);
        read.fill(false, 0);
    
        
        let noviObjekat = {tekst:tekstObavijesti, datumIsteka:datumIsteka, listaKorisnika:listaKorisnika, sender:sender, read:read};
        
        client.db(nazivMongoBaze).collection("obavijest").insertOne(noviObjekat, function(error,result){

            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!"});
            }
            else{
                logZapis('Dodana obavijest od strane: ' + sender + '. Primatelji: ' + dajStringSvihKorisnika(listaKorisnika) + ', sa datumom isteka: ' + datumIsteka + '. Tekst poruke: ' + tekstObavijesti, req);
                res.send({"poruka":"Uspješno dodana nova obavijest!"});
            }
        });                    
    });

    app.post('/obavijest/remove' , ensureAuthenticated, function(req,res){

        let tekst = req.body.tekst;
        let datumIsteka = new Date(req.body.datumIsteka);
        let listaKorisnika = req.body.listaKorisnika;
    
    
        client.db(nazivMongoBaze).collection("obavijest").deleteOne({tekst:tekst, datumIsteka:datumIsteka ,listaKorisnika:listaKorisnika}, function(err1,obj){

            if(err1){
                res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"}); 
            }
            else{
                logZapis('Obrisana obavijest sa datumom isteka: '  + datumIsteka + '. Tekst poruke: ' + tekst, req);
                res.send({"ispravan":"DA", "poruka":"Uspješno obrisana obavijest!"});
            }
        });      
    });

    app.get('/obavijest/getActive', ensureAuthenticated, function(req,res){
        
    
        client.db(nazivMongoBaze).collection("obavijest").find({datumIsteka: {$gt: new Date()} }).toArray(function(err1,result){
            //  console.log(typeof(result));

            let rez = [];
            for(let i=0; i<result.length; i++){
                rez.push(result[i])
            }
            res.send(rez);
        });
    });

    app.get('/obavijest/user', ensureAuthenticated, function(req,res){

        let korisnik = req.user.username;


        client.db(nazivMongoBaze).collection("obavijest").find({datumIsteka: {$gt: new Date()}}).toArray(function(err1, result){
            
            let rez = [];
            let obavijesti = Object.values(result);

            for(let i=0; i<obavijesti.length; i++){
                for(let j=0; j<obavijesti[i].listaKorisnika.length; j++){
                    if(korisnik == obavijesti[i].listaKorisnika[j]) rez.push(obavijesti[i]);
                }
            }

            res.send({'poruka':'ok', 'rezultat':rez});
        });
    });

    app.post('/obavijest/procitana', ensureAuthenticated, function(req,res){

        let tekst = req.body.tekst;
        let procitana = (req.body.procitana == 'true' );
        oznaciKaoProcitanu(req,res,tekst,procitana);       
    });

    app.post('/obavijest/sveProcitane', ensureAuthenticated, function(req,res){               

        client.db(nazivMongoBaze).collection("obavijest").find({datumIsteka: {$gt: new Date()}}).toArray(function(err1, result){

            let k = Object.values(result);

            for(let i=0; i<k.length; i++){
                let read = k[i].read;
                
                for(let j=0; j<k[i].listaKorisnika.length; j++){                            
                    if(k[i].listaKorisnika[j] == req.user.username){                                
                        read[j] = true;
                    }
                }

                let newValues = {$set: {read:read}};
            
                client.db(nazivMongoBaze).collection("obavijest").updateOne({datumIsteka: {$gt: new Date()}, tekst:k[i].tekst}, newValues, function(err2,res2){
            
                    if(err2){
                        res.send({"poruka":"Greška prilikom upisa u bazi podataka!"});                                
                    }
                    else{
                        if(i == k.length-1){
                            res.send({'poruka':'OK'});
                        }
                    }
                    
                });
            }

            
        });
    });

    function oznaciKaoProcitanu(req,res,tekst,procitana){              

        client.db(nazivMongoBaze).collection("obavijest").find({datumIsteka: {$gt: new Date()}, tekst:tekst}).toArray(function(err1, result){

            let listaKorisnika = result[0].listaKorisnika;
            let read = result[0].read;
            
            for(let i=0; i<listaKorisnika.length; i++){
                
                if(listaKorisnika[i] == req.user.username){
                    read[i] = procitana;
                }
            }

            let newValues = {$set: {read:read}};
            
            client.db(nazivMongoBaze).collection("obavijest").updateOne({datumIsteka: {$gt: new Date()}, tekst:tekst}, newValues, function(err2,res2){
        
                if(err2){
                    res.send({"poruka":"Greška prilikom upisa u bazi podataka!"});
                }
                else{
                    res.send({'poruka':'OK'});
                }
            });
            
        });
    }
}