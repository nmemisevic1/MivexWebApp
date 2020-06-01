//import { create } from "istanbul-reports";
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
function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function kreirajElement(element, atributi) {

    let el = document.createElement(element);
    setAttributes(el, atributi);
    return el;
}

function ucitajBazeTrenutnogKorisnika() {

    let bazaDropDown = document.getElementById('aktivnaBaza');

    $.get('/user/current/aktivnaBaza/get', function (returnedData1) {

        if(returnedData1 == null) return;

        let aktivnaBaza = returnedData1.rezultat;

        $.get('/currentUser/allDatabases', function (returnedData) {

            if(returnedData == null || returnedData.rezultat == null) return;

            let k = Object.values(returnedData.rezultat);

            for (let i = 0; i < k.length; i++) {

                if (returnedData1.poruka == "Nema zapis" && i == 0) {
                    $.post('/baza/changeActive', { aktivnaBaza: k[i] }, function (returnedData) { });
                }

                let option1 = kreirajElement('option', { "class": "form-control", "value": k[i], "style": "color: darkslategray" });
                option1.innerHTML = k[i];
                bazaDropDown.options[bazaDropDown.options.length] = option1;

                if (returnedData.poruka == "OK" && k[i] == aktivnaBaza) {
                    bazaDropDown.value = option1.innerHTML;
                }
            }
        });

        bazaDropDown.onchange = function () {
            $.post('/baza/changeActive', { aktivnaBaza: bazaDropDown.options[bazaDropDown.selectedIndex].value }, function (returnedData) { });
        }
    });
}


function dashboardOnLoad() {

    ucitajBazeTrenutnogKorisnika();
    ucitajPorukeUsera();
}

function logOut() {

    $.get('/logout', function (returnedData) {
        window.location.replace('/login.html');
    });
}
