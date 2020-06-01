module.exports = (app, ensureAuthenticated, client, nazivMongoBaze) => {

    //Vrace sve privilegije koje postoje
    app.get('/privilegije/getAll', ensureAuthenticated, function(req,res){


        client.db(nazivMongoBaze).collection("privilegije").find({}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                
                res.send({"poruka":"OK", "rezultat":result});
            }
        });            
    });
}