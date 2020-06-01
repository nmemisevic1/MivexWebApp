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

    app.post('/posiljke/add', ensureAuthenticated, function(req,res){
        
        let barkod = req.body.barkod;
        let datum = new Date(req.body.datum);
                      
        let noviObjekat = {barkod:barkod, datum:datum};
        
        client.db(nazivMongoBaze).collection("posiljke-posta").find({barkod:barkod}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else if(result.length != 0){
                res.send({"poruka":"Pošiljka sa ovim barkodom već postoji!"});
            }
            else{
                client.db(nazivMongoBaze).collection("posiljke-posta").insertOne(noviObjekat, function(error,result){

                    if(error){
                        res.send({"poruka":"Greška pri pristupu bazi podataka!"});
                    }
                    else{
                        logZapis('Dodana nova posiljka poste sa barkodom: ' + barkod, req);
                        res.send({"poruka":"OK"});
                    }
                }); 
            }            
        });                   
    });

    app.post('/posiljke/remove', ensureAuthenticated, function(req,res){

        let barkod = req.body.barkod;
    
        client.db(nazivMongoBaze).collection("posiljke-posta").deleteOne({barkod:barkod}, function(err1,obj){

            if(err1){
                res.send({"poruka":"Greška pri pristupu bazi podataka!"}); 
            }
            else if(obj.deletedCount == 0){
                res.send({"poruka":"Pošiljka sa ovim barkodom ne postoji"})
            }
            else{
                logZapis('Obrisana posiljka poste sa barkodom: ' + barkod, req);
                res.send({"poruka":"Pošiljka uspješno obrisana"});
            }
        });      
    });

    app.get('/posiljke/late', ensureAuthenticated, function(req,res){

        client.db(nazivMongoBaze).collection("posiljke-posta").find({}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{
                let finalRes = [];
                
                for(let i=0; i<result.length; i++){

                    const date1 = new Date();
                    const date2 = result[i].datum;
                    const diffTime = Math.abs(date2.getTime() - date1.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if(diffDays > 10) finalRes.push(result[i]);
                }
                
                res.send({"poruka":"OK", "rezultat":finalRes});
            }
        });            
    });


    app.post('/posiljke/removeMany', ensureAuthenticated, async function(req,res){

        
        let barkodovi = req.body.barkodovi;
        let notFound = [];
        
        client.db(nazivMongoBaze).collection("posiljke-posta").find({}).toArray(function(error, result){

            if(error){
                res.send({status:'error', poruka:'Database greska!'});
            }
            else{

                for(let i=0; i<barkodovi.length; i++){

                    let found = false;
                    for(let j=0; j<result.length; j++){
                        if(barkodovi[i] == result[j].barkod) found = true;
                        break;
                    }

                    if(found == false) notFound.push(barkodovi[i]);
                }

                console.log('Nije pronadjeno: ', notFound.length);


                client.db(nazivMongoBaze).collection("posiljke-posta").deleteMany({barkod: {$in: barkodovi}}, function(err1,obj){

                    if(err1){
                        res.send({status:'error', "poruka":"Greška pri pristupu bazi podataka!"}); 
                    }
                    else if(obj.deletedCount == barkodovi.length){
                        res.send({status:'ok', "poruka":"Svih " + barkodovi.length.toString() + " pošiljki uspješno obrisano."});
                    }
                    else{
                        let nijePronadjeno = (barkodovi.length - obj.deletedCount).toString();
                        logZapis('Nisu pronadjene sljedece posiljke: ' + notFound.toString(), req);
                        res.send({status:'ok', notFound:notFound, poruka: 'Uspješno obrisano ' + obj.deletedCount.toString() + ' pošiljki. Nije pronađeno ' + nijePronadjeno + ' pošiljki. Provjeriti u log files koje pošiljke nisu obrisane.'});
                        //res.send({"poruka":"Pošiljka uspješno obrisana"});
                    }
                }); 
            }
        });
    });
}