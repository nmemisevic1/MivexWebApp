const nazivMongoBaze = 'mivexDb';

//Uspotavljanje express paketa. Defaultni port je 8080
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.listen(PORT);

//const fs = require("fs");
const multer = require("multer");
//const path = require("path");

const upload = multer({
    dest: __dirname + "/assets/img"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});


const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//Uspostavljanje MongoDB baze
//var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017/mivexDb";
const {MongoClient} = require('mongodb');
//var url = "mongodb+srv://Nihad:p5UzqDqkmed0Ug9V@cluster0-dtwcq.mongodb.net/test?retryWrites=true&w=majority";
var url = "mongodb://Nihad:p5UzqDqkmed0Ug9V@cluster0-shard-00-00-dtwcq.mongodb.net:27017,cluster0-shard-00-01-dtwcq.mongodb.net:27017,cluster0-shard-00-02-dtwcq.mongodb.net:27017/"+nazivMongoBaze+"?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(url, {useNewUrlParser: true });



//Uspostavljanje sesija
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
//app.use(cookieParser('your secret here')); 

app.use(session({
    secret: "tajna",
    proxy: true,
    store: new MongoStore({ url: url,
                            ttl:  1000 * 60,  //Brisanje sesije - vrijeme u ms
                            touchAfter: 24 * 3600, //Update sesije - vrijeme u ms.
                             }),
     resave: false,
     saveUninitialized: false

}));


//Passport.js konfiguracija
const passport = require('passport');
require('./assets/scripts/passport')(passport,client, nazivMongoBaze);

app.use(passport.initialize());
app.use(passport.session());

const fajlovi = ['/dashboard.html', '/baze.html', '/dodajProizvod.html', '/kategorije.html', '/narudzbe.html', '/notifikacije.html',
                 '/posiljke.html', '/profil.html', '/proizvodi.html', '/racuni.html', '/troskovi.html', '/statistika.html', '/html/statistika.html',
                 '/html/dashboard.html', '/html/baze.html', '/html/dodajProizvod.html', '/html/kategorije.html', '/html/narudzbe.html', '/html/notifikacije.html',
                 '/html/posiljke.html', '/html/profil.html', '/html/proizvodi.html', '/html/racuni.html', '/html/troskovi.html'];



app.use(fajlovi, function(req, res, next) {

    const originalUrl = req.originalUrl;
     
   // Ako korisnik nije ulogovan a pokusava pristupiti nekom fajlu, vraca se na login page
   
    if (req.user == null && fajlovi.includes(originalUrl) )
    {   
        return res.redirect('/login.html');
    }

    else if(req.user != null){
        
        //Provjerava se da li ulogovani korisnik ima privilegije da pristupi odredjenom html fajlu
        let username = req.user.username;                
    
        client.db(nazivMongoBaze).collection("users").find({username:username}).toArray(function(error, result){
                    
            if(error){
            //  res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
                return res.redirect('/error.html');
            }
            else{                       
                //res.send({"poruka":"OK", "rezultat":result[0].dodijeljenePrivilegije});
                let dodijeljenePrivilegije = result[0].dodijeljenePrivilegije;
                let imaPrivilegiju = true;

                if((originalUrl == '/baze.html' || originalUrl == '/html/baze.html') && !dodijeljenePrivilegije.includes('Baze')) imaPrivilegiju=false;
                else if((originalUrl == '/proizvodi.html' || originalUrl == '/html/proizvodi.html') && !dodijeljenePrivilegije.includes('Dodaj proizvod')) imaPrivilegiju=false;

                else if(
                 (originalUrl == '/narudzbe.html' || originalUrl == '/html/narudzbe.html') && !dodijeljenePrivilegije.includes('Registrovane narudzbe') &&
                 !dodijeljenePrivilegije.includes('Narudzbe koje kasne') && !dodijeljenePrivilegije.includes('Potrebno naruciti') &&
                 !dodijeljenePrivilegije.includes('Naruci')) imaPrivilegiju=false;

                
                else if((originalUrl == '/troskovi.html' || originalUrl == '/html/troskovi.html') && !dodijeljenePrivilegije.includes('Registruj trosak') &&
                        !dodijeljenePrivilegije.includes('Pregled svih troskova') && !dodijeljenePrivilegije.includes('Dodaj novu vrstu troska') ) imaPrivilegiju=false;

                else if((originalUrl == '/posiljke.html' || originalUrl == '/html/posiljke.html') && !dodijeljenePrivilegije.includes('Skeniraj poslanu posiljku') &&
                         !dodijeljenePrivilegije.includes('Skeniraj pristiglu posiljku') && !dodijeljenePrivilegije.includes('Posiljke koje kasne')) imaPrivilegiju=false;

                else if((originalUrl == '/notifikacije.html' || originalUrl == '/html/notifikacije.html') && !dodijeljenePrivilegije.includes('Slanje poruka')) imaPrivilegiju=false;

                else if(
                    (originalUrl == '/kategorije.html' || originalUrl == '/html/kategorije.html') && !dodijeljenePrivilegije.includes('Dodaj kategoriju')
                     && !dodijeljenePrivilegije.includes('Izmijeni kategoriju') && !dodijeljenePrivilegije.includes('Obrisi kategoriju')) imaPrivilegiju=false;

                else if((originalUrl == '/racuni.html' || originalUrl == '/html/racuni.html') && !dodijeljenePrivilegije.includes('Racuni')) imaPrivilegiju=false;
                else if((originalUrl == '/log.html' || originalUrl == '/html/log.html') && !dodijeljenePrivilegije.includes('Log')) imaPrivilegiju=false;
                else if(originalUrl == '/login.html' || originalUrl == '/html/login.html') imaPrivilegiju=true;
                else if((originalUrl == '/dashboard.html' || originalUrl == '/html/dashboard.html') && dodijeljenePrivilegije.length != 0) imaPrivilegiju=true; //Ovaj uslov je cisto da se vidi jel postoji korisnik
                else if((originalUrl == '/statistika.html' || originalUrl == '/html/statistika.html') && !dodijeljenePrivilegije.includes('Statistika')) imaPrivilegiju=false;
                
                if(imaPrivilegiju) { return next(); }
                else { return res.redirect('/error.html'); }
                //else { console.log('HEJ'); return next();};
            }    
             
        });                   
    } 
   // return next();

}); 


app.use(express.static(__dirname));
app.use(express.static(__dirname+'/html'));


let listaPrivilegija = ['Dodaj proizvod', 'Prodaj proizvod', 'Storniraj prodaju', 'Dodaj na stanje', 'Obrisi proizvod', 'Edit proizvoda', 
                                'Dodaj kategoriju', 'Izmijeni kategoriju', 'Obrisi kategoriju',
                                'Registrovane narudzbe', 'Narudzbe koje kasne', 'Potrebno naruciti', 'Naruci',
                                'Registruj trosak', 'Pregled svih troskova', 'Dodaj novu vrstu troska',
                                'Slanje poruka', 'Brisanje poruka',
                                'Skeniraj poslanu posiljku', 'Skeniraj pristiglu posiljku', 'Posiljke koje kasne',
                                'Racuni',
                                'Log',
                                'Statistika',
                                'Baze'];


async function kreirajPrivilegijeDb(){

    listaPrivilegija.forEach(function(element){

        client.db(nazivMongoBaze).collection("privilegije").find({nazivPrivilegije:element}).toArray(function(error,result){

            if(error){
                console.log("Greška prilikom pretrage da li privilegija vec postoji u bazi!");            
            }
            else{
                if(result.length == 0){
                    
                    client.db(nazivMongoBaze).collection("privilegije").insertOne({nazivPrivilegije:element}, function(error1,result1){

                            if(error1){
                                console.log("Greška pri pristupu upisu privilegije u podataka!");            
                            }
                    });
                }
            }
        });
        
    });
}

//Kreira se pocetni dummy admin user koji ima sve privilegije koji moze napraviti ostale accounte
async function kreirajInicijalnogUsera(){

    let noviKorisnik = {username:"Vedad", /* umjesto uneseniPassword vratiti hash */ password:"admin", dodijeljeneBaze: [], dodijeljenePrivilegije:listaPrivilegija};
    
    client.db(nazivMongoBaze).collection("users").find({}).toArray(function(err,result){
    
        if(result.length == 0){
            client.db(nazivMongoBaze).collection("users").insertOne(noviKorisnik, {strict:true}, function(err,result){});
        }
    });
}

async function uspostaviSesiju(){

    app.use(session({
        secret: "tajna",
        store: new MongoStore({
             //url: "mongodb+srv://Nihad:p5UzqDqkmed0Ug9V@cluster0-dtwcq.mongodb.net/mivexDb?retryWrites=true&w=majority&authSource=admins&w=1",
             url: "mongodb://Nihad:p5UzqDqkmed0Ug9V@cluster0-shard-00-00-dtwcq.mongodb.net:27017,cluster0-shard-00-01-dtwcq.mongodb.net:27017,cluster0-shard-00-02-dtwcq.mongodb.net:27017/"+nazivMongoBaze+"?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",
             dbName: nazivMongoBaze,
             ttl:  1000 * 60  }), //Brisanje sesije
        resave: false,
        saveUninitialized: false        
    })); 
}


async function kreirajPrivilegije(){

    try{
        await client.connect();
        await kreirajPrivilegijeDb();
        await kreirajInicijalnogUsera();
        await uspostaviSesiju();
    }
    catch(e){
        //console.log(e);
    }
}


//Kreiraju se privilegije u bazi ukoliko vec nisu kreirane
try{
    kreirajPrivilegije().catch(console.log);
}
catch(e){
    console.log(e);
}



//Autentikacija
const { ensureAuthenticated } = require('./assets/scripts/auth');

require('./routes/korisnik-routes')(app, passport, ensureAuthenticated, client, nazivMongoBaze);
require('./routes/kategorija-routes')(app, ensureAuthenticated, client, nazivMongoBaze);
require('./routes/proizvod-routes')(app, upload, ensureAuthenticated, client), nazivMongoBaze;
require('./routes/trosak-routes')(app, ensureAuthenticated, client, nazivMongoBaze);
require('./routes/narudzba-routes')(app, ensureAuthenticated, client, nazivMongoBaze);
require('./routes/baza-routes')(app, ensureAuthenticated, client, nazivMongoBaze);
require('./routes/obavijest-routes')(app, ensureAuthenticated, client, nazivMongoBaze);
require('./routes/log-routes')(app, ensureAuthenticated, client, nazivMongoBaze);
require('./routes/privilegije-routes')(app,ensureAuthenticated, client, nazivMongoBaze);
require('./routes/posiljke-routes')(app,ensureAuthenticated, client, nazivMongoBaze);
require('./routes/statistika-routes')(app, ensureAuthenticated, client, nazivMongoBaze);


