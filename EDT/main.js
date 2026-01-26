var EDT = null;
var colloscope = null;

// MER \d{2}h-\d{2}h

var Info_TD_id = null
var Info_Cours_id = null;
var DM_id = null;
var DS_id = null;
var ammount_semaine = null;

const Seconds_in_day = 1000*60*60*24
const Seconds_in_week = Seconds_in_day*7
const Day_1 = new Date("September 1, 2025");
const jour_str = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"]
const mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
const liste_prof = ["Mr. Damin","Mme. Lafrique","Mr. Ayrolles","Mr. Espanget","Mme. Devaux","Mr. Dencausse"]

var global_trinome = 3;
var global_semaine = 1;

async function loadJSON() { // Function to load JSONs
    console.clear()
    let response = await fetch('./EDT.json'); // Load EDT
    let json_text = await response.json();
    EDT = json_text;
    console.log("Loaded EDT")

    response = await fetch('./2TSI Colloscope.json'); // Load colloscope
    json_text = await response.json();
    colloscope = json_text;
    console.log("Loaded Colloscope")

    console.log("Finished loading JSONs")

    global_semaine = await get_week(); // Get current week

    Info_TD_id = colloscope.Jour.length; // Define IDs for various checks
    Info_Cours_id = Info_TD_id-1;
    DM_id = Info_Cours_id-1;
    DS_id = DM_id-1;
    ammount_semaine = Object.keys(colloscope).length-5+2;
    console.log("Assigned IDs")
    
    console.log("Started main thread")
    generate_html_table() // Start main process
}

function set_element(id, texte, methode = 1) { // document.element.innerHTML ...
    switch (methode) {
        case 1: // Add to id
            document.getElementById(id).innerHTML += texte;
            break;
        case 2: // Set by id
            document.getElementById(id).innerHTML = texte;
            break;
        case 3: // Set by Class
            document.getElementsByClassName(id).innerHTML = texte;
            break;
    }
}
function add_day(today, increment, hour_12=false) {
    if (hour_12) {
        hour_12 = Seconds_in_day/2
    } else {
        hour_12 = 0
    }
    return new Date(today.getTime()+hour_12 + increment*Seconds_in_day)
}
function get_dates_th() { // Generate Strings for dates
    let First_day_of_week = add_day(Day_1, (global_semaine-1)*7, true) // Get first day of the week
    console.log(First_day_of_week)
    let Dates_th = [];

    for (let i=0; i<7; i++) { // Generate Strings for dates
        let Current_day = add_day(First_day_of_week, i)
        let temp_text = Current_day.getDate()+"/"+(Current_day.getMonth()+1)
        Dates_th.push(temp_text)
    }

    return Dates_th
}
function reset_html() { // Set HTML to default
    set_element("DM","", 2);
    set_element("EDT", "", 3);
    let Dates_th = get_dates_th();
    for (let i=7; i<19; i++) {
        if (i==7) {
            set_element("EDT",  "<tr id=\"jour\"></tr>", 3);
            set_element("jour",  "<td class=\"head_collumn\" id=\"semaine\"></td>", 2);
            for (let i=0; i<6; i++) {
                set_element("jour",  "<th><pre>"+jour_str[i]+"\n"+Dates_th[i]+"</pre></th>");
            }
        } else if (i>= 8 && i<= 18) {
            set_element("EDT",  "<tr id=\""+i+"\"></tr>", 3);
            let j = i+1;
            set_element(i+"h",  "<th class=\"head_collumn\">"+i+"h-"+j+"h</th>", 2);
        }
    }
}
function get_week(Current_day = new Date()) {
    let week_temp = 0;
    if (Current_day.getDay() == 6 || Current_day.getDay() == 0) {
        week_temp++;
    }
    return Math.floor((Current_day-Day_1)/Seconds_in_week)+1+week_temp
}

function check_kholle(jour_semaine, temps) { // Checks if there is a kholle
    if (global_semaine > ammount_semaine || global_semaine < 3) {
        return false
    }

    for (let i=0; i<=colloscope.Jour.length; i++) { // For every collumn
        if (colloscope["Jour"][i] == jour_str[jour_semaine]) { // Checks if correct day
            if (colloscope["Heure"][i] == temps) { // Check if correct hour
                if (colloscope["S"+global_semaine][i+1] == global_trinome) { // Checks if correct trinome
                    console.log("%ckholle at: "+temps+"h", 'color:green;');
                    return true
                }
            }
        }
    }

    return false
}
function on_class(EDT_heure, collone_EDT) {
    switch (EDT_heure[0]) {
        case 0:
            return false
        case 1:
            if (!(EDT_heure[1][0] == "")) {
                if (EDT_heure[1][0] == "Info") {
                    if (!(check_info(EDT_heure, collone_EDT) == EDT_heure)) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            } else {
                return false
            }
        case 2:
            if (!(EDT_heure[1+collone_EDT][0] == "")) {
                if (EDT_heure[1+collone_EDT][0] == "TD-Info") {
                    if (!(check_info(EDT_heure, collone_EDT) == EDT_heure)) {
                        return false
                    } else {
                        return true
                    }
                } else {
                    return true
                }
            } else {
                return false
            }
        default:
            return false
    }
}
function add_khole(jour_semaine, temps, EDT_heure, collone_EDT) { // Add kholle to table
    for (let i=0; i<=colloscope.Jour.length; i++) {                             // | Same as check_kholle()
        if (colloscope["Jour"][i] == jour_str[jour_semaine]) {                  // |
            if (colloscope["Heure"][i] == temps) {                              // |
                if (colloscope["S"+global_semaine][i+1] == global_trinome) {    // |
                    let temp = ""
                    let temp_id = "Colle"
                    temp += "Khôlle de "+colloscope["Matiere"][i]+"\n"  // What it is
                    temp += "Salle: "+colloscope["Salle"][i]+"\n"       // Which room
                    temp += "Prof: "+colloscope["Prof"][i]              // Which teacher

                    if (on_class(EDT_heure, collone_EDT)) { // Check if collision with class
                        temp += "\n /!\\ Sur un cours"
                        temp_id = "Colle_Collision"
                        console.log("%cCollision with class",'color:crimson;')
                    }

                    temp = "<td id=\""+temp_id+"\"><pre>"+temp+"</pre></td>"  // Make it fancy
                    set_element(temps+"h",temp)
                    return
                }
            }
        }
    }
}

function get_text_edt(EDT_config) { // Builds the string for classes
    let text = ""
    switch (EDT_config[0]) {
        case "Math": // Damin
            text = "Mathématiques\n"+liste_prof[0];
            break;        
        case "TD-Math":
            text = "TD: Mathématiques\n"+liste_prof[0];
            break;
        case "Info":
            text = "Informatique\n"+liste_prof[0];
            break;
        case "TD-Info":
            text = "TD: Informatique\n"+liste_prof[0];
            break;

        case "PC": // Lafrique
            text = "Physique-Chimie\n"+liste_prof[1];
            break;
        case "TD-PC":
            text = "TD: Physique-Chimie\n"+liste_prof[1];
            break;
        case "TP-PC":
            text = "TP: Physique-Chimie\n"+liste_prof[1];
            break;

        case "SII-A": // Ayrolles
            text = "SII\n"+liste_prof[2];
            break;
        case "TD-SII-A":
            text = "TD: SII\n"+liste_prof[2];
            break;
        case "TP-SII-A":
            text = "TP: SII\n"+liste_prof[2];
            break;

        case "SII-E": // Espagnet
            text = "SII\n"+liste_prof[3];
            break;
        case "TD-SII-E":
            text = "TD: SII\n"+liste_prof[3];
            break;
        case "TP-SII-E":
            text = "TP: SII\n"+liste_prof[3];
            break;

        case "FR": // Devaux
            text = "Francais\n"+liste_prof[4];
            break;
        case "TD-FR":
            text = "TD: Francais\n"+liste_prof[4];
            break;

        case "ENG": // Dencausse (le goat)
            text = "Anglais\n"+liste_prof[5];
            break;
        case "EPS": // EPS
            text = "EPS";
            break;
        case "TIPE":
            text = "TIPE";
            break;
        
        default:
            text = "NaN";
            break;
            
    }

    if (EDT_config[0] == "") { // Handle Pauses
        return ["empty",""]
    } else {
        if (EDT_config[0] == "TIPE" || EDT_config[0] == "EPS") { // Handle Special cases
            text += ""
        } else { // Add Class
            text += "\nSalle n°"+EDT_config[1];
        }
        text = "<pre>"+text+"</pre>"; // Make it fancy
        return [EDT_config[0],text]
    }
}
function hourly_sub1(temps, similaire) { // Basic repetitive thing to clean things up
    text_edt = get_text_edt(similaire[0]);
    set_element(temps-similaire[1]+"h",  "<td rowspan=\""+similaire[1]+"\" id=\""+text_edt[0]+"\" >"+text_edt[1]+"</td>");
}
function check_info(EDT_heure, collone_EDT) { // If no Info/TD-Info this week
    let temp = ""
    switch (EDT_heure[0]) {
        case 1:
            temp = EDT_heure[1][0]
            break;
        case 2:
            temp = EDT_heure[1+collone_EDT][0]
            break;
        default:
            temp = ""
    }
    switch (temp) {
        case "Info":
            if (!(colloscope["S"+global_semaine][Info_Cours_id]) || colloscope["S"+global_semaine][Info_Cours_id] == "") {
                console.log("%cPas Info",'color:orange;');
                return EDT_heure = [0,[""]];
            }
        case "TD-Info":
            if (!(colloscope["S"+global_semaine][Info_TD_id]) || colloscope["S"+global_semaine][Info_TD_id] == "") {
                console.log("%cPas TD Info",'color:orange;');
                return EDT_heure = [0,[""]];
            }
        default:
            return EDT_heure
    }
}
function hourly_handler(collone_EDT, jour_semaine) { // Handles assgignement of every hour
    let similaire = null;
    let temps = 8;
    let is_kholle = false

    while (temps<19) { // Loop to check every hour
        is_kholle = check_kholle(jour_semaine, temps);
        let EDT_heure = EDT[jour_str[jour_semaine]][temps+"h"];

        if (is_kholle) { // If kholle, put it
            if (similaire == null) {
                add_khole(jour_semaine, temps, EDT_heure, collone_EDT)
                temps++
            } else {
                hourly_sub1(temps, similaire)
                similaire = null;
            }
        } else if (!(similaire == null) && similaire[0] == "EPS") {
            similaire[1]++
            temps++
            hourly_sub1(temps, similaire)
            similaire = null
        } else { // Else, Handle Classes

            if (!(EDT_heure[0] == 3)) { // Possibility of not Info
                EDT_heure = check_info(EDT_heure, collone_EDT)
            }

            switch (EDT_heure[0]) { // Checks for classes
                case 0: // Nothing
                    if (similaire == null) {
                        similaire = [EDT_heure[1],1];
                        if (temps == 18) {
                            hourly_sub1(temps+1, similaire);   
                        }
                        temps++;
                    } else {
                        hourly_sub1(temps, similaire)
                        similaire = null;
                    }
                    break;
                case 1: // Every week is the same
                    if (similaire == null) {
                        similaire = [EDT_heure[1],1];
                        temps++;
                    } else {
                        hourly_sub1(temps, similaire)
                        similaire = null;
                    }
                    break;
                case 2: // Alternates
                    if (similaire == null) {
                        similaire = [EDT_heure[1+collone_EDT],1];
                        temps++;
                    } else {
                        hourly_sub1(temps, similaire)
                        similaire = null;
                    }
                    break;
                default: // Continue last one
                    if (similaire == null) {
                        temps--
                        let EDT_heure_bis = EDT[jour_str[jour_semaine]][temps+"h"];
                        switch (EDT_heure_bis[0]) {
                            case 0:
                                similaire = [EDT_heure_bis[1],1];
                                if (temps == 18) {
                                    hourly_sub1(temps+1, similaire);   
                                }
                                break;
                            case 1:
                                similaire = [EDT_heure_bis[1],1];
                                break;
                            case 2:
                                similaire = [EDT_heure_bis[1+collone_EDT],1];
                                break;
                        }
                        temps++;
                    } else {
                        similaire[1]++;
                    }
                    temps++;
            }
        }
    }
}

function DM_handler() { // Sets DMs
    let temp = ""
    if (global_semaine == 2) {
        temp += "DM cette semaine: Pas de DM\n"
        temp += "DM prochaine semaine: "+colloscope["S3"][DM_id]
    } else if (global_semaine > 2) {
        let temp_2 = ""

        if (colloscope["S"+global_semaine][DM_id] == "") {
            temp_2 = "Pas de DM"
        } else {
            temp_2 = colloscope["S"+global_semaine][DM_id]
        }
        temp += "DM cette semaine: "+temp_2+"\n"

        if (colloscope["S"+(global_semaine+1)][DM_id] == "") {
            temp_2 = "Pas de DM"
        } else {
            temp_2 = colloscope["S"+(global_semaine+1)][DM_id]
        }
        temp += "DM prochaine semaine: "+temp_2
    }
    set_element("DM", "<pre>"+temp+"</pre>")
}

function daily_table_creator(jour_semaine = 0) { // Iterate for every Day (Checks for vacations and stuff)
    console.log("%cDay #"+jour_semaine,'color:blue;')
    let collone_EDT = 0; // Select Group
    if (global_semaine%2 == 1) {
        if (global_trinome<=5) {
            collone_EDT = 0;
        } else {
            collone_EDT = 1;
        }
    } else {
        if (global_trinome<=5) {
            collone_EDT = 1;
        } else {
            collone_EDT = 0;
        }
    }
    
    hourly_handler(collone_EDT, jour_semaine); // Start test for that day

    if (jour_semaine < 4) { // If still during the week
        daily_table_creator(jour_semaine+1);
    } else { // Saturday
        if (global_semaine >= 3 && global_semaine <= ammount_semaine) {
            if ( !(colloscope["S"+global_semaine][DS_id] == "")) {
                set_element("8h",  "<td rowspan=\"4\" id=\"DS\"><pre>DS:\n"+colloscope["S"+global_semaine][DS_id]+"</pre></td>")
            }
        }
        return
    }
}

function generate_html_table() { // Prep everything
    console.clear()

    reset_html()

    cookie_handler()

    let semaine_text_temp = "<pre>Semaine" // Displays Info about this week
    if (global_semaine%2 == 1) {
        semaine_text_temp += " A (n°"+global_semaine+")"
        semaine_text_temp += "\nTrinome n°"+global_trinome+"</pre>";
    } else {
        semaine_text_temp += " B (n°"+global_semaine+")"
        semaine_text_temp += "\nTrinome n°"+global_trinome+"</pre>";
    }
    set_element("semaine", semaine_text_temp)
    console.log("Set week text")
    
    DM_handler(); // Set DMs
    console.log("Set DMs")

    if (global_semaine >= 3 && global_semaine <= ammount_semaine) { // Checks if vacation and stuff
        switch (colloscope["S"+global_semaine][1]) {
            case "Vacances":
                set_element("8h", "<td id=\"Full\" rowspan=\"11\" colspan=\"6\">Vacances</td>");
                console.log("%cVacation",'color:red;')
                break;
            case "Concours Blanc":
                set_element("8h", "<td id=\"Full\" rowspan=\"11\" colspan=\"6\"><pre>Concours Blanc\n/!\\ DS possible</pre></td>");
                console.log("%cConcours",'color:red;')
                break;
            default:
                console.log("%cStarted daily creator",'color:red;')
                daily_table_creator();
        }
    } else { // Normal Way
        console.log("%cStarted daily creator,'color:red;'")
        daily_table_creator();
    }
}

loadJSON();

// Fonction depuis HTML
function handle_html_groupe() { // Fonction pour choisir le groupe
    groupe = document.getElementById("text_groupe").value;
    global_trinome = parseInt(groupe);
    setCookie("trinome",global_trinome,365);
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

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + "path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function cookie_handler() {
    var trinome_temp = getCookie("trinome") // Get trinome / Sets if as cookie
    if (trinome_temp == "") {
        alert("Pas de cookies trouvé!")
    } else {
        global_trinome = parseInt(trinome_temp);
        document.getElementById("text_groupe").value = trinome_temp;
        console.log("Cookie exist and loaded")
    }
}