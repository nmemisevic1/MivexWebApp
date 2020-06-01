module.exports = (app, ensureAuthenticated, client, nazivMongoBaze) => { 

    //Vraca posljednjih 100 log zapisa
    app.get('/log/latest', ensureAuthenticated, function(req,res){

    
        client.db(nazivMongoBaze).collection("log-files").find({}).limit(100).sort({_id:-1}).toArray(function(error, result){

            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                
                res.send({"poruka":"OK", "rezultat":result});
            }
        });               
        
    });

    //Vraca logove određenog korisnika, između dva datuma
    app.get('/log/filter', ensureAuthenticated, function(req,res){

        let korisnik = req.query.korisnik;
        let odDatuma = new Date(req.query.odDatuma);
        let doDatuma = new Date(req.query.doDatuma);


        client.db(nazivMongoBaze).collection("log-files").find({korisnik:korisnik, datum:{ $gte: odDatuma, $lte: doDatuma}}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else if(result.length == 0){                
                res.send({"poruka":"Nije pronađen nijedan zapis sa datim ograničenjima!"});
            }
            else{
                res.send({"poruka":"OK", "rezultat":result});
            }
        });
    });
}