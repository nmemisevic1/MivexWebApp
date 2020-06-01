function showNotification(msg, boja) {
    var ikona;
    if (boja == 1) {
      ikona = "tim-icons icon-check-2";
    }
    else {
      ikona = "tim-icons icon-alert-circle-exc";
    }
  
    $.notify({
      icon: ikona,
      message: msg
  
    }, {
      type: type[boja],
      timer: 1500,
      placement: {
        from: 'top',
        align: 'center'
      },
      z_index: 2000,
  
    });
  }

  function changeForm(a) {
    var privilegijaZaStatistiku = true;
    if (privilegijaZaStatistiku) {
        var prva = document.getElementById("ukupnaStatistika");
        var druga = document.getElementById("statistikaKategorija");
        var treca = document.getElementById("najprodavanijiProizvodi");

        var prviButton = document.getElementById("button1");
        var drugiButton = document.getElementById("button2");
        var treciButton = document.getElementById("button3");


        if (a == 1) {

            //prva.innerHTML = "";
            prviButton.classList.add("active");
            drugiButton.classList.remove("active");
            treciButton.classList.remove("active");

            prva.style.display = "block";
            druga.style.display = "none";
            treca.style.display = "none";
            document.getElementById('naslovKartice').innerText = "Ukupna statistika";
        }
        else if (a == 2) {
            //druga.innerHTML = "";

            prviButton.classList.remove("active");
            drugiButton.classList.add("active");
            treciButton.classList.remove("active");
            document.getElementById('naslovKartice').innerText = "Statistika kategorija";

            prva.style.display = "none";
            druga.style.display = "block";
            treca.style.display = "none";

        }
        else if (a == 3) {
            //treca.innerHTML = "";

            prviButton.classList.remove("active");
            drugiButton.classList.remove("active");
            treciButton.classList.add("active");

            prva.style.display = "none";
            druga.style.display = "none";
            treca.style.display = "block";

            document.getElementById('naslovKartice').innerText = "Najprodavaniji proizvodi";

        }
        else {
            prviButton.classList.add("active");
            drugiButton.classList.remove("active");

            prva.style.display = "block";
            druga.style.display = "none";
        }
    }
}

function filtriraj(inputId, ulId) {
    // console.log(inputId,ulId);
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById(inputId);
    filter = input.value.toUpperCase();
    ul = document.getElementById(ulId);
    li = ul.getElementsByTagName('li');
    ul.style.display = "block";
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

function filterKategorija(inputID, ulID) {
    filtriraj(inputID, ulID);
    idHighlightKategorije = -1;
}

function oznaci(ch) {
    focusedInput = ch.id;
    focusedUL = "kategorije" + focusedInput[focusedInput.length - 1];
    console.log(focusedInput + " " + focusedUL);
    idHighlightKategorije = -1;
}

function dajVidljiveKategorije() {
    let kategorije = document.getElementById(focusedUL).getElementsByTagName('li');
    let noveKategorije = [];
    for (let i = 0; i < kategorije.length; i++) {
        if (kategorije[i].style.display != "none") noveKategorije.push(kategorije[i]);
    }
    return noveKategorije;
}

var focusedInput = "kategorija1";
var focusedUL = "kategorije1";
var idHighlightKategorije = -1;

function ucitajKategorijeUListu(){

    $.get('/dajSveKategorije', function(returnedData){

        if(returnedData == null || returnedData.rezultat == null) return;

        var kategorije = Object.values(returnedData.rezultat);

        for(let i=0;i<kategorije.length;i++){
            var li1 = kreirajElement('li',{"tabindex":"-1","onclick":"clickNaLiItem(this)"});
            var a1 = kreirajElement('a',{"href":"#statistike"}); a1.innerText = kategorije[i].naziv;
            li1.appendChild(a1);
            
            var li2 = kreirajElement('li',{"tabindex":"-1","onclick":"clickNaLiItem(this)"});
            var a2 = kreirajElement('a',{"href":"#statistike"}); a2.innerText = kategorije[i].naziv;
            li2.appendChild(a2);

            document.getElementById("kategorije1").appendChild(li1);
            document.getElementById("kategorije3").appendChild(li2);
        }
    });
}

function clickNaLiItem(li){
    var ukupnaStatistika = document.getElementById("button1").classList.contains("active");
    var statistikaKategorija = document.getElementById("button2").classList.contains("active");
    var najprodavanijiProizvodi = document.getElementById("button3").classList.contains("active");
    if(statistikaKategorija){
        document.getElementById('kategorija1').value = li.childNodes[0].innerText;
    }
    else if(najprodavanijiProizvodi){
        document.getElementById('kategorija3').value = li.childNodes[0].innerText;
    }
    else;
}
$(document).keyup(function (e) {
    if (e.key === "Enter") {
        let kategorije = dajVidljiveKategorije();
        for (var i = 0; i < kategorije.length; i++) {
            if (kategorije[i] === document.activeElement) {
                document.getElementById(focusedInput).value = kategorije[i].childNodes[0].innerText;
                document.getElementById(focusedUL).style.display = "none";
                //if (focusedUL == "kategorije1") ucitajTabeluStatistikeKategorija(kategorije[i].childNodes[0].innerText);
                //else if (focusedUL == "kategorije3") ucitajTabeluNajprodavanijihProizvoda(kategorije[i].childNodes[0].innerText);
            }
        }
    }

});

document.onkeydown = function (event) {

    if (document.getElementById(focusedUL).style.display == "block") {

        let kategorije = dajVidljiveKategorije();
        if (event.keyCode == 38) {
            event.preventDefault();
            // GORE
            idHighlightKategorije--;
            if (idHighlightKategorije < -1) { idHighlightKategorije = kategorije.length - 1; kategorije[idHighlightKategorije].focus(); }
            else if (idHighlightKategorije == -1) document.getElementById(focusedInput).focus();
            else kategorije[idHighlightKategorije].focus();

        }
        else if (event.keyCode == 40) {
            event.preventDefault();
            // DOLJE
            idHighlightKategorije++;

            if (idHighlightKategorije == kategorije.length) {
                idHighlightKategorije = -1;
                document.getElementById(focusedInput).focus();
            }
            else kategorije[idHighlightKategorije].focus();
        }
        else;
    }
};

function ucitajTabeluStatistikeKategorija(nazivKategorije) {

    var tabelaStatistikeKategorija = document.getElementById("statistikaKategorijaTable");
    tabelaStatistikeKategorija.innerHTML = "";
    var odDatum = document.getElementById("statistikaKategorijaOdDatuma").value;
    var doDatum = document.getElementById("statistikaKategorijaDoDatuma").value;
    var kategorijaDropdown = document.getElementById('kategorija1');

    $.get('/statistika/kategorije', {odDana: odDatum, doDana: doDatum, roditelj: kategorijaDropdown.value} , function(returnedData){

        if(returnedData.poruka == 'OK'){

            for(let i=0; i<returnedData.rezultat.kategorije.length; i++){

                let tr = kreirajElement('tr', {});
                let kategorija = kreirajElement('td', {}); kategorija.innerText = returnedData.rezultat.kategorije[i].naziv;
                let brojProdanih = kreirajElement('td', {}); brojProdanih.innerText = returnedData.rezultat.brojKomada[i];
                let zarada = kreirajElement('td', {}); zarada.innerText = returnedData.rezultat.ukupnaZarada[i].toFixed(2) + " KM";
                tr.appendChild(kategorija); tr.appendChild(brojProdanih); tr.appendChild(zarada);
                tabelaStatistikeKategorija.appendChild(tr);
            }
        }
        else{
            showNotification(returnedData.poruka, 4);
        }
    });
}

function ucitajTabeluNajprodavanijihProizvoda(nazivKategorije) {

    var tabelaNajprodavanijihProizvoda = document.getElementById("najprodavanijiProizvodiTable");
    tabelaNajprodavanijihProizvoda.innerHTML = "";
    let odDana = document.getElementById('najprodavanijiProizvodiOdDatuma').value;
    let doDana = document.getElementById('najprodavanijiProizvodiDoDatuma').value;

    $.get('/statistika/najproizvodi', {kategorija:nazivKategorije, odDana:odDana, doDana:doDana} , function(returnedData){

        returnedData.rezultat.sort(function (a, b) {
            return b.brojProdanih - a.brojProdanih;
        });

        for (let i = 0; i < returnedData.rezultat.length; i++) {

            let tr = kreirajElement('tr', {});    
            let nazivProizvoda = kreirajElement('td', {}); nazivProizvoda.innerText = returnedData.rezultat[i].naziv;    
            let brojProdanih = kreirajElement('td', {}); brojProdanih.innerText = returnedData.rezultat[i].brojProdanih;    
            let zarada = kreirajElement('td', {}); zarada.innerText = returnedData.rezultat[i].zarada.toFixed(2) + " KM";    
            let ukupnoProdanih = kreirajElement('td', {}); ukupnoProdanih.innerText = returnedData.rezultat[i].ukupnoProdano;    
            let trenutniProsjek = kreirajElement('td', {}); trenutniProsjek.innerText = returnedData.rezultat[i].trenutniProsjek.toFixed(2);
    
            tr.appendChild(nazivProizvoda); tr.appendChild(brojProdanih); tr.appendChild(zarada); tr.appendChild(ukupnoProdanih); tr.appendChild(trenutniProsjek);
            tabelaNajprodavanijihProizvoda.appendChild(tr);
        } 
    });
}

function ucitajUkupnuStatistiku(odDana, doDana) {
    
    $.get('/statistika/ukupno', {odDana:odDana, doDana:doDana}, function(returnedData){

        if(returnedData.poruka == 'OK'){

            let ukZarada = returnedData.rezultat.ukZarada;
            let ukPrihod = returnedData.rezultat.ukPrihod;
            let ukRashod = returnedData.rezultat.ukRashod;
            let rasNabavke = returnedData.rezultat.rasNabavke;
            let rasTroskova = returnedData.rezultat.rasTroskova;
            let ukProdanih = returnedData.rezultat.ukProdanih;
            let ukNabavna = returnedData.rezultat.nabavnaVrijednost;
            let ukProdajna = returnedData.rezultat.prodajnaVrijednost;

            document.getElementById("ukupnaZarada").innerText = ukZarada.toFixed(2) + " KM";
            document.getElementById("ukupanPrihod").innerText = ukPrihod.toFixed(2) + " KM";
            document.getElementById("ukupanRashod").innerText = ukRashod.toFixed(2) + " KM";
            document.getElementById("rashodNabavke").innerText = rasNabavke.toFixed(2) + " KM";
            document.getElementById("rashodTroskova").innerText = rasTroskova.toFixed(2) + " KM";
            document.getElementById("ukupnoProdanih").innerText = ukProdanih.toFixed(2) + " KOMADA";
            document.getElementById("nabavnaVrijednost").innerText = ukNabavna.toFixed(2) + " KM";
            document.getElementById("prodajnaVrijednost").innerText = ukProdajna.toFixed(2) + " KM";
        }
        else{
            showNotification(returnedData.poruka,4);
        }        
    });

   /* var ukZarada = 25000;

    var ukPrihod = 30000;
    var ukRashod = 5000;

    var rasNabavke = 17000;
    var rasTroskova = 13000;

    var ukProdanih = 1500;

    document.getElementById("ukupnaZarada").innerText = ukZarada.toString() + " KM";
    document.getElementById("ukupanPrihod").innerText = ukPrihod.toString() + " KM";
    document.getElementById("ukupanRashod").innerText = ukRashod.toString() + " KM";
    document.getElementById("rashodNabavke").innerText = rasNabavke.toString() + " KM";
    document.getElementById("rashodTroskova").innerText = rasTroskova.toString() + " KM";
    document.getElementById("ukupnoProdanih").innerText = ukProdanih.toString() + " KOMADA"; */
}

function izvuciStatistiku() {
    var ukupnaStatistika = document.getElementById("button1").classList.contains("active");
    var statistikaKategorija = document.getElementById("button2").classList.contains("active");
    var najprodavanijiProizvodi = document.getElementById("button3").classList.contains("active");

    if (ukupnaStatistika) {
        var odDatum = document.getElementById("ukupnaStatistikaOdDatuma");
        var doDatum = document.getElementById("ukupnaStatistikaDoDatuma");
        // provjeriti jesu li validni datumi
        // ako jesu 
        ucitajUkupnuStatistiku(odDatum.value, doDatum.value);
        // ako nisu
    }
    else if (statistikaKategorija) {
        var odDatum = document.getElementById("statistikaKategorijaOdDatuma");
        var doDatum = document.getElementById("statistikaKategorijaDoDatuma");
        var kategorija = document.getElementById("kategorija1");
        // provjeriti jesu li validni datumi i da li je kategorija odabrana
        // ako jesu 
        ucitajTabeluStatistikeKategorija(kategorija.value);
    }
    else if (najprodavanijiProizvodi) {
        var odDatum = document.getElementById("najprodavanijiProizvodiOdDatuma");
        var doDatum = document.getElementById("najprodavanijiProizvodiDoDatuma");
        var kategorija = document.getElementById("kategorija3");
        // provjeriti jesu li validni datumi i da li je kategorija odabrana
        // ako jesu 
        ucitajTabeluNajprodavanijihProizvoda(kategorija.value);
    }
    else;
}

function updateujGrafove(){
    var nizUkupneZaradePoMjesecima = [15000,16000,17000,16000,17000,16000,15000,14000,13000,14000,15000,16000];
    var nizUkupnoProdanihPoMjesecima = [100,200,300,400,500,600,500,400,500,600,700,800];
    var nizUkupnoPotrazenihPoMjesecima = [800,700,600,500,400,500,600,500,400,300,200,100];
    var glavneKategorije = ["Muški satovi","Ženski satovi","iPhone Maske","Galaxy Maske", "Huawei Maske"];
    var zaradePoGlavnimKategorijama = [3000,5000,1200, 2000, 3500];
    grafovi(nizUkupneZaradePoMjesecima,nizUkupnoProdanihPoMjesecima,nizUkupnoPotrazenihPoMjesecima,glavneKategorije,zaradePoGlavnimKategorijama);
}

function grafovi(niz1,niz2,niz3,niz4,niz5) {
    gradientChartOptionsConfigurationWithTooltipBlue = {
        maintainAspectRatio: false,
        legend: {
            display: false
        },

        tooltips: {
            backgroundColor: '#f5f5f5',
            titleFontColor: '#333',
            bodyFontColor: '#666',
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
        },
        responsive: true,
        scales: {
            yAxes: [{
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.0)',
                    zeroLineColor: "transparent",
                },
                ticks: {
                    suggestedMin: 60,
                    suggestedMax: 125,
                    padding: 20,
                    fontColor: "#2380f7"
                }
            }],

            xAxes: [{
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.1)',
                    zeroLineColor: "transparent",
                },
                ticks: {
                    padding: 20,
                    fontColor: "#2380f7"
                }
            }]
        }
    };

    gradientChartOptionsConfigurationWithTooltipPurple = {
        maintainAspectRatio: false,
        legend: {
            display: false
        },

        tooltips: {
            backgroundColor: '#f5f5f5',
            titleFontColor: '#333',
            bodyFontColor: '#666',
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
        },
        responsive: true,
        scales: {
            yAxes: [{
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.0)',
                    zeroLineColor: "transparent",
                },
                ticks: {
                    suggestedMin: 60,
                    suggestedMax: 125,
                    padding: 20,
                    fontColor: "#9a9a9a"
                }
            }],

            xAxes: [{
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(225,78,202,0.1)',
                    zeroLineColor: "transparent",
                },
                ticks: {
                    padding: 20,
                    fontColor: "#9a9a9a"
                }
            }]
        }
    };

    gradientChartOptionsConfigurationWithTooltipOrange = {
        maintainAspectRatio: false,
        legend: {
            display: false
        },

        tooltips: {
            backgroundColor: '#f5f5f5',
            titleFontColor: '#333',
            bodyFontColor: '#666',
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
        },
        responsive: true,
        scales: {
            yAxes: [{
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.0)',
                    zeroLineColor: "transparent",
                },
                ticks: {
                    suggestedMin: 50,
                    suggestedMax: 110,
                    padding: 20,
                    fontColor: "#ff8a76"
                }
            }],

            xAxes: [{
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(220,53,69,0.1)',
                    zeroLineColor: "transparent",
                },
                ticks: {
                    padding: 20,
                    fontColor: "#ff8a76"
                }
            }]
        }
    };

    gradientChartOptionsConfigurationWithTooltipGreen = {
        maintainAspectRatio: false,
        legend: {
            display: false
        },

        tooltips: {
            backgroundColor: '#f5f5f5',
            titleFontColor: '#333',
            bodyFontColor: '#666',
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
        },
        responsive: true,
        scales: {
            yAxes: [{
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.0)',
                    zeroLineColor: "transparent",
                },
                ticks: {
                    suggestedMin: 50,
                    suggestedMax: 125,
                    padding: 20,
                    fontColor: "#9e9e9e"
                }
            }],

            xAxes: [{
                barPercentage: 1.6,
                gridLines: {
                    drawBorder: false,
                    color: 'rgba(0,242,195,0.1)',
                    zeroLineColor: "transparent",
                },
                ticks: {
                    padding: 20,
                    fontColor: "#9e9e9e"
                }
            }]
        }
    };


    gradientBarChartConfiguration = {
        maintainAspectRatio: false,
        legend: {
            display: false
        },

        tooltips: {
            backgroundColor: '#f5f5f5',
            titleFontColor: '#333',
            bodyFontColor: '#666',
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
        },
        responsive: true,
        scales: {
            yAxes: [{

                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.1)',
                    zeroLineColor: "transparent",
                },
                ticks: {
                    suggestedMin: 60,
                    suggestedMax: 120,
                    padding: 20,
                    fontColor: "#9e9e9e"
                }
            }],

            xAxes: [{

                gridLines: {
                    drawBorder: false,
                    color: 'rgba(29,140,248,0.1)',
                    zeroLineColor: "transparent",
                },
                ticks: {
                    padding: 20,
                    fontColor: "#9e9e9e"
                }
            }]
        }
    };

    
    var ctx = document.getElementById("chartLinePurple").getContext("2d");

    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.2)');
    gradientStroke.addColorStop(0.2, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors

    var data = {
        labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        datasets: [{
            label: "Data",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#d048b6',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#d048b6',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#d048b6',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [80, 100, 70, 80, 120, 80],
        }]
    };

    var myChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: gradientChartOptionsConfigurationWithTooltipPurple
    });


    var ctxGreen = document.getElementById("chartLineGreen").getContext("2d");

    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(66,134,121,0.15)');
    gradientStroke.addColorStop(0.4, 'rgba(66,134,121,0.0)'); //green colors
    gradientStroke.addColorStop(0, 'rgba(66,134,121,0)'); //green colors

    var data = {
        labels: ['JUL', 'AUG', 'SEP', 'OCT', 'NOV'],
        datasets: [{
            label: "My First dataset",
            fill: true,
            backgroundColor: gradientStroke,
            borderColor: '#00d6b4',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#00d6b4',
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: '#00d6b4',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: [90, 27, 60, 12, 80],
        }]
    };

    var myChart = new Chart(ctxGreen, {
        type: 'line',
        data: data,
        options: gradientChartOptionsConfigurationWithTooltipGreen

    });



    var chart_labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var chart_data = niz1;


    var ctx = document.getElementById("chartBig1").getContext('2d');

    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(72,72,176,0.1)');
    gradientStroke.addColorStop(0.4, 'rgba(72,72,176,0.0)');
    gradientStroke.addColorStop(0, 'rgba(119,52,169,0)'); //purple colors
    var config = {
        type: 'line',
        data: {
            labels: chart_labels,
            datasets: [{
                label: "Ukupna zarada",
                fill: true,
                backgroundColor: gradientStroke,
                borderColor: '#d346b1',
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: '#d346b1',
                pointBorderColor: 'rgba(255,255,255,0)',
                pointHoverBackgroundColor: '#d346b1',
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: chart_data,
            }]
        },
        options: gradientChartOptionsConfigurationWithTooltipPurple
    };
    var myChartData = new Chart(ctx, config);
    $("#0").click(function () {
        var data = myChartData.config.data;
        data.datasets[0].data = chart_data;
        data.labels = chart_labels;
        data.datasets[0].label = "Ukupna zarada";
        myChartData.update();
    });
    $("#1").click(function () {
        var chart_data = niz2;
        var data = myChartData.config.data;
        data.datasets[0].data = chart_data;
        data.labels = chart_labels;
        data.datasets[0].label = "Ukupno prodanih artikala";
        myChartData.update();
    });

    $("#2").click(function () {
        var chart_data = niz3;
        var data = myChartData.config.data;
        data.datasets[0].data = chart_data;
        data.labels = chart_labels;
        data.datasets[0].label = "Ukupno potrazenih artikala";
        myChartData.update();
    });


    var ctx = document.getElementById("CountryChart").getContext("2d");

    var gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
    gradientStroke.addColorStop(0, 'rgba(29,140,248,0)'); //blue colors


    var myChart = new Chart(ctx, {
        type: 'bar',
        responsive: true,
        legend: {
            display: false
        },
        data: {
            labels: niz4,
            datasets: [{
                label: "Zarada",
                fill: true,
                backgroundColor: gradientStroke,
                hoverBackgroundColor: gradientStroke,
                borderColor: '#1f8ef1',
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                data: niz5,
            }]
        },
        options: gradientBarChartConfiguration
    });
}

function logOut() {

    $.get('/logout', function (returnedData) {
        window.location.replace('/login.html');
    });
}