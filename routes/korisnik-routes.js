module.exports = (app, passport, ensureAuthenticated, client, nazivMongoBaze) => {

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

    //const bcrypt = require('bcrypt');
    const saltRounds = 10;

    app.get('/dodajNovogKorisnika', ensureAuthenticated, function(req,res){

        //Uzimamo uneseni username i password iz forme koji su proslijedjeni kao query parametri
        let uneseniUsername = req.query.user;
        let uneseniPassword = req.query.pass;
        let dodijeljeneBaze = req.query.dodijeljeneBaze;
        let dodijeljenePrivilegije = req.query.dodijeljenePrivilegije;

        /*  bcrypt.hash(uneseniPassword, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            if(err) res.send(err);

            else{ */
                           
                client.db(nazivMongoBaze).collection("users").find({username:uneseniUsername}).toArray(function(err,result){
    
                    if(result.length != 0){
                        res.send({"ispravan":"NE"});
                    }
                    else{
    
                        let noviKorisnik = {username:uneseniUsername, /* umjesto uneseniPassword vratiti hash */ password:uneseniPassword, dodijeljeneBaze: dodijeljeneBaze, dodijeljenePrivilegije:dodijeljenePrivilegije};
                        
                        client.db(nazivMongoBaze).collection("users").insertOne(noviKorisnik, {strict:true}, function(err,result){
                            
                            if(err){
                                res.send({"ispravan":"DATABASE_ERROR"});
                            }
                            else{
                                logZapis('Dodan novi korisnik. Username: ' + uneseniUsername,req);
                                res.send({"ispravan":"DA"});
                            }
                        });
                    }
                });                   
                
           // }
       // });

       // dodajNovogKorisnika(req, res, uneseniUsername, uneseniPassword, dodijeljeneBaze, dodijeljenePrivilegije).catch();
    });

    async function ucitajKorisnike(res){

        try{
            await ucitajKorisnikeDb(res);
        }
        catch(e){
            res.send({'poruka':'Greska prilikom pristupa bazi!'});
        }
    }

    async function ucitajKorisnikeDb(res){

        client.db(nazivMongoBaze).collection("users").find({}).toArray(function(err,result){
            //  console.log(typeof(result));

            let rez = [];
            for(let i=0; i<result.length; i++){
                rez.push(result[i])
            }
            res.send(rez);
        });
    }

    app.get('/ucitajKorisnike', ensureAuthenticated, function(req,res){
        ucitajKorisnike(res).catch();
    });

    app.get('/izmijeniPodatkeKorisnika', ensureAuthenticated, function(req,res){
    
        client.db(nazivMongoBaze).collection("users").find({username:req.query.originalniUser}).toArray(function(err,result){
    
            if(err){
                res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"});
            }
            else if(result.length == 0){
                res.send({"ispravan":"NE", "poruka":"Originalni username nije pronađen u bazi!"});
            }
            else{
                //VRATITI ovaj dio
                /*   bcrypt.hash(req.query.noviPassword, saltRounds, function(err, hash) {

                    if(err){
                        res.send(err);
                        return;
                    } */

                    client.db(nazivMongoBaze).collection("users").updateOne(

                        {username:req.query.originalniUser}, 
                        { $set: {username: req.query.noviUsername, /* Umjesto req.query.noviPassword vratiti hash */ password: req.query.noviPassword, dodijeljeneBaze: req.query.editovaneBaze, dodijeljenePrivilegije: req.query.editovanePrivilegije } }, 
                                                            
                        function(err,result1){

                            if(err){
                                res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"});
                            }
                            else{

                                if(req.user.username == req.query.originalniUser){
                                    req.user.username = req.query.noviUsername;
                                    req.user.password = req.query.noviPassword;                                        
                                }
                                
                                logZapis('Izmijenjeni podaci za korisnika: ' + req.query.originalniUser,req);
                                res.send({"ispravan":"DA", "poruka":"Uspješno ažurirani podaci!"});
                            }
                        } );
                //  });
            }
        });
    });

    app.post('/obrisiKorisnika' , ensureAuthenticated, function(req,res){
    
        client.db(nazivMongoBaze).collection("users").deleteOne({username:req.body.korisnik}, function(err1,obj){
    
                if(err1){
                    res.send({"ispravan":"NE", "poruka":"Greška pri pristupu bazi podataka!"}); 
                }
                else{
                    logZapis('Obrisan korisnik: ' + req.body.korisnik,req);
                    res.send({"ispravan":"DA", "poruka":"Uspješno obrisan korisnik!"});
                }
        });      
    });


      app.get('/mojRacunPodaci', ensureAuthenticated, function(req,res){
    
          res.send({"username":req.user.username, "password":req.user.password});
      });

      
      app.get('/dajPassword', ensureAuthenticated, function(req,res){
         // console.log(req.query.user);
                  //console.log(req.query.user);
                client.db(nazivMongoBaze).collection("users").find({username:req.query.user}).toArray(function(err,result){
                //console.log(result[0].password);
                res.send({"password":result[0].password});
            });
      });



    app.post('/loginValidacija', passport.authenticate('local', 
                                { 
                                    successRedirect: '/dashboard.html',
                                    failureRedirect: '/login.html'
                                })); 


    app.post('/user/dodijeliBazu', ensureAuthenticated, function(req,res){

        let novaBaza = req.query.novaBaza;
        let user = req.query.user;

        var myquery = { username: user };
        
        client.db(nazivMongoBaze).collection("users").find(myquery).toArray(function(err2,result){

            if(result.length == 0){
                res.send({"message":"User ne postoji u bazi! Obavijesiti developera!"});
            }
            else{                     
                var newvalues = { $push: {dodijeljeneBaze: novaBaza } };    
                
                client.db(nazivMongoBaze).collection("users").updateOne(myquery, newvalues, function(err3, res3){
                    if (err3){
                        res.send({"message":"Greška prilikom ažuriranja baze"});
                    }
                    else{
                        logZapis('Dodijeljena baza ' + novaBaza + " korisniku " + user,req);
                        res.send({"message":"Uspješno dodijeljena baza korisniku!"});
                    }
                });
                
            }
        });
    });


    app.post('/user/dodijeliBazu2', ensureAuthenticated, function(req,res){

        //Razlika u odnosnu na verziju 1 je req.body umjesto req.query
        let novaBaza = req.body.novaBaza;

        //Jedina razlika u odnosu na drugu verziju rute
        let user = req.user.username;

        var myquery = { username: user };
        
        client.db(nazivMongoBaze).collection("users").find(myquery).toArray(function(err2,result){

            if(result.length == 0){
                res.send({"message":"User ne postoji u bazi! Obavijesiti developera!"});
            }
            else{                     
                var newvalues = { $push: {dodijeljeneBaze: novaBaza } };    
                
                client.db(nazivMongoBaze).collection("users").updateOne(myquery, newvalues, function(err3, res3){
                    if (err3){
                        res.send({"message":"Greška prilikom ažuriranja baze"});
                    }
                    else{
                        logZapis('Dodijeljena baza ' + novaBaza + " korisniku " + user,req);
                        res.send({"message":"Uspješno dodijeljena baza korisniku!"});
                    }
                });                        
            }
        });
    });


    app.post('/user/ukiniBazu', ensureAuthenticated, function(req,res){

        let ukinutaBaza = req.query.ukinutaBaza;
        let user = req.query.user;

        var myquery = { username: user };
        
        client.db(nazivMongoBaze).collection("users").find(myquery).toArray(function(err2,result){

            if(result.length == 0){
                res.send({"message":"User ne postoji u bazi! Obavijesiti developera!"});
            }
            else{                     
                var newvalues = { $pull: {dodijeljeneBaze: ukinutaBaza } };    
                
                client.db(nazivMongoBaze).collection("users").updateOne(myquery, newvalues, function(err3, res3){
                    if (err){
                        res.send({"message":"Greška prilikom ažuriranja baze"});
                    }
                    else{
                        logZapis('Ukinuta baza ' + ukinutaBaza + " korisniku " + user,req);
                        res.send({"message":"Uspješno ukinuta baza korisniku!"});
                    }
                });
                
            }
        });
    });

    app.post('/user/ukiniBazu2', ensureAuthenticated, function(req,res){

        //Razlika od verzije 1 je req.body umjesto req.query
        let ukinutaBaza = req.body.ukinutaBaza;
        //Razlika je req.user.username umjesto req.query.user
        let user = req.user.username;

        var myquery = { username: user };
        
        client.db(nazivMongoBaze).collection("users").find(myquery).toArray(function(err2,result){

            if(result.length == 0){
                res.send({"message":"User ne postoji u bazi! Obavijesiti developera!"});
            }
            else{                     
                var newvalues = { $pull: {dodijeljeneBaze: ukinutaBaza } };    
                
                client.db(nazivMongoBaze).collection("users").updateOne(myquery, newvalues, function(err3, res3){
                    if (err3){
                        res.send({"message":"Greška prilikom ažuriranja baze"});
                    }
                    else{
                        logZapis('Ukinuta baza ' + ukinutaBaza + " korisniku " + user,req);
                        res.send({"message":"Uspješno ukinuta baza korisniku!"});
                    }
                });                
            }
        });
    });

    app.get('/user/allDatabases', ensureAuthenticated, function(req,res){

        let username = req.query.username;

        client.db(nazivMongoBaze).collection("users").find({username:username}).toArray(function(error, result){
                    
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                       
                res.send({"poruka":"OK", "rezultat":result[0].dodijeljeneBaze});
            }
        });
    });


    app.get('/currentUser/allDatabases', ensureAuthenticated, function(req,res){

        let username = req.user.username;
        
        if(username != 'a'){

            client.db(nazivMongoBaze).collection("users").find({username:username}).toArray(function(error, result){
                        
                if(error){
                    res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
                }
                else{                       
                    res.send({"poruka":"OK", "rezultat":result[0].dodijeljeneBaze});
                }
            });
        }
    });


    app.get('/user/allPrivileges', ensureAuthenticated, function(req,res){

        let username = req.query.username;
    
        client.db(nazivMongoBaze).collection("users").find({username:username}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                       
                res.send({"poruka":"OK", "rezultat":result[0].dodijeljenePrivilegije});
            }
        });
    });


    app.get('/user/current/aktivnaBaza/get' , ensureAuthenticated, function(req,res){

       let username = req.user.username;

       client.db(nazivMongoBaze).collection("users-session-info").find({user:username}).toArray(function(error, result){

            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka prilikom očitavanja podataka sesije za trenutnog korisnika!", "rezultat":null});
            }
            else if(result.length == 0){
                res.send({"poruka":"Nema zapis", "rezultat":null});
            }
            else{
                res.send({"poruka":"OK", "rezultat":result[0].aktivnaBaza});
            }
        });
    });

    async function svePrivilegijeUsera(username, res){

        try{
            await svePrivilegijeUseraDb(username, res);
        }
        catch(e){
            console.log(e);
        }
    }

    async function svePrivilegijeUseraDb(username, res){

        client.db(nazivMongoBaze).collection("users").find({username:username}).toArray(function(error, result){
                
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                       
                res.send({"poruka":"OK", "rezultat":result[0].dodijeljenePrivilegije});
            }
        });
    }

    app.get('/user/current/allPrivileges', ensureAuthenticated, function(req,res){

        let username = req.user.username;

        //Obrisati poslije, dummy user
        let listaPrivilegija = ['Baze', 'Proizvodi', 'Narudzbe', 'Troskovi', 'Posiljke', 'Notifikacije', 'Kategorije', 'Racuni', 'Log'];

        if(username == 'a'){
            res.send({"poruka":"OK", "rezultat":listaPrivilegija});
        }

        else{                   
            svePrivilegijeUsera(username, res).catch();
        }
    });

    app.get('/user/current/hasPrivilege', ensureAuthenticated, function(req,res){

        let username = req.user.username;
        let privilegija = req.query.privilegija;
    
        client.db(nazivMongoBaze).collection("users").find({username:username}).toArray(function(error, result){
            
            if(error){
                res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
            }
            else{                       
                let hasPrivilege = false;
                
                for(let i=0; i<result[0].dodijeljenePrivilegije.length; i++){
                    if(result[0].dodijeljenePrivilegije[i] == privilegija){
                        hasPrivilege = true;
                        break;
                    }
                }

                res.send({"poruka":"OK", "rezultat":hasPrivilege});
            }
        });
    });

    app.get('/logout', ensureAuthenticated, (req, res) => {
        
        req.logout();
        res.redirect('/login.html');
    });
}