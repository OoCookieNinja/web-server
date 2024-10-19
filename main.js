var EDT = null;
var colloscope = null;
const jour_str = ["Lu","Ma","Me","Je","Ve","Sa"]
const mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
const jour_ferie = [
    new Date("2024-11-01T00:00:00.000Z"),
    new Date("2024-11-11T00:00:00.000Z"),
    new Date("2024-12-25T00:00:00.000Z"),
    new Date("2025-01-01T00:00:00.000Z"),
    new Date("2025-04-20T00:00:00.000Z"),
    new Date("2025-04-21T00:00:00.000Z"),
    new Date("2025-05-01T00:00:00.000Z"),
    new Date("2025-05-08T00:00:00.000Z"),
    new Date("2025-05-08T00:00:00.000Z"),
    new Date("2025-05-29T00:00:00.000Z"),
    new Date("2025-06-08T00:00:00.000Z"),
    new Date("2025-06-09T00:00:00.000Z"),
    new Date("2025-07-14T00:00:00.000Z"),
    new Date("2025-08-15T00:00:00.000Z"),
    new Date("2025-11-01T00:00:00.000Z"),
    new Date("2025-11-11T00:00:00.000Z"),
    new Date("2025-12-25T00:00:00.000Z"),
    new Date("2026-01-01T00:00:00.000Z"),
    new Date("2026-04-05T00:00:00.000Z"),
    new Date("2026-04-06T00:00:00.000Z"),
    new Date("2026-05-01T00:00:00.000Z"),
    new Date("2026-05-08T00:00:00.000Z"),
    new Date("2026-05-14T00:00:00.000Z"),
    new Date("2026-05-24T00:00:00.000Z"),
    new Date("2026-05-25T00:00:00.000Z"),
]
const nombre_trinomes = 12;
const nombre_groupe = 3;
var current_week = [null,null,null,null,null]
var global_groupe = 2;
var global_semaine = null;
var info_bool = false;

async function loadJSON() { // Charger les fichier et mettre en place les variables neccessaires
    let response = await fetch('./EDT.json');
    let json_text = await response.json();  json_text = json_text["EDT_data"];
    EDT = json_text;

    let response_2 = await fetch('./colloscope.json');
    let json_text_2 = await response_2.json();  json_text_2 = json_text_2["colloscope_data"];
    colloscope = json_text_2;

    console.log("Finished loading")

    global_semaine = await get_week();
    console.log("Started main thread")
    generate_html_table();
}

function set_element(id, texte, methode = 1) { // document.element.innerHTML ...
    switch (methode) {
        case 1: // Ajout
            document.getElementById(id).innerHTML += texte;
            break;
        case 2: // Assignation
            document.getElementById(id).innerHTML = texte;
            break;
        case 3: // Assignation par class
            document.getElementsByClassName(id).innerHTML = texte;
            break;
    }
}
function generate_text(idx) { // Genération de la Date pour les jours
    let date = new Date(colloscope["S"+global_semaine][1]);
    date.setDate(date.getDate() + idx)
    current_week[idx] = date
    let month = mois[date.getMonth()]
    return "<p style=\"font-size: medium\">"+date.getDate()+" "+month+" "+date.getFullYear()+"</p>"
}
function reset_table() { // Réinitialise l'EDT
    current_week = []
    set_element("EDT", "", 3);
    for (let i=7; i<19; i++) {
        if (i==7) {
            // Reset de la ligne "jour"
            set_element("EDT",  "<tr id=\"jour\"></tr>", 3);
            // Ajout des jours
            set_element("jour",  "<td id=\"semaine\"></td>", 2);
            set_element("jour",  "<th><pre>Lundi\n"+generate_text(0)+"</pre></th>");
            set_element("jour",  "<th><pre>Mardi\n"+generate_text(1)+"</pre></th>");
            set_element("jour",  "<th><pre>Mercredi\n"+generate_text(2)+"</pre></th>");
            set_element("jour",  "<th><pre>Jeudi\n"+generate_text(3)+"</pre></th>");
            set_element("jour",  "<th><pre>Vendredi\n"+generate_text(4)+"</pre></th>");
            set_element("jour",  "<th><pre>Samedi\n"+generate_text(5)+"</pre></th>");
        } else if (i>= 8 && i<= 18) {
            // Reset de la ligne i h
            set_element("EDT",  "<tr id=\""+i+"\"></tr>", 3);
            // Ajout des heures
            let j = i+1;
            set_element(i+"h",  "<th>"+i+"h-"+j+"h</th>", 2);
        }
    }
}
function get_week() {
    if (global_semaine == null) {
        let current_date = new Date();
        for (let i = 1; i <= 43; i++) {
            let test_date_before = new Date(colloscope["S"+i][1]);
            let test_date_after = new Date(colloscope["S"+i][2]);

            if ( (test_date_before.getFullYear()       <= current_date.getFullYear()) && (current_date.getFullYear() <= test_date_after.getFullYear())  ) { // Si meme anné
                if ( (test_date_before.getMonth()      <= current_date.getMonth()   ) && (current_date.getMonth()    <= test_date_after.getMonth()) ) {    // Si meme mois
                    if ( current_date.getDate()        <= test_date_after.getDate()) {     // Si meme semaine
                        console.log("Found week");
                        return i
                    }
                }
            }
        }
    }
}

function get_text_edt(data_from_edt) { // Assigniation du texte par rapport aux données de EDT.json
    switch (data_from_edt) {
        case "Chretien":
            return "Mathématique";
        case "Bousquet":
            return "Physique";
        case "Espagnet":
            return "<pre>SII\n avec Espagnet</pre>";
        case "Ayrolles":
            return "<pre>SII\n avec Ayrolles</pre>";
        case "SII": // pour les cours en TD
            if (colloscope["S"+global_semaine][0] == "A") { // semaine A
                return get_text_edt("Ayrolles")
            } else if (colloscope["S"+global_semaine][0] == "B") { // semaine B
                return get_text_edt("Espagnet")
            }
        case "TP_SII":
            return "<pre>TP de SII\nvoir groupe</pre>"
        case "Devaux":
            return "Français";
        case "Dencausse":
            return "Anglais";
        case "Damin":
            return "Informatique";
        case "G":
            return "Informatique";
        default:
            return data_from_edt;
    }
}
function is_ferie(jour_semaine) {
    let jour_test = new Date(current_week[jour_semaine])
    for (let k=0; k<jour_ferie.length; k++) {
        let ferie_test = new Date(jour_ferie[k])
        if (jour_test.getFullYear()     == ferie_test.getFullYear() ) {
            if (jour_test.getMonth()    == ferie_test.getMonth()    ) {
                if (jour_test.getDate() == ferie_test.getDate()     ) {
                    return true
                }
            }
        }
    }
    return false
}
function special_case(arg, temps, jour_semaine, similaire) {
    switch (arg) {
        case 1:
            if ((colloscope["S"+global_semaine][40] == true) && (jour_semaine==3) && (temps>11)) {
                return true;
            } else {
                return false
            }
        case 2:
            if ((colloscope["S"+global_semaine][39] == true) && (jour_semaine==3) && (temps>11)) {
                return true;
            } else {
                return false
            }
        case 3:
            if(similaire[0] == "TP") {
                return true
            } else {
                return false
            }
    }
}

// Informatique
function info_handler(temps, idx) { // Creation des cours d'info en groupes
    if (colloscope.heure[idx+1] == temps) {
        set_element(temps+"h",  "<td id=\"G\">"+get_text_edt("G")+"</td>");
        info_bool = true;        
    }
}
function info_checker(temps) {
    for (let i=35; i<38; i++) {
        if (global_groupe <= 1*nombre_trinomes/nombre_groupe && colloscope["S"+global_semaine][i] == "G1") {
            info_handler(temps, i);
            i=99;
        } else if (global_groupe <= 2*nombre_trinomes/nombre_groupe && global_groupe > 1*nombre_trinomes/nombre_groupe && colloscope["S"+global_semaine][i] == "G2") {
            info_handler(temps, i);
            i=99;
        } else if (global_groupe <= 3*nombre_trinomes/nombre_groupe && global_groupe > 2*nombre_trinomes/nombre_groupe && colloscope["S"+global_semaine][i] == "G3") {
            info_handler(temps, i);
            i=99;
        }
    }    
}


// Kholle
function kholle_generate_text(matiere, arg) { // Generateur de texte de kholle avec matiére, salle et prof
    let temp_kholle_texte = "<pre>Khôlle ";
    switch (matiere) { // Matiére
        case "Math":
            temp_kholle_texte += "de Mathematique";
            break;
        case "Physique":
            temp_kholle_texte += "de Physique";
            break;
        case "Anglais":
            temp_kholle_texte += "d'Anglais";
            break;
        case "Francais":
            temp_kholle_texte += "de Francais";
            break;
        case "Elec":
            temp_kholle_texte += "d'Elec";
            break;
        case "Meca":
            temp_kholle_texte += "de Meca";
            break;
    }
    temp_kholle_texte += "\n Salle: "+colloscope.salle[arg+1] // Salle
    temp_kholle_texte += "\n Prof: "+colloscope.profs[arg+1]  // Profs
    temp_kholle_texte += "</pre>" // Fin du texte
    return [colloscope.heure[arg+1], temp_kholle_texte, "Colle"]
}
function kholle_checker(temps, jour_semaine) { // Regarder si il y a une colle
    for (let n=3; n < colloscope["S"+global_semaine].length; n++) {
        if (colloscope.jour[n+1] == jour_str[jour_semaine] && temps == colloscope.heure[n+1]) {
            switch (colloscope["S"+global_semaine][n]) {
                case global_groupe:
                    return [true,n];
                case global_groupe+" E":
                    return [true,n];
                case global_groupe+" M":
                    return [true,n];
            }
        }
    }
    return false // Si pas de colle pour l'heure et le jour spécifié
}
function kholle_handler(temps, jour_semaine) { // Gestion des colles
    let kholle_texte_temp = [temps,"","empty"];
    let result_kholle_check = kholle_checker(temps, jour_semaine);
    if (result_kholle_check[0]) { // Si colle, regarder laquelle et ajouter du texte pour
        if (result_kholle_check[1] < 15) {
            kholle_texte_temp = kholle_generate_text("Math", result_kholle_check[1]);

        } else if (result_kholle_check[1] < 21) {
            kholle_texte_temp = kholle_generate_text("Physique", result_kholle_check[1]);

        } else if (result_kholle_check[1] < 27) {
            kholle_texte_temp = kholle_generate_text("Anglais", result_kholle_check[1]);

        } else if (result_kholle_check[1] < 33) {
            console.log("colle meca/elec")
            if (colloscope["S"+global_semaine][result_kholle_check[1]] == global_groupe+" E") {
                    kholle_texte_temp = kholle_generate_text("Elec", result_kholle_check[1]);
                    console.log("E")

            } else if (colloscope["S"+global_semaine][result_kholle_check[1]] == global_groupe+" M") {
                    kholle_texte_temp = kholle_generate_text("Meca", result_kholle_check[1]);
                    console.log("M")

            }
        } else if (result_kholle_check[1] == 33 || result_kholle_check[1] == 34) {
            kholle_texte_temp = kholle_generate_text("Francais", result_kholle_check[1]);
            
        }
    }

    if (!info_bool) { // Si il y a pas de cours d'info a cette heure alors on ajoute un element a l'EDT
        set_element(kholle_texte_temp[0]+"h",  "<td id=\""+kholle_texte_temp[2]+"\">"+kholle_texte_temp[1]+"</td>");
    }
}


// Gestion EDT
function kholle_and_info_handler(temps, jour_semaine) { // Gestion des colles et cours d'info en groupe
    info_bool = false;
    if (temps >= 15 && temps <= 17 && jour_semaine == 2) { // Gestion des cours d'info en fonction des groupes
        info_checker(temps);
    } else if (("G1" in colloscope["S"+global_semaine])) { // Si pas d'info
        set_element(temps+"h",  "<td id=\"empty\"></td>");
    }

    if (global_groupe in colloscope["S"+global_semaine]) { //Gestion des colles
        kholle_handler(temps, jour_semaine);
    }
}
function hourly_handler(collone_EDT, jour_semaine) {
    let similaire = null;
    let temps = 8;
    if (is_ferie(jour_semaine)) { // Si jour ferié
        while (temps<19) {
            if (kholle_checker(temps, jour_semaine)) {
                if (!(similaire == null)) {
                    set_element(temps-similaire+"h", "<td id=\"Ferie\" rowspan=\""+similaire+"\">Férié</td>");
                }
                kholle_and_info_handler(temps, jour_semaine)
                similaire = null
                temps++;
            } else {
                if(similaire == null) {
                    similaire = 1;
                    temps++;
                } else {
                    similaire++;
                    temps++;
                }
            }
            if (temps == 19) {
                set_element(temps-similaire+"h", "<td id=\"Ferie\" rowspan=\""+similaire+"\">Férié</td>");
            }
        }
    }

    while (temps<19) { // principale
        if ( (!(EDT[temps+"h"][2*jour_semaine+collone_EDT] == null) || !(similaire == null)) && !(kholle_checker(temps, jour_semaine)[0]) ) {
            if (similaire == null) { // Nouvel element
                similaire = [EDT[temps+"h"][2*jour_semaine+collone_EDT], 1];
                temps++;
            }
            else if ( !(similaire == null) && EDT[temps+"h"][2*jour_semaine+collone_EDT]  ==  similaire[0] ) { // Si element est similaire au precedent
                similaire[1]++; temps++;
            }
            else if ( !(similaire == null)  &&  !(EDT[temps+"h"][2*jour_semaine+collone_EDT]  ==  similaire[0]) ) { // Si element n'est pas similaire au precedent
                if (special_case(1, temps, jour_semaine, similaire)) {
                    similaire[0] = "Pas de SII"
                } else if (special_case(2, temps, jour_semaine, similaire)) {
                    similaire[0] = "TP_SII"
                } else if (special_case(3, temps, jour_semaine, similaire)) {
                    similaire[0] = ""
                }
                set_element(temps-similaire[1]+"h",  "<td rowspan=\""+similaire[1]+"\" id=\""+similaire[0]+"\" >"+get_text_edt(similaire[0])+"</td>");
                similaire = null;
            }
        } else {
            if (!(similaire == null)) {
                set_element(temps-similaire[1]+"h",  "<td rowspan=\""+similaire[1]+"\" id=\""+similaire[0]+"\" >"+get_text_edt(similaire[0])+"</td>");
                similaire = null;                
            }
            kholle_and_info_handler(temps, jour_semaine) // Regarder si c'est une colle ou Info + assignation
            temps++;
        }
    }

}

function daily_table_creator(jour_semaine = 0) {
    console.log("Jour n°"+jour_semaine)
    let collone_EDT = 0; // Assignation des groupes pour récupérer les emploi du temps correcte
    if (colloscope["S"+global_semaine][0] == "A") { // semaine A
        if (global_groupe<=nombre_trinomes/2) {
            collone_EDT = 0;
        } else {
            collone_EDT = 1;
        }
    } else if (colloscope["S"+global_semaine][0] == "B") { // semaine B
        if (global_groupe<=nombre_trinomes/2) {
            collone_EDT = 1;
        } else {
            collone_EDT = 0;
        }
    }
    
    hourly_handler(collone_EDT, jour_semaine); // Boucle pour la creation

    if (jour_semaine < 4) { // nouveau jour
        daily_table_creator(jour_semaine+1);
    } else { // DS de samedi
        if ( !(colloscope["S"+global_semaine][38] == null) ) {
            set_element("8h",  "<td rowspan=\"4\" id=\"DS\">"+colloscope["S"+global_semaine][38]+"</td>");           
        }
        return
    }
}


// Initialisation
function generate_html_table() {
    reset_table();

    if (colloscope["S"+global_semaine][3] == "Vacances") { // Si c'est des vacances
        set_element("8h", "<td id=\"Vacances\" rowspan=\"11\" colspan=\"6\">Vacances</td>");
        return
    }

    let semaine_text_temp = "<pre>Semaine" // Texte pour semaine et groupe
    if (colloscope["S"+global_semaine][0] == "A") {
        semaine_text_temp += " A (n°"+global_semaine+")"
        semaine_text_temp += "\nGroupe T"+global_groupe+"</pre>";
    } else if (colloscope["S"+global_semaine][0] == "B") {
        semaine_text_temp += " B (n°"+global_semaine+")"
        semaine_text_temp += "\nGroupe T"+global_groupe+"</pre>";
    }
    set_element("semaine", semaine_text_temp)
    
    daily_table_creator();
}
loadJSON();


// Fonction depuis HTML
function handle_html_groupe() { // Fonction pour choisir le groupe
    groupe = document.getElementById("text_groupe").value;
    global_groupe = parseInt(groupe);
    generate_html_table()
}

function handle_html_semaine(arg) { // Fonction pour choisir la semaine
    if (arg == 1) {
        global_semaine--
    } else if (arg == 2) {
        global_semaine++
    }
    generate_html_table();
}