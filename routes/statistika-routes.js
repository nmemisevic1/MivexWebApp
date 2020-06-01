module.exports = (app, ensureAuthenticated, client) => {

    app.get('/statistika/ukupno', ensureAuthenticated, function(req,res){

        let odDana = new Date(req.query.odDana);
        let doDana = new Date(req.query.doDana);

        client.db("mivexDb").collection("sales-records").find({}).toArray(function(error, result){

            if(error){
                res.send({"poruka":"Greška prilikom učitavanja statistike!", "rezultat":null});
            }
            else{

                client.db("mivexDb").collection("troskovi").find({}).toArray(function(error2, result2){

                    if(error2){
                        res.send({"poruka":"Greška prilikom učitavanja statistike!", "rezultat":null});
                    }
                    else{

                        client.db("mivexDb").collection("proizvodi").find({}).toArray(function(error3, result3){

                            if(error2){
                                res.send({"poruka":"Greška prilikom učitavanja statistike!", "rezultat":null});
                            }
                            else{
                                let rez = {ukZarada:0, ukPrihod:0, ukRashod:0, rasNabavke:0, rasTroskova:0, ukProdanih:0, nabavnaVrijednost:0, prodajnaVrijednost:0};

                                for(let i=0; i<result.length; i++){

                                    if(new Date(result[i].datum) < doDana && new Date(result[i].datum) > odDana){
                                        rez.ukZarada += (result[i].prihod-result[i].rashod);
                                        rez.ukPrihod += result[i].prihod;
                                        rez.ukRashod += result[i].rashod;
                                        rez.rasNabavke += result[i].rashod;
                                        rez.ukProdanih += result[i].brojKomada;
                                    }
                                }
                                
                                for(let i=0; i<result2.length; i++){
                                    
                                    if(new Date(result2[i].datumTroska) < doDana && new Date(result2[i].datumTroska) > odDana){
                                        rez.ukZarada -= result2[i].iznosTroska;
                                        rez.ukRashod += result2[i].iznosTroska;
                                        rez.rasTroskova += result2[i].iznosTroska;
                                    }
                                }

                                for(let i=0; i<result3.length; i++){
                                    rez.nabavnaVrijednost += parseFloat(result3[i].nabavnaCijena) * parseFloat(result3[i].brojKomada);
                                    rez.prodajnaVrijednost += parseFloat(result3[i].prodajnaCijena) * parseFloat(result3[i].brojKomada);
                                }
                                
                                res.send({"poruka":"OK", "rezultat":rez});
                            }
                        });
                    }
                });                        
            }
        });
    });

    app.get('/statistika/kategorije', ensureAuthenticated, function(req,res){

        let odDana = new Date(req.query.odDana);
        let doDana = new Date(req.query.doDana);
        let roditelj = req.query.roditelj;

        client.db("mivexDb").collection("sales-records").find({}).toArray(function(error, result){

            if(error){
                res.send({"poruka":"Greška prilikom učitavanja statistike!", "rezultat":null});
            }
            else{

                let ukupnaZarada = [];
                let brojKomada = [];
                let kategorija = [];

                client.db("mivexDb").collection("kategorije").find({parent:roditelj}).toArray(function(error2, result2){
            
                    if(error2){
                        res.send({"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null});
                    }
                    else{
                        kategorija = Object.values(result2);
                        for(let i=0; i<kategorija.length; i++){
                            brojKomada.push(0);
                            ukupnaZarada.push(0);
                        }
                        
                        client.db("mivexDb").collection("kategorije").find({}).toArray(function(error3, result3){

                            sveKategorije = Object.values(result3);

                            for(let i=0; i<result.length; i++){

                                for(let j=0; j<kategorija.length; j++){

                                    let djecaKategorije = dajDjecuOdKategorije(sveKategorije, kategorija[j].naziv);
                                    let naziviDjece = [];

                                    djecaKategorije.forEach(function(kat){
                                        naziviDjece.push(kat.naziv)
                                    });
                                    
                                    if( (result[i].kategorija == kategorija[j].naziv || naziviDjece.includes(result[i].kategorija) ) &&
                                        (odDana <= new Date(result[i].datum) && new Date(result[i].datum) <= doDana )){

                                        brojKomada[j] += result[i].brojKomada;
                                        ukupnaZarada[j] += (result[i].prihod - result[i].rashod);
                                    }
                                }
                            }

                            res.send({"poruka":"OK", "rezultat":{ukupnaZarada:ukupnaZarada, brojKomada:brojKomada, kategorije:kategorija}});
                        });
                    }
                });                        
            }
        });
    });

    app.get('/statistika/najproizvodi', ensureAuthenticated, function(req,res){

        let kategorija = req.query.kategorija;
        let odDana = req.query.odDana;
        let doDana = req.query.doDana;
    
        client.db("mivexDb").collection("kategorije").find({}).toArray(function(error, result){
            
            if(error){
                return {"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null};
            }
            else{
                if(result == null) res.send({"poruka":"OK", "rezultat":[]});
                let sveKategorije = Object.values(result);
                let podKategorije = dajDjecuOdKategorije(sveKategorije, kategorija);
                
                for(let i=0; i<podKategorije.length; i++){
                    
                    let p = dajDjecuOdKategorije(sveKategorije, podKategorije[i].naziv);

                    if(p.length != 0){
                        podKategorije.push(...p);
                    }
                }

                getProductStats(podKategorije, res, odDana, doDana);                        
            }
        });
    });

    function dajDjecuOdKategorije(listaKategorija, kategorija){

        let djeca = [];
               
        for(let i=0; i<listaKategorija.length; i++){

            if(listaKategorija[i].parent == kategorija){
                djeca.push(listaKategorija[i]);
            }
        }

        return djeca;
    }

    function ukupnoProdatoIProsjek(nazivProizvoda, sviProizvodi){

        for(let i=0; i<sviProizvodi.length; i++){           
            if(sviProizvodi[i].nazivProizvoda == nazivProizvoda){
                return {'ukupnoProdano':sviProizvodi[i].ukupnoProdano, 'trenutniProsjek':sviProizvodi[i].prosjekProdaje}
            }
        }
    }

    function getDifferenceInDays(date1, date2){

        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    }

    //Vraca proizvod sa datim imenom iz liste proizvoda
    function dajProizvod(nazivProizvoda, sviProizvodi){

        for(let i=0; i<sviProizvodi.length; i++){
            if(sviProizvodi[i].nazivProizvoda == nazivProizvoda) return sviProizvodi[i];
        }
    }

    function getProductStats(podKategorije, res, odDana, doDana){
                
        client.db("mivexDb").collection("sales-records").find({}).toArray(function(error, result){

            if(error){
                return {"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null}
            }
            else{
                client.db("mivexDb").collection("proizvodi").find({}).toArray(function(error1, result1){

                    if(error1){
                        return {"poruka":"Greška pri pristupu bazi podataka!", "rezultat":null}
                    }
                    else{
                        let sviProizvodi = Object.values(result1);
                        let soldProducts = Object.values(result);
                        let products = [];
                        
                        for(let i=0; i<soldProducts.length; i++){

                            if(!(new Date(odDana) <= new Date(soldProducts[i].datum) && new Date(doDana) >= new Date(soldProducts[i].datum))){
                                continue;
                            }

                            for(let j=0; j<podKategorije.length; j++){
                                if(podKategorije[j].naziv == soldProducts[i].kategorija){                                                                                  
                                    
                                    let uk = ukupnoProdatoIProsjek(soldProducts[i].nazivProizvoda, sviProizvodi);
                                    let ukupnoProdano = uk.ukupnoProdano;
                                    let trenutniProsjek = uk.trenutniProsjek;                                            

                                    let alreadyExists = false;
                                    for(let k=0; k<products.length; k++){

                                        if(products[k].naziv == soldProducts[i].nazivProizvoda){
                                            alreadyExists = true;

                                            products[k].brojProdanih += soldProducts[i].brojKomada;
                                            products[k].zarada += soldProducts[i].brojKomada * (soldProducts[i].prihod-soldProducts[i].rashod);

                                            break;
                                        }
                                    }

                                    if(alreadyExists == false){

                                        let proizvod = dajProizvod(soldProducts[i].nazivProizvoda, sviProizvodi);
                                        
                                        //Broj dana od dana nabavke pa do danasnjeg dana
                                        let dayDiff = getDifferenceInDays(proizvod.datumNabavke, new Date());
                                        //Broj dana od dana nabavke do dana posljednje prodaje
                                        let differenceInDays = getDifferenceInDays(proizvod.datumNabavke, proizvod.datumPosljednjeProdaje);

                                        //Broj komada prodanih u periodu od nabavke do dana posljednje prodaje
                                        let brojKomada = differenceInDays * proizvod.prosjekProdaje;
                                        
                                        //Pravi prosjek je ukupan broj prodanih komada kroz broj dana od nabavke pa do danas
                                        let praviProsjekProdaje = brojKomada;

                                        if(dayDiff != 0){
                                            praviProsjekProdaje = brojKomada/dayDiff;
                                        }

                                        products.push(
                                            {
                                            'naziv':soldProducts[i].nazivProizvoda,
                                            'brojProdanih':soldProducts[i].brojKomada,
                                            'zarada': soldProducts[i].brojKomada * (soldProducts[i].prihod-soldProducts[i].rashod),
                                            'ukupnoProdano': ukupnoProdano,
                                            'trenutniProsjek':praviProsjekProdaje
                                            });
                                    }
                                    
                                    break;
                                }
                            }                                    
                        }
                        res.send({"poruka":"OK", rezultat:products});
                        return products;
                    }
                });
                
            }
        });
    }
}