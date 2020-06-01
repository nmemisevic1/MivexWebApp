# MivexWebApp

Mivex shop web aplikacija


ADMIN OPCIJE

1. Kreiranje nove baze

2. Kreiranje novog usera što uključuje:
      - odabir username i passworda > DONE
      - odabir privilegija koje će biti dodijeljene tom useru
      - odabir baza kojima će user imati pristup

3. Brisanje usera > DONE

4. Promjena pristupnih podataka ili privilegija određenog usera > DONE

5. Pregled statistike

6. Pregled svih aktivnosti aplikacije na određeni datum ili za određenog usera. Svaka akcija unutar aplikacije mora biti što je moguće preciznije dokumentovana (Log files) > FRDONE

7. Pregled svih informacija o proizvodu, što uključuje:
    - naziv proizvoda
    - ebay pretraga / link proizvoda
    - broj komada na stanju
    - nabavna cijena
    - prodajna cijena
    - ukupan broj dosad prodatih komada tog proizvoda
    - broj prodatih ovaj mjesec
    - informacije o eventualnim narudžbama ovog proizvoda koje se  očekuju da stignu

8. Izmjena podataka za određeni proizvod. Sve polja koja se nalaze u formi za dodavanje novog proizvoda (ili u formi informacija o proizvodu) trebaju biti editable i u njih automatski učitani već postojeći podaci o odabranom proizvodu

9. Upravljanje kategorijama proizvoda, što uključuje:

 - Kreiranje nove kategorije, pri čemu se pored naziva može birati i njena eventualna parent kategorija (ta nova kategorija će onda biti potkategorija neke već postojeće kategorije)  > FRDONE

- Brisanje kategorije. Ukoliko se briše kategorija koja ima svoje potkategorije, obrisati automatski i njih. Obavezno upozoriti usera o posljedicama brisanja. Ponuditi useru opciju da skupa sa kategorijom obriše i sve proizvode koji pripadaju toj kategoriji, ili da ih prebaci sve u neku drugu kategoriju. Ukoliko se user ne odluči za brisanje proizvoda ili prebacivanje, svim tim proizvodima dodijeliti uncategorized kategoriju.

- Edituj postojeću kategoriju


10. Upravljanje evidencijom o troškovima, što uključuje:

- Kreiranje nove vrste troška > FRDONE
- Edit postojeće vrste troška 
- Brisanje vrste troška > FRDONE
- Prijava iznosa određenog troška u KM (npr. prijava 100 KM troška tipa "Promocija") > FRDONE


11. Kreiranje obavijesti upućene prema selektiranim korisnicima (dodati i select all). Nakon što admin kreira obavijest, prilikom logina svim userima će na vrhu stranice stajati jasno vidljiva ta obavijest. Korisnicima omogućiti da uklone tu obavijest. Admin bira period koliko dugo bi ta obavijest trebala stajati prije nego sto expire (može od datuma do datuma)


12. Imati odjeljak za postavke u kojem se nalazi:

- trenutna vrijednost dolara
- sve ostale postavke koje ima smisla staviti u zavisnosti od načina implementacije aplikacije


13. Odjeljak za narudžbe koji uključuje:
 
- Registrovanje nove narudžbe određenog proizvoda, pri čemu se bilježe sljedeće informacije: proizvod koji je naručen, broj komada, datum narudžbe, datum kad se očekuje isporuka narudžbe, nabavna cijena po komadu

- Potvrda uspješno pristigle narudžbe. Ukoliko se radi o narudžbi proizvoda koji već postoji u bazi, treba da se automatski doda na stanje broj komada sadržan u toj narudžbi. Ukoliko se radi o novom proizvodu koji ne postoji u bazi, korisnik se preusmjerava automatski na formu za dodavanje tog proizvoda. Narudžbu obrisati iz evidencije narudžbi koje se čekaju.

- Brisanje i modifikacija već postojeće narudžbe
- Dio u kojem su prikazane narudžbe koje kasne


14. Barcode skener koji treba da ima mogućnosti:

- dodavanje novih pošiljki
- registrovanje pristigle pošiljke
- dio koji prikazuje pošiljke koje kasne (rok za povratak pošiljke neka bude 7 dana nakon što je dodana)

15. Registracija novog proizvoda, pri čemu forma treba da sadrži sljedeća polja:

- naziv proizvoda
- ebay pretraga / link
- broj komada na stanju
- nabavna cijena
- prodajna cijena

16. Omogućiti stavljanje proizvoda na sniženje

17. Obriši proizvod iz baze

OBIČNI USER

1. Prodaja određenog proizvoda koji treba da se bira pomoću slike. Prije toga bi se mogao staviti neki dropdown u kojem se može odabrati željena kategorija, da izbor bude uži. Kada se odabere proizvod, korisnik se pita koliko komada tog proizvoda želi prodati.

2. Dodavanje N komada postojećeg proizvoda na stanje

3. Storniraj prodaju (obrnut proces od prodaje proizvoda)

4. Prijavi dodatne troškove (obični user neka ima textbox u kojem specificira tačan razlog prijavljivanja dodatnog troška)

5. Uvid u broj komada na stanju za svaki artikal. User mora odabrati prvo kategoriju u kojoj se nalazi željeni proizvod, pa nakon toga odabrati sliku tog proizvoda. Nakon toga treba dobiti informaciju koliko komada tog artikla trenutno ima na stanju.

#### PRIVILEGIJE USERA
### Dashboard ima svako
### Pregled prozivoda
## Pregled svih proizvoda
## Prodaja proizvoda
## Storniranje proizvoda
## Dodavanje na stanje
## Narudzba proizvoda
## Brisanje proizvoda
## Edit proizvoda
### Dodavanje proizvoda
## Baze kojima se pristupa
## Dodavanje samo
### Narudzbe
## Registrovane narudzbe
## Oznacavanje isporucene narudzbe
## Brisanje narudzbe
## Editovanje narudzbe
## Pregled narudzbi koje kasne
## Pregled narudzbi koje je potrebno naruciti
## Narucivanje narudzbi koje je potrebno naruciti
### Posiljke
## Registracija novih posiljki
## Oznacavanje pristihlih posiljki
## Pregled posiljki koje kasne
### Troškovi
## Registrovanje novog troška
## Pregled nedavnih troškova
## Pregled svih troškova
## Dodavanje vrste troška
## Brisanje vrste troška
### Notifikacije
## Slanje notifikacija useru
### Kategorije
## Dodavanje kategorija
## Izmjena kategorija
## Brisanje kategorija
### Korisnici
## Pregled svih korisnika
## Mijenjanje podataka korisnika
## Brisanje korisnika
## Dodavanje novog korisnika
### Log
## Pregled svih logova
## Pregled logova samo tog usera
## Filtriranje logova
### Baze
## Kreiranje nove baze
## Pregled svih baza
## Mijenjanje naziva baze
## Brisanje baze