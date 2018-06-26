// ==UserScript==
// @author          Lord Dalzhim feat TortuX and NLX
// @name            Blood Wars Quest BOT
// @namespace       bw
// @version         2018.06.20.1
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_log
// @grant           GM_registerMenuCommand
// @grant           GM_xmlhttpRequest
// @description     Ce script prend en charge de façon automatisée les quêtes dans blood wars pour plusieurs zones et plusieurs niveaux de difficulté.
// @include         https://r1.fr.bloodwars.net/*
// @include         https://r2.fr.bloodwars.net/*
// @include         https://r4.fr.bloodwars.net/*
// @include         https://r6.fr.bloodwars.net/*
// @updateURL       http://torrentflux.teamvip.eu/DATA/oOBWOo/Blood_Wars_Quest_BOT.user.js
// @icon            http://torrentflux.teamvip.eu/DATA/oOBWOo/quest.png
// @require         http://torrentflux.teamvip.eu/DATA/oOBWOo/typeObject.js
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
//allow pasting
// ==/UserScript==

var questCost = new Array(
    //        z5  z4   z3   z2  z1
    new Array(50, 150, 250, 400,1000 ), // Quêtes Faciles
    new Array(250, 500, 1000, 3000,8000), // Quêtes Moyennes
    new Array(2000, 3000, 4000, 8000,10000)  // Quêtes Difficiles
);
var timeoutbase=1000;//1 s //temps entre les transitions
function estPolonais(){
    return new RegExp("https\:\/\/r.\.bloodwars.interia.pl").test(location.href);
}

function estAnglais(){
    return new RegExp("https\:\/\/r.\.bloodwars.net").test(location.href);
}

var raceName = new Array();
raceName[1]=22;
raceName[2]=23;
raceName[3]=24;
raceName[4]=25;
raceName[5]=26;

var questName = new Array();
questName[0]=12;
questName[1]=13;
questName[2]=14;

var sBotIs = 0;
var sActive = 1;
var sInactive = 2;
var sStartsQuests = 3;
var sMedium = 4;
var sHard = 5;
var sEasy = 6;
var sRemainingQuests = 7;
var sMessageList = 8;
var sUpdateRequired = 9;
var sStartBot = 10;
var sStopBot = 11;
var sConfigEasy = 12;
var sConfigMedium = 13;
var sConfigHard = 14;
var sConfigStatus = 15;
var sShowDrops = 16;
var sClearDrops = 17;
var sFirstUsage = 18;
var sVersionBw = 19;

var sChooseRace = 20;
var sDispRace = 21;

var sCapteur = 22;
var sCultiste = 23;
var sSeigneur = 24;
var sAbsorbeur = 25;
var sDamne = 26;

var sChooseYourRace = 27;

var sNbOfArk = 28;
var sCharisme = 29;
var sReputation = 30;
var sAgilite = 31;
var sForce = 32;
var sResistance = 33;
var sChance = 34;
var sPerception = 35;

var sParamStuff = 36;
var sParamStuff1 = 37;
var sParamStuff2 = 38;

var sActivStuff = 39;
var sActivStuff1 = 40;
var sIsActivStuff = 41;

var sActiveF = 42;
var sInactiveF = 43;
var sPreset = 44;
var sOptions = 45;
var sUpdate = 46;

var frenchStrings = new Array(
    "Le BOT est ",
    "actif",
    "inactif",
    "Configuré pour lancer des quêtes ",
    "moyennes",
    "difficiles",
    "faciles",
    "Les quêtes restantes: ",
    "LISTE DES MESSAGES",
    "Une mise à jour du script est nécessaire pour continuer à s'en servir. Souhaitez-vous vérifier si une telle mise à jour est disponible?",
    "Démarrer BW Quest Bot",
    "Arrêter BW Quest Bot",
    "Quêtes Faciles",
    "Quêtes Moyennes",
    "Quêtes Difficiles",
    "Statut",
    "Afficher Drops",
    "Effacer Drops",
    "Félicitations, vous venez de réussir l'installation du bot bloodwars! Faites bien attention à ne pas laisser d'objets importants sur votre tablette #2 car cette tablette est utilisée par le bot pour obtenir des LOL en vendant au magasin. Cliquez Ok pour lancer le bot et Annuler pour aller protéger vos objets! Bon Jeu!",
    "v 1.7.26a beta",
    "Choisir la Race",
    "Voir la Race et les Arcanes Choisis",
    "Capteur d'Esprit",
    "Cultiste",
    "Seigneur des Bêtes",
    "Absorbeur",
    "Damné",
    "Choisissez votre Race :",
    "Nombre d'arcane",
    "Masque d'Adonis (Charisme)",
    "Masque de Caligula (Réputation)",
    "Voies Félines (Agilité)",
    "Frénésie Sauvage (Force)",
    "Peau de Bête (Rsistance)",
    "Pouvoir du Sang (Chance)",
    "Le Chasseur de la Nuit (Perception)",
    "Parametrage du Stuff",
    "Choisir le stuff à replacer après les quêtes.",
    "Il y a t'il des objets perso à remettre en AC ?\r\nLes éléments doivent se retrouver en étagère #9.\r\n1)Oui\r\n0)Non",
    "Activer Stuff",
    "Activer la fonction de remise du stuff en AC après les quêtes. Et de remettre un stuff prédéfinit ?\r\n1)Oui\r\n0)Non",
    "La fonction Stuff est ",
    "active",
    "inactive",
    "Preset N°",
    "Options",
    "Mettre à jour les options générale"
);

var englishStrings = new Array(
    "The BOT is ",
    "active",
    "inactive",
    "Configure to performs ",
    "medium quests",
    "hard quests",
    "easy quests",
    "Quests remaining: ",
    "MESSAGES LIST",
    "An update of this script is necessary to continue using it. Do you wish to look if an update is currently available?",
    "Start BOT",
    "Stop BOT",
    "Easy Quests",
    "Medium Quests",
    "Hard Quests",
    "Status",
    "Show Drops",
    "Clear Drops",
    "Congratulations, you have successfully installed the bloodwars bot! Be careful never to have any important objects on your shelf #2 as it is used by the bot to generate LOL for quests by selling it's content to the shop. Click Ok to start the bot or Cancel to go protect your objects! Enjoy!",
    "v 1.7.26a beta",
    "Choose the Race",
    "View Race and Arcana",
    "Thoughtcatcher",
    "Cultist",
    "Beastmaster",
    "Absorber",
    "Cursed one",
    "Choose your Race :",
    "Number of arcana",
    "Mask of Adonis (Charisma)",
    "Mask of Caligula (Reputation)",
    "Cat's Paths (Agility)",
    "Bloodfrenzy (Strength)",
    "Beast's Hide (Toughness)",
    "Power of blood (Chance)",
    "Night hunter (Perception)",
    "Stuff options",
    "Choose the stuff to replace after quest finished .\r\nPredefined set between 1 and 20.",
    "There are any personal items to replace in AC ?\r\nThe elements should be placed in shelf #9.\r\n1)Yes\r\n0)No",
    "Enable Stuff",
    "Activate the delivery of AC stuff after the quest. And provide a predefined stuff ?\r\n1) Yes\r\n0) No",
    "Stuff fonction is ",
    "active",
    "inactive",
    "Preset N°",
    "Options",
    "Update"
);

var polishStrings = new Array(
    "Bot jest",
    "aktywny",
    "nieaktywny",
    "i wykonuje",
    "srednie zadania",
    "trudne zadania",
    "latwe zadania",
    "Pozostalo questow",
    "LISTA WIADOMOSCI",
    "Niezbedny jest update do dalszego korzystania z niego ! Czy chcesz zobaczyc czy jest dostepny na stronie ?",
    "start bot",
    "stop bot",
    "latwe zadania",
    "srednie zadania",
    "trudne zadania",
    "status",
    "pokaz",
    "wyczysc",
    "Congratulations, you have successfully installed the bloodwars bot! Be careful never to have any important objects on your shelf #2 as it is used by the bot to generate LOL for quests by selling it's content to the shop. Click Ok to start the bot or Cancel to go protect your objects! Enjoy!",
    "v 1.7.26a beta",
    "Choose the Race",
    "View Race and Arcana",
    "Thoughtcatcher",
    "Cultist",
    "Beastmaster",
    "Absorber",
    "Cursed one",
    "Choose your Race :",
    "Number of arcana",
    "Mask of Adonis (Charisma)",
    "Mask of Caligula (Reputation)",
    "Cat's Paths (Agility)",
    "Bloodfrenzy (Strength)",
    "Beast's Hide (Toughness)",
    "Power of blood (Chance)",
    "Night hunter (Perception)",
    "Stuff options",
    "Choose the stuff to replace after quest finished .\r\nPredefined set between 1 and 20.",
    "There are any personal items to replace in AC ?\r\nThe elements should be placed in shelf #9.\r\n1)Yes\r\n0)No",
    "Enable Stuff",
    "Activate the delivery of AC stuff after the quest. And provide a predefined stuff ?\r\n1) Yes\r\n0) No",
    "Stuff fonction is ",
    "aktywny",
    "nieaktywny",
    "Preset N°",
    "Options",
    "Update"
);
function getNameJoueur(){
    var stat=document.getElementsByClassName("stats-player")[0];
    nom=stat.getElementsByClassName("me")[0];
    return nom.innerHTML;
}

function getLevel(){
    var div = document.getElementsByClassName('stats-player')[0].innerHTML;
    return parseInt(div.substring((div.indexOf("NIVEAU "))+7, div.indexOf("',CAPTIONFONTCLASS")));
}

function getChildAttr(element, tagName, attributeNames, attributeValues){
    if (element == null || attributeNames.length != attributeValues.length) {
        return null;
    }
    for (var i = 0; i < element.childNodes.length; ++i) {
        if (tagName == null || element.childNodes[i].nodeName == tagName) {
            var j;
            for (j = 0; j < attributeNames.length; ++j) {
                if (element.childNodes[i].getAttribute(attributeNames[j]) != attributeValues[j]) {
                    break;
                }
            }
            if (j == attributeNames.length) {
                return element.childNodes[i];
            }
        }
    }
    return null;
}

function getChild(element, tagName){
    return getChildAttr(element, tagName, Array(), Array());
}

var strings;
if (estPolonais()) {
    strings = polishStrings;
} else if (estAnglais()) {
    strings = englishStrings;
} else {
    strings = frenchStrings;
}

function startBOT(){
    GM_setValue(location.hostname + "NbQuetesRestantes",1);
    GM_setValue(location.hostname + "isBotRunning", "true");
    runBot();
    window.location.href = '/?a=quest';
}

function stopBOT(){
    setCurrentIndexQuestToDo(""+0);
    GM_setValue(location.hostname + "CurrentNbQuestDone",""+0);
    GM_setValue(location.hostname + "isBotRunning", "false");
}

function easyQuests(){
    GM_setValue(location.hostname + "questIndex", "0");
    GM_setValue(location.hostname + "questDiff", "questDiff_0");
}

function mediumQuests(){
    GM_setValue(location.hostname + "questIndex", "1");
    GM_setValue(location.hostname + "questDiff", "questDiff_1");
}

function hardQuests(){
    GM_setValue(location.hostname + "questIndex", "2");
    GM_setValue(location.hostname + "questDiff", "questDiff_2");
}
/*****************************************************************************************************************************/
function setNbQuestsToDo(index,nb){
    GM_setValue(location.hostname + "nbQuest_"+index,""+ nb);
}
function getNbQuestsToDo(index){
    return GM_getValue(location.hostname + "nbQuest_"+index,"0");
}
function setCurrentIndexQuestToDo(index){
    GM_setValue(location.hostname + "CurrentIndexQuest",""+index);
}
function getCurrentIndexQuestToDo(){
    return GM_getValue(location.hostname + "CurrentIndexQuest","0");
}
function getCurrentNbQuestDone(){
    return GM_getValue(location.hostname + "CurrentNbQuestDone","0");
}
function SetCurrentNbQuestDone(nb){

    GM_setValue(location.hostname + "CurrentNbQuestDone",""+nb);
}
/*****************************************************************************************************************************/
function premiereUtilisation(){
    var pasPremier = GM_getValue(location.hostname + "firstUsage") == "true";
    GM_setValue(location.hostname + "firstUsage", "true");
    return !pasPremier;
}

function isBotRunning(){
    return GM_getValue(location.hostname + "isBotRunning", "false") == "true";
}

function getQuestIndex(){
    return GM_getValue(location.hostname + "questIndex", "1");
}

function getQuestDiff(){
    return GM_getValue(location.hostname + "questDiff", "questDiff_0");
}

function showBotStatus(){
    alert(
        strings[sBotIs] + (isBotRunning() ? strings[sActive] : strings[sInactive]) + ".\r\n" +
        strings[sStartsQuests] + (getQuestIndex() == "1" ? strings[sMedium] : (getQuestIndex() == "2" ? strings[sHard] : strings[sEasy])) + ".\r\n" +
        strings[sIsActivStuff] + (GM_getValue(location.hostname + "destuffActif") == "true" ? strings[sActiveF] : strings[sInactiveF]) + (GM_getValue(location.hostname + "ens")!=0 ? ' (' + strings[sPreset] + GM_getValue(location.hostname + "ens") + ')' : '') + ".\r\n" +
        affRace()
    );
}
function pageTalisman(){
    window.location.href = '/?a=talizman';
}
function pageMagasin(){
    window.location.href = '/?a=townshop';
}
function getDrops(){
    return GM_getValue(location.hostname + "drops", "");
}

function showDrops(){
    document.getElementById("content-mid").innerHTML = GM_getValue(location.hostname + "drops_rapports", "");
}

function clearDrops(){
    GM_setValue(location.hostname + "drops_rapports", "");
}

function setChangementPageAutomatique(){
    GM_setValue(location.hostname + "autoNavigate", "true");
}

function setChangementPageAutomatiqueEffectue(){
    GM_setValue(location.hostname + "autoNavigate", "false");
}

function estChangementPageAutomatique(){
    return GM_getValue(location.hostname + "autoNavigate", "false") == "true";
}

function allerPageQuetes(){
    if(evitePause()){
        setChangementPageAutomatique();
        window.location.href = '/?a=quest';
    }
    else{
        setTimeout(allerPageQuetes,Math.ceil(1500*Math.random() + 10000));
    }
}

function allerPageArmurerie(){
    if(evitePause()){
        setChangementPageAutomatique();
        window.location.href = '/?a=equip';
    }
    else{
        setTimeout(allerPageArmurerie,Math.ceil(1500*Math.random() + timeoutbase+2000));
    }

}
function allerPageMagasin(){
    setChangementPageAutomatique();
    setTimeout(pageMagasin, Math.ceil(Math.random() * 1000)+timeoutbase+500);
}
/***********************************************************Talisman************************************************************************/
function allerPageTalisman(){
    setChangementPageAutomatique();
    setTimeout(pageTalisman, Math.ceil(Math.random() * 2000)+timeoutbase);
}
/*******************************************************************************************************************************************/
function launchQuestForReal(){
    if(evitePause()){
        var tmp =GM_getValue(location.hostname + "race");
        if(GM_getValue(location.hostname + "verifCout")==1){
            verifCout(tmp);
            GM_setValue(location.hostname + "verifCout",0);
        }
        if(tmp==1){
            document.getElementById("ark_1").value = parseInt(GM_getValue(location.hostname + "ark_1"));
            document.getElementById("ark_2").value = parseInt(GM_getValue(location.hostname + "ark_2"));
        }
        else if(tmp==2){
            document.getElementById("ark_6").value = parseInt(GM_getValue(location.hostname + "ark_2"));
        }
        else if(tmp==3){
            document.getElementById("ark_3").value = parseInt(GM_getValue(location.hostname + "ark_1"));
            document.getElementById("ark_4").value = parseInt(GM_getValue(location.hostname + "ark_2"));
        }
        else if(tmp==4){
            if( document.getElementById("ark_12")!=null)
                document.getElementById("ark_12").value = parseInt(GM_getValue(location.hostname + "ark_3"));
        }
        else if(tmp==5){
            if( document.getElementById("ark_13")!=null)
                document.getElementById("ark_13").value = parseInt(GM_getValue(location.hostname + "ark_1"));
        }
        document.getElementById("startQuest").click();
    }
    else{
        setTimeout(launchQuestForReal,Math.ceil(1500*Math.random() + 10000));
    }
}

function getArgent(){
    var TD = document.getElementsByClassName("panel-cell");
    var TDARGENT = TD[2];
    var SPAN = TDARGENT.getElementsByTagName("SPAN");
    var ARGENT = SPAN[0].innerHTML;
    ARGENT = ARGENT.replace("LOL", "");
    ARGENT = ARGENT.replace(" ", "");
    return parseInt(ARGENT);
}


function getArgentOLD() {
    var divMain = getChildAttr(document.body, "DIV", Array("class"), Array("main"));
    var subDiv = getChild(divMain, "DIV");
    var divTop = getChildAttr(subDiv, "DIV", Array("class"), Array("top"));
    var divCash = getChildAttr(divTop, "DIV", Array("class"), Array("topstats stats-cash"));
    var table = getChild(divCash, "TABLE");
    var tbody = getChild(table, "TBODY");
    var tr = getChild(tbody, "TR");
    var td = getChildAttr(tr, "TD", Array("class"), Array("panel-cell"));
    var str = td.childNodes[4].nodeValue;
    alert(str)
    var numbers = str.match(/(\d{1,3})/g);
    var strFormattee = "";
    for(var i = 0; i < numbers.length; ++i) {
        strFormattee = strFormattee.concat(numbers[i]);
    }
    return parseInt(strFormattee);
}

function getZone() {
    //var divMain = getChildAttr(document.body, "DIV", Array("class"), Array("main"));
    //var subDiv = getChild(divMain, "DIV");
    //var divTop = getChildAttr(subDiv, "DIV", Array("class"), Array("top"));
    //var divPlayer = getChildAttr(divTop, "DIV", Array("class"), Array("stats-player"));
    //var span = getChild(divPlayer, "SPAN");
    var zone = $(".stats-player span").text().charAt(0);
    //return span.childNodes[0].nodeValue.charAt(0);
    return zone;
}

function getQuestCost(){
    return questCost[parseInt(getQuestIndex())][(getZone() - 5) * -1];
}

function isArgentAssezPourQuete(){
    return getArgent() > getQuestCost();
}

function getSecondesRestantes(){
    var timeleft = document.getElementById("quest_timeleft");
    var str = timeleft.childNodes[0].nodeValue;
    var myArray = /(\d+) s/.exec(str);
    secondsRemaining = -1;
    if (myArray != null) {
        secondsRemaining = parseInt(myArray[1]);
    } else {
        myArray = /\d:(\d{2}):(\d{2})/.exec(str);
        if (myArray != null) {
            secondsRemaining = (parseInt(myArray[1]) * 60) + parseInt(myArray[2]);
        }
    }
    return secondsRemaining;
}

function attendreFinDeLaQuete(){
    if(evitePause()){
        var secondsRemaining = getSecondesRestantes();
        if (secondsRemaining >= 0) {
            setTimeout(attendreFinDeLaQuete, (secondsRemaining + Math.ceil(10*Math.random()) + 4) * 1000+timeoutbase);
        } else {
            var timeleft = document.getElementById("quest_timeleft");
            if (timeleft.childNodes[0].nodeName == "A") {
                setChangementPageAutomatique();
                window.location.href = timeleft.childNodes[0].href;
            }
        }
    }else   {
        setTimeout(attendreFinDeLaQuete, (secondsRemaining + Math.ceil(10*Math.random()) + 9) * 1000+timeoutbase);
    }
}

function getNbQuetesRestantes(){
    var content = document.getElementById("content-mid");
    var div = getChildAttr(content, "DIV", Array("style"), Array("margin-top: 10px; margin-bottom: 20px;"));
    var span = getChild(div, "SPAN");
    var b = getChild(span, "B");
    return parseInt(b.childNodes[0].nodeValue);
}

function estQuetePreteALancer(){
    return document.getElementById("startQuest") != null;
}

function estSurPageLancementQuete(){
    var resultat = location.search.search(/\?a=quest/);
    return resultat != -1;
}

function estSurPageProgressionQuete(){
    return document.getElementById("quest_timeleft") != null;
}

function estSurPageArmurerie(){
    return document.getElementById("formularz") != null;
}
function estSurPageMagasin(){

    return document.getElementsByClassName("eqtypehdr").length != 0;
}
function estSurPageMessages(){
    var content = document.getElementById("content-mid");
    var divTopOptions = getChildAttr(content, "DIV", Array("class"), Array("top-options"));
    var a = getChildAttr(divTopOptions, "A", Array("href"), Array("?a=msg"));
    return a != null;
}

function estSurPageRapportQuete(){
    var content = document.getElementById("content-mid");
    var divTopOptions = getChildAttr(content, "DIV", Array("class"), Array("top-options"));
    if (divTopOptions != null) {
        var divCenter = getChildAttr(content, "DIV", Array("align"), Array("center"));
        var divQuest = getChildAttr(divCenter, "DIV", Array("class"), Array("msg-content msg-quest"));
        return divQuest != null;
    }
    return false;
}
/**********************************************************Talisman*************************************************************************/
function estSurPageTalisman(){
    return location.search.substring(0,11)=="?a=talizman"
}
/*******************************************************************************************************************************************/
function enregistrerDrop(drop){
    var drops = getDrops();
    if(drops.length > 0) {
        drops += ", " + drop;
    } else {
        drops = drop;
    }
    GM_setValue(location.hostname + "drops", drops);
}
function testeval(){
    var k=0;
    var j,i,k,l;
    for(m in (typeObject["objet"])){

        j=0;
        while(j<typeObject["objet"][m] ["itemType"].length){//parcours des  styles d'objets casque, casquette
            //typeObject["objet"][m] ["itemType"][j]
            i=0;
            while(i<typeObject["objet"][m] ["Préfixe"].length ){//parcours des prefixes pour chaque style
                // typeObject["objet"][obj] ["Préfixe"][i]
                k=0;
                while(k<typeObject["objet"][m] ["Suffixe"].length){//parcours de chaque suffixe, pour caque prefixe de chaque style probleme cas non traité s'il n'y a pas de préfix ou de suffixe non traité
                    l=0;
                    while(l<typeObject["qualite"].length){//parfait, ou bon
                        tmp="Légendaire "+typeObject["qualite"][l]+" "+typeObject["objet"][m] ["itemType"][j]+" "+typeObject["objet"][m] ["Préfixe"][i]+" "+typeObject["objet"][m] ["Suffixe"][k];
                        GM_log(tmp);

                        l++;
                    }
                    l=0;
                    while(l<typeObject["qualite"].length){//parfait, ou bon
                        tmp=typeObject["qualite"][l]+" "+typeObject["objet"][m] ["itemType"][j]+" "+typeObject["objet"][m] ["Préfixe"][i]+" "+typeObject["objet"][m] ["Suffixe"][k];
                        GM_log(tmp);
                        l++;
                    }
                    tmp="Epique "+" "+typeObject["objet"][m] ["itemType"][j]+" "+typeObject["objet"][m] ["Préfixe"][i]+" "+typeObject["objet"][m] ["Suffixe"][k];
                    GM_log(tmp);
                    k++;
                }
                alert("continuer");
                i++;
            }
            j++;
        }
    }
}
function evalObject(objet){
    //recherche du type d'objet
    var bool=false;
    var obj;
    var j=0,i=0,k=0,l=0;
    var epique=-1;
    var type=0;
    var qualite=0;
    var base=0;
    for(m in (typeObject["objet"])){//recherche des catégories d'objet exemple casque,armure etc ..
        j=0;
        while(j<typeObject["objet"][m] ["itemType"].length && objet.indexOf(typeObject["objet"][m] ["itemType"][j])==-1){
            j++;
        }

        if(j!=typeObject["objet"][m] ["itemType"].length){//type determiné
            obj=m;
            //recherche de l'exitence d'un prefixe
            i=0;
            while(i<typeObject["objet"][m] ["Préfixe"].length && objet.indexOf(typeObject["objet"][obj] ["Préfixe"][i])==-1){
                i++;
            }

            //recherche de l'existence d'un suffixe
            k=0;
            while(k<typeObject["objet"][m] ["Suffixe"].length && objet.indexOf(typeObject["objet"][obj] ["Suffixe"][k])==-1){
                k++;
            }

            if(objet.indexOf(typeObject["epique"])!=-1){
                epique=0;
            }
            else{
                if(objet.indexOf(typeObject["legendaire"])!=-1){

                    epique=1;
                }
                type=-1;
                while(type<typeObject["qualite"].length && objet.indexOf(typeObject["qualite"][type])==-1){
                    type++;
                }
            }
            break;
        }
        l++;
    }
    switch(epique){
        case 0: //epique
            base=3;
            break;
        case 1://legendaire
            switch(type){
                case 0:
                    base=1;
                    break;
                case 1: //parfait
                    base=2;
                    break;
                default: base=1;break;
            }
            break;
        default:
            switch(type){
                case 0:
                    base=0;
                    break;
                case 1://parfait
                    base=1;
                    break;
                default:break;
            }
            break;
    }
    switch(l){//selon le type d'objet
        case 0: // casque
            if(k==7||k==10){//suffixe preco ou adre
                qualite+=base+3;
                if((j==0||j==8||j==9)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un fronteau, un masque ou un bandana
            }
            if(i!=typeObject["objet"][m] ["Préfixe"].length){//a un prefixe
                if(i==7||i==12){//le prefixe est un chance
                    qualite+=base+1;
                    if(j==0||j==8||j==9){qualite+=1;}//c'est un fronteau, un masque ou un bandana
                }
                else{
                    if(i==0||i==9||i==8||i==14){//le prefixe est un set
                        qualite+=base+2;
                    }
                    if(j==0||j==8||j==9){
                        qualite+=1;//c'est un fronteau, un masque ou un bandana
                    }
                    else if(i==13||i==17){//le prefixe est un tigre ou un runique
                        if(j==0||j==8||j==9){qualite+=1;}//c'est un fronteau, un masque ou un bandana
                        qualite+=base+3;
                    }
                }
            }
            break;
        case 1:  //Armure
            if(k==16||k==5){//orchi ou semeur de la mort
                qualite+=base+2;
                if((j==1)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est une cape
            }
            if(k==7){//vitesse
                qualite+=base+4;
                if((j==1)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est une cape
            }
            if(i!=typeObject["objet"][m] ["Préfixe"].length){//a un prefixe

                if(i==1||i==4||i==6||i==8){//le prefixe est un chasseur ou un elfe
                    qualite+=base+1;
                    if(j==1){qualite+=1;}//c'est une cape
                }
                else{
                    if(i==0||i==9||i==10||i==13){//le prefixe est un set
                        qualite+=base+2;
                        if(j==1){qualite+=1;}//c'est une cape
                    }
                    else if(i==14||i==12){//le prefixe est un tigre ou un runique
                        qualite+=base+3;
                        if(j==1){qualite+=1;}//c'est une cape
                    }
                }
            }
            break;
        case 2: //Pantalon
            if(k==0||k==2||k==4||k==5||k==7||k==9||k==11){ //suffixe de l'esquive
                qualite+=base+1;
                if(j==3&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un short
            }
            if(k==3){//suffixe nuit
                qualite+=base+4;
                if(j==3&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un short
            }
            if(i!=typeObject["objet"][m] ["Préfixe"].length){//a un prefixe

                if(i==5||i==6||i==7){//elfe ou leger ou flexible
                    qualite+=base+1;
                    if(j==3){qualite+=1;}//c'est un short
                }
                else{
                    if(i==1||i==9||i==13){//le prefixe est un set
                        qualite+=base+2;
                        if(j==3){qualite+=1;}//c'est un short
                    }
                    else if(i==12||i==15){//le prefixe est un tigre ou un runique
                        if(j==3){qualite+=1;}//c'est un short
                        qualite+=base+3;
                    }
                }
            }
            break;
        case 3: //Anneau
            if(k==0||k==1||k==7||k==12||k==13||k==15||k==17||k==18){
                qualite+=base;
                if((j==1||j==2)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un Bracelet ou une chevalière
            }
            if(k==5||k==6||k==8||k==9||k==19){//suffixe jouvence,justesse,facilite,concentration,sang
                qualite+=base+1;
                if((j==1||j==2)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un Bracelet ou une chevalière
            }
            if(k==4||k==10){//levitation,chauvesouris
                qualite+=base+2;
                if((j==1||j==2)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un Bracelet ou une chevalière
            }
            if(k==14||k==3){//suffixe dement,chance,
                qualite+=base+3;
                if((j==1||j==2)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un Bracelet ou une chevalière
            }
            if(i!=typeObject["objet"][m] ["Préfixe"].length){//a un prefixe

                if(i==12||i==14){//
                    qualite+=base;
                    if(j==1||j==2){qualite+=1;}//c'est un Bracelet ou une chevalière
                }
                else{
                    if(i==6||i==7||i==13||i==16||i==19||i==25||i==12||i==9||i==10||i==11||i==14||i==23||i==27){//le prefixe est un set
                        qualite+=base+1;
                        if(j==1||j==2){qualite+=1;}//c'est un Bracelet ou une chevalière
                    }
                    else if(i==0||i==1||i==2||i==4||i==5|i==17|i==18||i==26||i==21||i==22||i==15||i==20||i==24){//le prefixe est chance faucon,araigné,noir,solaire
                        if(j==1||j==2){qualite+=1;}//c'est un Bracelet ou une chevalière
                        qualite+=base+2;
                    }
                }
            }
            break;
        case 4: //Amulette
            if(k==1||k==7||k==12||k==13||k==15||k==17||k==14||k==18){//sufixe
                qualite+=base;
                if((j==1||j==3||j==4)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un chaine ou une cravate ou foulard
            }
            if(k==5||k==6||k==9||k==19||k==18||k==2){//suffixe justesse,facilite,concentration,sang,pelerin,De L`Habilité
                qualite+=base+1;
                if((j==1||j==3||j==4)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un chaine ou une cravate ou foulard
            }
            if(k==10){//levitation,chauvesouris
                qualite+=base+2;
                if((j==1||j==3||j==4)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un chaine ou une cravate ou foulard
            }
            if(k==4||k==0){//suffixe chance,del'art
                qualite+=base+3;
                if((j==1||j==3||j==4)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un chaine ou une cravate ou foulard
            }
            if(i!=typeObject["objet"][m] ["Préfixe"].length){//a un prefixe

                if(i==12||i==14){
                    qualite+=base;
                    if(j==1||j==3||j==4){qualite+=1;}//c'est un chaine ou une cravate ou foulard
                }
                else{
                    if(i==6||i==7||i==13||i==16||i==19||i==25||i==12||i==9||i==10||i==11||i==14||i==23||i==27){//le prefixe est un set
                        qualite+=base+1;
                        if(j==1||j==3||j==4){qualite+=1;}//c'est un chaine ou une cravate ou foulard
                    }
                    else if(i==0||i==1||i==2||i==4||i==5|i==17|i==18||i==26||i==21||i==22||i==15||i==20||i==24){//le prefixe est chance faucon,araigné,noir,solaire
                        if(j==1||j==3||j==4){qualite+=1;}//c'est un chaine ou une cravate ou foulard
                        qualite+=base+2;
                    }
                }
            }
            break;
        case 5: //Arme à une main
            //  alert(k);
            if(k==0||k==3||k==4||k==7||k==8||k==12||k==13||k==16||k==19||k==15){//suffixe
                qualite+=base;
                if((j==1||j==2||j==5||j==6||j==8)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un "Hache", "Kama","Poing Américain","Poing des Cieux", "Wakizashi"
            }
            if(k==1||k==5||k==17||k==18||k==14||k==9||k==10){//suffixe ameliorer
                qualite+=base+1;
                if((j==1||j==2||j==5||j==6||j==8)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un "Hache", "Kama","Poing Américain","Poing des Cieux", "Wakizashi"
            }
            if(k==2||k==6||k==11||k==21){//moyenne de l'agi
                qualite+=base+2;
                if((j==1||j==3||j==4)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un chaine ou une cravate ou foulard
            }

            if(i!=typeObject["objet"][m] ["Préfixe"].length){//a un prefixe

                if(i==13||i==15||i==18){//
                    qualite+=base;
                    if(j==1||j==2||j==5||j==6||j==8){qualite+=1;}//c'est un "Hache", "Kama","Poing Américain","Poing des Cieux", "Wakizashi"
                }
                else{
                    if(i==0||i==2){//le prefixe est un set
                        qualite+=base+1;
                        if(j==1||j==2||j==5||j==6||j==8){qualite+=1;}//c'est un "Hache", "Kama","Poing Américain","Poing des Cieux", "Wakizashi"
                    }
                    else if(i==5||i==7){//le prefixe est demoniaque ou un damné
                        if(j==1||j==2||j==5||j==6||j==8){qualite+=1;}//c'est un "Hache", "Kama","Poing Américain","Poing des Cieux", "Wakizashi"
                        qualite+=base+3;
                    }
                }
            }
            break;
        case 6: //Arme à deux mains
            if(k==7||k==13||k==9){//suffixe
                qualite+=base;
                if((j==4||j==6||j==9)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un "morg", "Katana","tronconneuse"
            }
            if(k==10&&k==1){//suffixe ameliorer
                qualite+=base+1;
                if((j==4||j==6||j==9)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un "morg", "Katana","tronconneuse"
            }
            if(k==17){//moyenne de l'agi
                qualite+=base+2;
                if((j==4||j==6||j==9)&&(i==typeObject["objet"][m] ["Préfixe"].length)){qualite+=1;}//c'est un "morg", "Katana","tronconneuse"
            }

            if(i!=typeObject["objet"][m] ["Préfixe"].length){//a un prefixe

                if(i==0||i==1){//le prefixe est un set
                    qualite+=base+1;
                    if(j==4||j==6||j==9){qualite+=1;}//c'est un "morg", "Katana","tronconneuse"
                }
                else if(i==4||i==7){//le prefixe est demoniaque ou un damné
                    if(j==4||j==6||j==9){qualite+=1;}//c'est un "morg", "Katana","tronconneuse"
                    qualite+=base+3;
                }
            }
            break;
        case 7: //Arme à feu à une main
            if(j==0||j==4||j==5){qualite+=base+5;}//c'est un "morg", "Katana","tronconneuse"
            break;
        case 8: //Arme à feu à deux mains
            if(j==4||j==6||j==2){qualite+=base+5;}//c'est un "morg", "Katana","tronconneuse"
            break;
        case 9: //arme à distance à deux mains
            if(j==4||j==9||j==7){qualite+=base+2;}//c'est un pilum", "arc reflex","javelot"
            else  if(j==0||j==8){qualite+=base+3;}
            //Arme à distance à deux mains
            if(k==0||k==1){//suffixe
                qualite+=base+1;
            }
            if(k==6){//dryade
                qualite+=base+2;
            }
            if(k==2||k==7){//reaction ou du loup
                qualite+=base+3;
            }
            break;
    }
    return qualite;
}

function enregistrerDrops(){
    var content = document.getElementById("content-mid");
    var itemsDropped = content.getElementsByClassName("item-caption");
    var best_eval=0;
    if(itemsDropped.length!=0){
        for(i=0;i<itemsDropped.length;i++){
            val=evalObject(itemsDropped[i].innerHTML);
            //evalObject(itemsDropped[i].innerHTML);
            if(best_eval<val){
                best_eval=val;
            }
            if(val>3)
            {
                itemsDropped[i].style.color="red";
            }
        }
        if(best_eval>0){
            if(GM_getValue(location.origin + "nbDropsSup",0)<best_eval)
                GM_setValue(location.origin + "nbDropsSup",best_eval);

        }
        GM_setValue(location.hostname + "drops_rapports",content.innerHTML+GM_getValue(location.hostname + "drops_rapports", "") );
        GM_setValue(location.origin + "nbDrops", parseInt(GM_getValue(location.origin + "nbDrops",0))+1);
    }
    return best_eval;
}

function testDrops(){
    var content = document.getElementById("content-mid");
    var msg_content=content.getElementsByClassName("msg-content")[0];
    var itemsDropped =  msg_content.getElementsByClassName("item-caption");
    for(i=0;i<itemsDropped.length;i++){
        if((itemsDropped[i].innerHTML.indexOf("Légendaire Parfait")!=-1)||(itemsDropped[i].innerHTML.indexOf("Epique")!=-1)){

            alert(itemsDropped[i].style.color="red");
        }
    }
}

function supprimerMessageRapportQuete(){
    if(evitePause()){
        var content = document.getElementById("content-mid");
        var divTopOptions = getChildAttr(content, "DIV", Array("class"), Array("top-options"));
        if (divTopOptions != null) {
            var divCenter = getChildAttr(content, "DIV", Array("align"), Array("center"));
            var span = getChild(divCenter, "SPAN");
            var deleteMsg = span.childNodes[3];
            if (deleteMsg != null) {
                setChangementPageAutomatique();
                window.location.href = deleteMsg.href;
                return;
            }
        }
        window.location.href = '/?a=quest';
    }
    else{
        setTimeout(supprimerMessageRapportQuete,Math.ceil(1500*Math.random() + 9000)+timeoutbase);
    }
}

function supprimerPremierObjet(){
    if(evitePause()){
        var tablette = document.getElementById('hc_c1');
        var div = getChild(tablette, "DIV");
        var table = getChild(div, "TABLE");
        var tbody = getChild(table, "TBODY");
        var tr = getChild(tbody, "TR");
        var td = getChild(tr, "TD");
        var itemDiv = getChild(td, "DIV");
        if (itemDiv != null) {
            setChangementPageAutomatique();
            document.location = ('https://' + location.hostname + '/?a=equip&sell=' + itemDiv.id.substr(5));
        }
    }else   {
        setTimeout(supprimerPremierObjet,Math.ceil(1500*Math.random() + 9000)+timeoutbase);
    }
}
function aUnTalisman(){
    var talis=parseInt(GM_getValue(location.origin + getNameJoueur() + "talisman_restuff", 0));
    if(talis){
        setTimeout(pageTalisman, Math.ceil(Math.random() * 2000)+1000);
    }
    else{
        stopBOT();
    }
}

function runBot(){
    var divMain = getChildAttr(document.body, "DIV", Array("class"), Array("main"));
    var subDiv = getChild(divMain, "DIV");
    var divVersion = getChildAttr(subDiv, "DIV", Array("class"), Array("version"));
    var versionNode = getChild(divVersion, "A");

    if ((versionNode.childNodes[1].nodeName == "B" && versionNode.childNodes[1].childNodes[0].nodeValue != strings[sVersionBw]) || (versionNode.childNodes.length >= 3 && versionNode.childNodes[2].nodeName == "B" && versionNode.childNodes[2].childNodes[0].nodeValue != strings[sVersionBw])) {
        var answer = confirm(strings[sUpdateRequired]);
        if (answer) {
            window.location.href = "http://userscripts.org/scripts/show/56853";
        }
        return;
    }
    if (premiereUtilisation()) {
        var answer = confirm(strings[sFirstUsage]);
        if (!answer) {
            stopBOT();
            return;
        }
    }
    var changementPageAutomatique = estChangementPageAutomatique();
    setChangementPageAutomatiqueEffectue();

    //GM_log("/************************"+changementPageAutomatique+"***********************************/");
    if (estSurPageLancementQuete()) {
        // Si on est sur la page de lancement de quête
        saveNbQuetes();
        if (estSurPageProgressionQuete()) {
            // Si on est sur la page de progression d'une quête
            attendreFinDeLaQuete();
        } else if (getNbQuetesRestantes() > 0){
            var index=parseInt(getCurrentIndexQuestToDo());
            var nbQuestMustDone=parseInt(getNbQuestsToDo(""+index));
            var nbQuestDone=parseInt(getCurrentNbQuestDone());

            if (!isArgentAssezPourQuete()){
                allerPageMagasin();
            } else if(objetQuetesExiste(index)&&!ObjetEstAcheter()){/********************************************************************/
                allerPageMagasin();
            }else if (estQuetePreteALancer()) {
                if(nbQuestDone==nbQuestMustDone){
                    if(index<2){
                        index++;
                        setCurrentIndexQuestToDo(""+index);
                        nbQuestMustDone=getNbQuestsToDo(""+index);
                        nbQuestDone=0;
                        GM_setValue(location.hostname + "CurrentNbQuestDone",""+0);
                        runBot();
                    }
                    else{
                        if(destuffActif()){
                            setTimeout(mettreStuffDef, Math.ceil(1500*Math.random() + timeoutbase));
                        }
                        else{
                            aUnTalisman();
                        }
                    }
                }else{
                    if(parseInt(getQuestIndex())!=index){
                        GM_setValue(location.hostname + "questIndex",""+index);
                        GM_setValue(location.hostname + "questDiff","questDiff_"+index);
                    }
                    var targetQuest = document.getElementById("questDiff_"+index);
                    var picture=document.getElementById("quest_sel_pic_"+index);
                    if(picture.className=="hidden"){//selection of the quest type
                        targetQuest.click();
                    }
                    ObjetAcheter("false");
                    setChangementPageAutomatiqueEffectue();
                    // LOG //
                    // recup tps quete
                    //if(getLevel()>=30){
                    //  var timequest = document.getElementById('totalTime').innerHTML;
                    // questLog(timequest);
                    //}
                    // FIN LOG //
                    window.location.href="javascript: void(selectQuest("+getQuestIndex()+"))";
                    setTimeout(launchQuestForReal, Math.ceil(1500*Math.random() + timeoutbase));
                }
            } else{
                aUnTalisman();
            }
        } else {
            if(destuffActif()){
                setTimeout(mettreStuffDef, Math.ceil(1500*Math.random() + timeoutbase));
            }
            else{//redirection vers les talismans
                aUnTalisman();
            }
        }
    } else if (changementPageAutomatique) {
        //GM_log("************************************ici************************************************")
        if(estSurPageMagasin()){
            if (isArgentAssezPourQuete()) {
                setTimeout(allerPageQuetes, Math.ceil(1500*Math.random() + timeoutbase));
            } else {
                var fieldSet=document.getElementsByClassName("equip")[0];
                var B=fieldSet.getElementsByTagName("B")[0];
                if(parseInt(B.innerHTML)!=0){
                    vendreFerraille();////////////////////////////////////////////////////////////////////////// ajouter verif que ferraille existe
                }
                else{
                    var talis=parseInt(GM_getValue(location.origin + getNameJoueur() + "talisman_restuff", 0));
                    if(destuffActif()){
                        if(talis){
                            declencheMettreTalisman('true');
                        }
                        rendStuffClan();
                    }
                    else{
                        aUnTalisman();
                    }
                }
            }
            if(!ObjetEstAcheter()){
                setChangementPageAutomatique();
                acheterObjet();
            }
            else{

                setTimeout(allerPageQuetes, Math.ceil(Math.random() * 1000)+timeoutbase+500);
            }
        }
        /*if (estSurPageArmurerie()) {
            if (isArgentAssezPourQuete()) {
					allerPageQuetes();
            } else {//vends un objet en ac
                // Si on est sur la page de l'armurerie
                var tablette = document.getElementById('hc_c1');

               if (tablette != null) {
                   // setTimeout(supprimerPremierObjet, Math.ceil(2500 * Math.random() + 1000));

                } else {
                    GM_setValue(location.hostname + "NbQuetesRestantes",0);
                    setTimeout(mettreStuffDef, Math.ceil(1500*Math.random() + 1000));
                }

            }
        } else */ if (estSurPageRapportQuete()) {
            // Si on est dans le message de résultat d'une quête

            nbQuestDone=GM_getValue(location.hostname + "CurrentNbQuestDone");
            nbQuestDone++
            GM_setValue(location.hostname + "CurrentNbQuestDone",""+nbQuestDone);

            if(enregistrerDrops()<7){
                setTimeout(supprimerMessageRapportQuete, Math.ceil(2500*Math.random() + timeoutbase));
            }
            else{
                setTimeout(allerPageQuetes, Math.ceil(1500*Math.random() + timeoutbase));
            }
        } else if (estSurPageMessages()) {
            // Si on est sur la page des messages
            setTimeout(allerPageQuetes, Math.ceil(1500*Math.random() + timeoutbase));
        }
    }
    else{
        if (estSurPageArmurerie()) {
            if(doitRestuff()){
                var test=GM_getValue(location.hostname + "ens");
                var script=document.body.getElementsByTagName("script")[0].innerHTML;
                var len=script.length;
                script=script.substring(17,len-2);
                restufToiDesact();
                // stopBOT();
                document.location = ('https://' + location.hostname + '?a=equip&eqset='+test+'&akey='+script);
            }
            else{
                var index=parseInt(getCurrentIndexQuestToDo());
                var nbQuestMustDone=parseInt(getNbQuestsToDo(""+index));
                var nbQuestDone=parseInt(getCurrentNbQuestDone());
                var talis=parseInt(GM_getValue(location.origin + getNameJoueur() + "talisman_restuff", 0));
                if((nbQuestMustDone==nbQuestDone)||pluDeQuete()){
                    if(destuffActif()){
                        if(talis){
                            declencheMettreTalisman('true');
                        }
                        rendStuffClan();
                    }else{
                        aUnTalisman();
                    }
                }

            }

        }
        else if(estSurPageTalisman()){
            var script=document.body.getElementsByTagName("script")[0].innerHTML;
            var len=script.length;
            var talis=0;
            talis=GM_getValue(location.origin + getNameJoueur() + "talisman_restuff", 0);
            script=script.substring(17,len-2);
            declencheMettreTalisman("false");
            stopBOT();
            if(talis!=0){
                document.location = (location.origin + '?a=talizman&do=main&equipSet='+talis+'&akey='+script);
            }
        }
    }
}

// ------------------------------------------------------------------------------------------------
// ======================================== VIP FUNC ==============================================
// ------------------------------------------------------------------------------------------------
function chooseRace(){
    var racetmp = prompt(strings[sChooseYourRace] + ' \r\n1=>'+strings[sCapteur]+'\r\n2=>'+strings[sCultiste]+'\r\n3=>'+strings[sSeigneur]+'\r\n4=>'+strings[sAbsorbeur]+'\r\n5=>'+strings[sDamne]+'', '');
    GM_setValue(location.hostname + "race", racetmp);

    if(racetmp == 1){
        var CHARISME = prompt(strings[sNbOfArk] + ' ' + strings[sCharisme], 0);
        var REPUTATION = prompt(strings[sNbOfArk] + ' ' + strings[sReputation], 0);
        GM_setValue(location.hostname + "ark_1", CHARISME);
        GM_setValue(location.hostname + "ark_2", REPUTATION);

        GM_setValue(location.hostname + "ark1", sCharisme);
        GM_setValue(location.hostname + "ark2", sReputation);
    }
    if(racetmp == 2){
        var AGILITE = prompt(strings[sNbOfArk] + ' ' + strings[sAgilite], 0);
        GM_setValue(location.hostname + "ark_1", AGILITE);
        GM_setValue(location.hostname + "ark_2", 0);

        GM_setValue(location.hostname + "ark1", sAgilite);
        GM_setValue(location.hostname + "ark2", 0);
    }
    if(racetmp == 3){
        var FORCE = prompt(strings[sNbOfArk] + ' ' + strings[sForce], 0);
        var RESISTANCE = prompt(strings[sNbOfArk] + ' ' + strings[sResistance], 0);
        GM_setValue(location.hostname + "ark_1", FORCE);
        GM_setValue(location.hostname + "ark_2", RESISTANCE);

        GM_setValue(location.hostname + "ark1", sForce);
        GM_setValue(location.hostname + "ark2", sResistance);
    }
    if(racetmp == 4){
        var CHANCE = prompt(strings[sNbOfArk] + ' ' + strings[sChance], 0);
        GM_setValue(location.hostname + "ark_1", CHANCE);
        GM_setValue(location.hostname + "ark_2", 0);

        GM_setValue(location.hostname + "ark1", sChance);
        GM_setValue(location.hostname + "ark2", 0);
    }
    if(racetmp == 5){
        var PERCEPTION = prompt(strings[sNbOfArk] + ' ' + strings[sPerception], 0);
        GM_setValue(location.hostname + "ark_1", PERCEPTION);
        GM_setValue(location.hostname + "ark_2", 0);

        GM_setValue(location.hostname + "ark1", sPerception);
        GM_setValue(location.hostname + "ark2", 0);
    }
    if(racetmp<=5&&racetmp>0){
        GM_setValue(location.hostname + "verifCout",1);
        if(estSurPageLancementQuete()){
            location.reload();
        }
    }
}

function estCourtePause(){
    return  document.getElementsByClassName("komunikat").length!=0;
}


function activeDestuff(){
    GM_setValue(location.hostname + "destuffActif", "true");
}
/****************************************************Talisman*********************************************************************/
function doitMettreTalisman(){
    return GM_getValue(location.origin+getNameJoueur() + "MettreTalisman") == "true";
}
function declencheMettreTalisman(param){
    GM_setValue(location.origin+getNameJoueur() + "MettreTalisman", ""+param);
}
/**********************************************************************************************************************************/
function desactiveDestuff(){
    GM_setValue(location.hostname + "destuffActif", "false");
}

function destuffActif(){
    return GM_getValue(location.hostname + "destuffActif", "false") == "true";
}

function restufToi(){
    GM_setValue(location.hostname + "restufToi", "true");
}

function restufToiDesact(){
    GM_setValue(location.hostname + "restufToi", "false");
}

function doitRestuff(){
    return GM_getValue(location.hostname + "restufToi") == "true";
}

//mettre stuff defense
function mettreStuffDef(){
    if(evitePause()){
        restufToi();
        setTimeout("window.location.href = '/?a=equip';",Math.ceil(1500*Math.random() + timeoutbase));
    }
    else{
        setTimeout(mettreStuffDef,Math.ceil(1500*Math.random() + timeoutbase));
    }
}

function aElementsAc(){
    return GM_getValue(location.hostname + "optionDestuff") ==1;
}

//rend le stuff emprunter au clan
function rendStuffClan(){
    var div = document.getElementById('hc_c20');
    var remettre=false;
    remettre=((div!=null)||remettre);
    if(remettre){
        div.childNodes[1].click();
    }
    if(aElementsAc()){
        var tablette = document.getElementById('hc_c8');
        var  div = getChild(tablette, "DIV");
        var table = getChild(div, "TABLE");
        var tbody = getChild(table, "TBODY");
        var tr = getChild(tbody, "TR");
        var td = getChild(tr, "TD");
        var itemDiv = getChild(td, "DIV");
        if (itemDiv != null) {
            tablette.childNodes[3].click();
        }
        remettre=((itemDiv!=null)||remettre)
    }
    if(remettre)
        document.getElementsByName("armoryPutIn")[0].click();
    if(doitMettreTalisman()){
        setTimeout(pageTalisman, Math.ceil(Math.random() * 1000)+2000+timeoutbase);
    }
    else stopBOT();
}
/*
//replace le stuff preté au clan (placé en etagere 9)
function replaceStuffPrete(){
    if(evitePause()){
        var tablette = document.getElementById('hc_c8');
        var div = getChild(tablette, "DIV");
        var table = getChild(div, "TABLE");
        var tbody = getChild(table, "TBODY");
        var tr = getChild(tbody, "TR");
        var td = getChild(tr, "TD");
        var itemDiv = getChild(td, "DIV");

        if (itemDiv != null) {
			GM_log("**************effectue lereplacage a la 'ac************")
            tablette.childNodes[3].click();
            document.getElementsByName("armoryPutIn")[0].click();
        }
        stopBOT();
    }
    else{
        setTimeout(replaceStuffPrete,Math.ceil(1500*Math.random() + 10000));
    }
}
*/
function paramStuff(){
    var option = -1;
    var test = 1;
    // Le joueur choisi son stuff a replacer apres ses quetes
    var test = prompt(strings[sParamStuff1],0);
    if(test>0&& test<=20){
        GM_setValue(location.hostname + "ens", test);
    }else {
        GM_setValue(location.hostname + "ens", 1);
    }

    // A t'on du stuff perso a remettre a l'AC
    option = prompt(strings[sParamStuff2],0);
    if(option!=1 && option!=0){
        option = 0;
    }
    GM_setValue(location.hostname + "optionDestuff",option);

    // on active le destuffage et on sécurise l'armurerie
    activeDestuff();
}
// ------------------------------------------------------------------------------------------------
// ======================================== OBJET QUETES ==========================================
// ------------------------------------------------------------------------------------------------
function EnregistrerObjetQuetes(objet,index){
    GM_setValue(location.hostname + "ObjetQuette"+index,objet);
}
function objetQuetesExiste(index){
    return GM_getValue(location.hostname + "ObjetQuette"+index,"")!="";
}
function ObjetAcheter(bool){
    return GM_setValue(location.hostname + "Objetacheté",bool);
}
function ObjetEstAcheter(){
    return GM_getValue(location.hostname + "Objetacheté","false")=="true";
}
function ObjetQuetes(index){
    return GM_getValue(location.hostname + "ObjetQuette"+index,"");
}
function vendreFerraille(){
    setChangementPageAutomatique();
    var fieldSet=document.getElementsByClassName("equip")[0];
    var a=fieldSet.getElementsByClassName("sellItem")[0];
    a.click();
}

function acheterObjet(){
    var div,fieldSet,legend,itemName,buyLinkEnable,buyLinkDisable;
    var i,j,lg,lg2;
    var trouve=false;
    var index,objet;

    div=document.getElementById("content-mid");
    fieldSet=div.getElementsByTagName("fieldset");
    lg=fieldSet.length;
    index=parseInt(getCurrentIndexQuestToDo());
    objet=ObjetQuetes(index);
    i=0;

    while(i<lg&&!trouve)//looking for the field of the object with one use
    {
        j=0;
        legend=fieldSet[i].getElementsByClassName("eqtypehdr");

        lg2=legend.length;

        while(j<lg2&&legend[j].innerHTML!="OBJETS A USAGE UNIQUE"){
            j++;
        }
        trouve=(j!=lg2);
        i++;
    }
    if(trouve){//looking for the object
        j=0;
        itemName=fieldSet[i-1].getElementsByClassName("item-link");
        buyLinkEnable=fieldSet[i-1].getElementsByClassName("enabled");
        lg2=itemName.length;
        while(j<lg2&&itemName[j].innerHTML!=objet){

            j++;
        }
        if(j!=lg2){

            if(buyLinkEnable.length>j){
                ObjetAcheter("true");
                buyLinkEnable[j].click();
            }
            else{
                vendreFerraille();
            }
        }
    }
}

function ElementUsageUnique(){
    var div,fieldSet,legend,itemLink,tmp;
    var i,j,lg,lg2;
    var trouve=false;
    div=document.getElementById("content-mid");
    fieldSet=div.getElementsByTagName("fieldset");
    lg=fieldSet.length;

    i=0;
    while(i<lg&&!trouve)//looking for the field object with one use
    {
        j=0;
        legend=fieldSet[i].getElementsByClassName("eqtypehdr");
        lg2=legend.length;
        while(j<lg2&&legend[j].innerHTML!="OBJETS A USAGE UNIQUE"){
            j++;
        }
        trouve=(j!=lg2);
        i++;
    }
    if(trouve){//looking for the object
        j=0;
        itemLink=fieldSet[i-1].getElementsByClassName("item-link");
        lg2=itemLink.length;
        GM_setValue(location.hostname + "NBOBJUNIQUE", lg2);
        while(j<lg2){
            //tmp[i]=itemLink[j].innerHTML;
            GM_setValue(location.hostname + "OBJUNIQUE_"+j, itemLink[j].innerHTML);
            j++;
        }
    }
}

/****************************************************************************************************************************/

function saveNbQuetes(){
    GM_setValue(location.hostname + "NbQuetesRestantes",getNbQuetesRestantes());
}

function pluDeQuete(){
    return GM_getValue(location.hostname + "NbQuetesRestantes")==0;
}

function activStuff(){
    var test = prompt(strings[sActivStuff1],0);
    if (test !=1){
        desactiveDestuff();
    }else {
        activeDestuff();
    }
}

function affRace(){
    var text = "\r\n" + strings[raceName[GM_getValue(location.hostname + "race")]] + "\r\n";
    text += strings[GM_getValue(location.hostname + "ark1")] + " : " + GM_getValue(location.hostname + "ark_1") + "\r\n";
    if(GM_getValue(location.hostname + "ark2") !=0) { text += strings[GM_getValue(location.hostname + "ark2")] + " : " + GM_getValue(location.hostname + "ark_2"); }
    return text;
}

function evitePause(){
    var tempServeur=document.getElementById('servertime').innerHTML;
    //debut d'heure paire
    if(parseInt(tempServeur.substring(0,2))%2==0){
        if(parseInt(tempServeur.substring(3,5))==0){
            if(parseInt(tempServeur.substring(6,8))<15){
                return false;
            }
        }
    }
    //fin d'heure impaire
    if(parseInt(tempServeur.substring(0,2))%2==1){
        if(parseInt(tempServeur.substring(3,5))==59){
            if(parseInt(tempServeur.substring(6,8))>57){
                return false;
            }
        }
    }
    return true;
}

function ptSang(){
    return  parseInt(document.getElementById('bloodd').innerHTML);
}

function coutArc(ark){
    var arcaneBorder=document.getElementsByClassName("arcane-border")[0];
    var code=arcaneBorder.innerHTML;
    var ind=code.indexOf("addArc(1, "+ark,0);
    var ind2=code.indexOf(")",ind);
    return parseInt(code.substring(ind+11+ark.length,ind2));
}

function verifCout(race){
    var arcV1;
    var arcV2;
    var cout1;
    var cout2;
    var pt;
    var i;
    var cout;
    var id1;
    var id2;
    if(race==1||race==3){
        if(race==1){
            id1="1";
            id2="2";
        }
        else{
            id1="3";
            id2="4";
        }

        arcV1=parseInt(GM_getValue(location.hostname + "ark_1"));
        arcV2=parseInt(GM_getValue(location.hostname + "ark_2"));
        cout1=coutArc(id1);
        cout2=coutArc(id2);
        pt=ptSang();

        if(pt-arcV1*cout1>=0){
            pt-=arcV1*cout1;
            i=arcV2;
            cout=i*cout2;

            while((pt-cout)<0){
                cout-=cout2;
                i--;
            }
            GM_setValue(location.hostname + "ark_2",i);
        }
        else{
            i=arcV1;
            cout=i*cout1;

            while((pt-cout)<0){
                cout-=cout1;
                i--;
            }
            GM_setValue(location.hostname + "ark_1",i);
            pt-=i*cout1;
            i=arcV2;
            cout=i*cout2;
            while((pt-cout)<0){
                cout-=cout2;
                i--;
            }
            GM_setValue(location.hostname + "ark_2",i);
        }
    }
    else{
        if(race==2){
            id1="6";
        }
        else if(race==4){
            id1="12";
        }
        else if(race==5){
            id1="13";
        }

        arcV1=parseInt(GM_getValue(location.hostname + "ark_1"));
        cout1=coutArc(id1);

        pt=ptSang();
        if(pt-arcV1*cout1<0){
            i=arcV1;
            cout=i*cout1;
            while((pt-cout)<0){
                cout-=cout1;
                i--;
            }
            GM_setValue(location.hostname + "ark_1",i);
        }
    }
}

// ------------------------------------------------------------------------------------------------
// ======================================== AFFICHAGE =============================================
// ------------------------------------------------------------------------------------------------
function ensSave(){
    var set = 1;
    for(set=1; set<21; set++){ GM_setValue(location.hostname + "ENS_"+set, ""); }
    var i=0;
    var combobox=document.getElementsByClassName("combobox");
    while(i<combobox.length&&combobox[i].name!="itemSetNr"){
        i++;
    }
    var data    = document.getElementsByClassName("combobox")[i];
    var ens_1=data.getElementsByTagName("OPTION");
    for (i=0;i<ens_1.length;i++){
        if(ens_1[i].innerHTML.indexOf("(néant)") == -1){
            GM_setValue(location.hostname + "ENS_"+i, ens_1[i].innerHTML);
        }
    }
}

function talismanSave(){
    var set = 1;
    for(set=1; set<11; set++){ GM_setValue(location.hostname + "TALISMAN_"+set, ""); }
    var i=0;
    var combobox=document.getElementsByClassName("combobox");
    while(i<combobox.length&&combobox[i].name!="setNr"){
        i++;
    }
    var data    = document.getElementsByClassName("combobox")[i];
    var ens_1=data.getElementsByTagName("OPTION");
    for (i=0;i<ens_1.length;i++){
        if(ens_1[i].innerHTML.indexOf("(néant)") == -1){
            GM_setValue(location.hostname + "TALISMAN_"+i, ens_1[i].innerHTML);
        }
    }
}

function testEns(data){
    var out = data;
    if(GM_getValue(location.hostname + "ENS_"+data) != null){
        out = GM_getValue(location.hostname + "ENS_"+data);
    }
    return out;
}

function raceOptions(){
    var opt = '';
    var racetmp = GM_getValue(location.hostname + "race");
    for(i=1; i<=5; i++){
        if(i==racetmp){
            opt += '<option value="'+i+'" selected>'+strings[raceName[i]]+'</option>'
        }else{
            opt += '<option value="'+i+'">'+strings[raceName[i]]+'</option>'
        }
    }
    return opt;
}

function arcanes(){
    var opt = '';
    var racetmp = GM_getValue(location.hostname + "race");
    var ark1 = GM_getValue(location.hostname + "ark_1");
    var ark2 = GM_getValue(location.hostname + "ark_2");
    var ark3 = GM_getValue(location.hostname + "ark_3");

    if(racetmp == 4){
        document.getElementById('ark3_tr').style.visibility = "visible";
    }else{
        document.getElementById('ark3_tr').style.visibility = "hidden";
    }

    if(racetmp == 1){
        document.getElementById('ark1_tr').style.visibility = "visible";
        document.getElementById('ark2_tr').style.visibility = "visible";
        document.getElementById('ark1_txt').innerHTML   = '- '+strings[sCharisme];
        document.getElementById('ark2_txt').innerHTML   = '- '+strings[sReputation];
        document.getElementById('ark1').value       = ark1;
        document.getElementById('ark2').value       = ark2;
    }
    if(racetmp == 2){
        document.getElementById('ark1_tr').style.visibility = "hidden";
        document.getElementById('ark2_tr').style.visibility = "visible";
        document.getElementById('ark2_txt').innerHTML   = '- '+strings[sAgilite];
        document.getElementById('ark2').value       = ark2;
    }
    if(racetmp == 3){
        document.getElementById('ark1_tr').style.visibility = "visible";
        document.getElementById('ark2_tr').style.visibility = "visible";
        document.getElementById('ark1_txt').innerHTML   = '- '+strings[sForce];
        document.getElementById('ark2_txt').innerHTML   = '- '+strings[sResistance];
        document.getElementById('ark1').value       = ark1;
        document.getElementById('ark2').value       = ark2;

    }
    if(racetmp == 4){
        document.getElementById('ark1_tr').style.visibility = "hidden";
        document.getElementById('ark2_tr').style.visibility = "hidden";
        document.getElementById('ark3_txt').innerHTML   = '- '+strings[sChance];
        document.getElementById('ark3').value       = ark3;
    }
    if(racetmp == 5){
        document.getElementById('ark1_tr').style.visibility = "visible";
        document.getElementById('ark2_tr').style.visibility = "hidden";
        document.getElementById('ark1_txt').innerHTML   = '- '+strings[sPerception];
        document.getElementById('ark1').value       = ark1;
    }
}

function testEns(data){
    var out = data;
    if(GM_getValue(location.hostname + "ENS_"+data) != null){
        out = GM_getValue(location.hostname + "ENS_"+data);
    }
    return out;
}

function testTalisman(data){
    var out = data;
    if(GM_getValue(location.hostname + "TALISMAN_"+data) != null){
        out = GM_getValue(location.hostname + "TALISMAN_"+data);
    }
    return out;
}

function stuffOptions(){
    var opt = '';
    var stufftmp = GM_getValue(location.hostname + "ens");
    for(i=1; i<=20; i++){
        if(GM_getValue(location.hostname + "ENS_"+i)!=""){
            if(i==stufftmp){
                opt += '<option value="'+i+'" selected>'+testEns(i)+'</option>'
            }else{
                opt += '<option value="'+i+'">'+testEns(i)+'</option>'
            }
        }
    }
    return opt;
}

function talismanOptions(){
    var opt = '<option value="0">Aucun</option>';
    var stufftmp = GM_getValue(location.origin + getNameJoueur() + "talisman_restuff", 0);
    for(i=1; i<=10; i++){
        if(GM_getValue(location.hostname + "TALISMAN_"+i)!=""){
            if(i==stufftmp){
                opt += '<option value="'+i+'" selected>'+testTalisman(i)+'</option>'
            }else{
                opt += '<option value="'+i+'">'+testTalisman(i)+'</option>'
            }
        }
    }
    return opt;
}

function checkboxStuff(vartmp){
    if(vartmp == 1){ return "checked"; }
}

function questOptions(){
    var opt = '';
    var questtmp = GM_getValue(location.hostname + "questIndex");
    for(i=0; i<=2; i++){
        if(i==questtmp){
            opt += '<option value="'+i+'" selected>'+strings[questName[i]]+'</option>'
        }else{
            opt += '<option value="'+i+'">'+strings[questName[i]]+'</option>'
        }
    }
    return opt;
}

function testObjUnique(data){
    var out = data;
    if(GM_getValue(location.hostname + "OBJUNIQUE_"+data) != ""){
        out = GM_getValue(location.hostname + "OBJUNIQUE_"+data);
    }
    return out;
}

function objetUniqueOptions(objtmp){
    var opt = '<option value="" selected>Aucun</option>';
    var nbobj = GM_getValue(location.hostname + "NBOBJUNIQUE");
    for(i=0; i<=nbobj-1; i++){
        if(testObjUnique(i)==objtmp){
            opt += '<option value="'+testObjUnique(i)+'" selected>'+testObjUnique(i)+'</option>'
        }else{
            opt += '<option value="'+testObjUnique(i)+'">'+testObjUnique(i)+'</option>'
        }
    }
    return opt;
}

function nbQuete(nbquest){
    var opt = '';
    for(i=0; i<=24; i++){
        if(i==nbquest){
            opt += '<option value="'+i+'" selected>'+i+'</option>';
        }else{
            opt += '<option value="'+i+'">'+i+'</option>';
        }
    }
    return opt;
}

function MajQuest(){
    GM_xmlhttpRequest({
        method: "GET",
        url: location.origin+"/?a=quest",
        headers: {
            "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
            "Accept": "text/xml"            // If not specified, browser defaults will be used.
        },
        onload: function(response) {
            var responseXML = null;
            // Inject responseXML into existing Object (only appropriate for XML content).
            if (!response.responseXML) {
                responseXML = new DOMParser()
                    .parseFromString(response.responseText, "text/xml");
            }

            var parser=new DOMParser();
            var htmlDoc=parser.parseFromString(response.responseText, "text/html");

            var content = htmlDoc.getElementById("content-mid");
            var div = getChildAttr(content, "DIV", Array("style"), Array("margin-top: 10px; margin-bottom: 20px;"));
            var span = getChild(div, "SPAN");
            var data = span.childNodes[2].nodeValue;
            var tab = data.split(" ");
            var b = getChild(span, "B");

            //Set Values
            GM_setValue(location.hostname + "nbQuetesMax", parseInt(tab[2]));
            GM_setValue(location.hostname + "NbQuetesRestantes", parseInt(b.childNodes[0].nodeValue));

            // affichage du menu
            var span= document.getElementById("menuQuest").getElementsByTagName("span");
            span[span.length-1].innerHTML = ""+parseInt(b.childNodes[0].nodeValue)+"/"+parseInt(tab[2]);
        }
    });
}

function Options(){
    var doc = document.getElementById("content-mid");
    var html = '';

    html += '<div id="opt_menu">'
        +'	<form id="botQuete" name="botQuete">'
        +'		<div style="text-align: center; font-size: 16px; font-weight: bold; width: 100%;" >Blood Wars Quest Bot - Options</div><br />'
        +'		<fieldset style="-moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 10px;">'
        +'			<legend style="text-align: center; font-size: 14px;"><b>'+strings[sChooseRace]+'</b></legend>'
        +'			<table style="width: 100%;">'
        +'				<tr>'
        +'					<td colspan="2">'
        +'						<select class="combobox i_realm" name="opt_race" id="opt_race">'
        +               			raceOptions()
        +'						</select>'
        +'					</td>'
        +'				</tr>'
        +'				<tr id="ark1_tr" style="visibility: none;">'
        +'					<td id="ark1_txt" style="width: 175px;"></td>'
        +'					<td><input id="ark1" class="inputbox" type="texte" value="" size="3" /></td>'
        +'				</tr>'
        +'				<tr id="ark2_tr" style="visibility: none;">'
        +'					<td id="ark2_txt" style="width: 175px;"></td>'
        +'					<td><input id="ark2" class="inputbox" type="texte" value="" size="3" /></td>'
        +'				</tr>'
        +'				<tr id="ark3_tr" style="visibility: none;">'
        +'					<td id="ark3_txt" style="width: 175px;"></td>'
        +'					<td><input id="ark3" class="inputbox" type="texte" value="" size="3" /></td>'
        +'				</tr>'
        +'			</table>'
        +'		</fieldset><br />'
        +'		<fieldset style="-moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 10px;">'
        +'			<legend style="text-align: center; font-size: 14px;"><b>Stuff, Talismans et AC</b></legend>'
        +'			<table style="width: 100%;">'
        +'				<tr>'
        +'					<td width="300"><b>'+strings[sParamStuff1]+'</b></td>'
        +'					<td>'
        +'						<select class="combobox i_realm" name="opt_stuff" id="opt_stuff">'
        +							stuffOptions()
        +'						</select>'
        +'					</td>'
        +'				</tr>'
        +'				<tr>'
        +'					<td width="300"><b>Talisman à replacer après les quêtes</b></td>'
        +'					<td>'
        +'						<select class="combobox i_realm" name="opt_talisman" id="opt_talisman">'
        +               			talismanOptions()
        +'						</select>'
        +'					</td>'
        +'				</tr>'
        +'				<tr id="stuffAC_tr">'
        +'					<td id="stuffAC_txt"><b>Stuff personnel à remettre en AC (Etagère 9)</b></td>'
        +'					<td><input id="stuffAC" class="inputbox" type="checkbox" value="" '+checkboxStuff(GM_getValue(location.hostname + "optionDestuff"))+' /></td>'
        +'				</tr>'
        +'			</table>'
        +'		</fieldset><br />'
        +'		<fieldset style="-moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 10px;">'
        +'			<legend style="text-align: center; font-size: 14px;"><b>Configuration des quêtes</b></legend>'
        +'			<table>'
        +'				<tr id="quete_facile">'
        +'					<td width="200"><b>Quêtes Faciles</b></td>'
        +'					<td>'
        +'						<table>'
        +'							<tr>'
        +'								<td width="200">Objet unique à ajouter</td>'
        +'								<td>'
        +'									<select class="combobox i_realm" name="opt_objetUnique_facile" id="opt_objetUnique_facile">'
        +										objetUniqueOptions(GM_getValue(location.hostname + "ObjetQuette0"))
        +'									</select>'
        +'								</td>'
        +'							</tr>'
        +'							<tr>'
        +'								<td>Nombre de quêtes à lancer</td>'
        +'								<td>'
        +'									<select class="combobox i_realm" name="opt_nbquete_facile" id="opt_nbquete_facile">'
        + 										nbQuete(getNbQuestsToDo(0))
        +'									</select>'
        +'								</td>'
        +'							</tr>'
        +'						</table>'
        +'					</td>'
        +'				</tr>'
        +'				<tr>'
        +'					<td colspan="2" align="center"><div style="height: 10px;"></div></td>'
        +'				</tr>'
        +'				<tr id="quete_moyenne">'
        +'					<td width="200"><b>Quêtes Moyennes</b></td>'
        +'					<td>'
        +'						<table>'
        +'							<tr>'
        +'								<td width="200">Objet unique à ajouter</td>'
        +'								<td>'
        +'									<select class="combobox i_realm" name="opt_objetUnique_moyenne" id="opt_objetUnique_moyenne">'
        +										objetUniqueOptions(GM_getValue(location.hostname + "ObjetQuette1"))
        +'									</select>'
        +'								</td>'
        +'							</tr>'
        +'							<tr>'
        +'								<td>Nombre de quêtes à lancer</td>'
        +'								<td>'
        +'									<select class="combobox i_realm" name="opt_nbquete_moyenne" id="opt_nbquete_moyenne">'
        + 										nbQuete(getNbQuestsToDo(1))
        +'									</select>'
        +'								</td>'
        +'							</tr>'
        +'						</table>'
        +'					</td>'
        +'				</tr>'
        +'				<tr>'
        +'					<td colspan="2" align="center"><div style="height: 10px;"></div></td>'
        +'				</tr>'
        +'				<tr id="quete_difficile">'
        +'					<td width="200"><b>Quêtes Difficiles</b></td>'
        +'					<td>'
        +'						<table>'
        +'							<tr>'
        +'								<td width="200">Objet unique à ajouter</td>'
        +'								<td>'
        +'									<select class="combobox i_realm" name="opt_objetUnique_difficile" id="opt_objetUnique_difficile">'
        +										objetUniqueOptions(GM_getValue(location.hostname + "ObjetQuette2"))
        +'									</select>'
        +'								</td>'
        +'							</tr>'
        +'							<tr>'
        +'								<td>Nombre de quêtes à lancer</td>'
        +'								<td>'
        +'									<select class="combobox i_realm" name="opt_nbquete_difficile" id="opt_nbquete_difficile">'
        + 										nbQuete(getNbQuestsToDo(2))
        +'									</select>'
        +'								</td>'
        +'							</tr>'
        +'						</table>'
        +'					</td>'
        +'				</tr>'
        +'			</table>'
        +'		</fieldset><br />'
        +'		<fieldset style="-moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 10px;">'
        +'			<table style="width: 100%;">'
        +'				<tr>'
        +'					<td align="center" style=""><input class="button" id="opt_go" type="button" value="'+strings[sUpdate]+'" /></td>'
        +'				</tr>'
        +'			</table>'
        +'		</fieldset>'
        +'	</form>'
        + '</div>';

    doc.innerHTML = html;
    arcanes();

    //mettre à jour les valeurs
    document.getElementById('opt_go').addEventListener("click",function(event){
        // Set Race
        var opt_race = document.getElementById('opt_race').value;
        GM_setValue(location.hostname + "race", opt_race);

        // Set Quest
        /*  var opt_quest = document.getElementById('opt_quest').value;
        GM_setValue(location.hostname + "questIndex", opt_quest);
        GM_setValue(location.hostname + "questDiff", "questDiff_"+opt_quest);
		*/
        // Set Arcanes
        var ARK1 = document.getElementById('ark1').value;
        var ARK2 = document.getElementById('ark2').value;
        var ARK3 = document.getElementById('ark3').value;

        GM_setValue(location.hostname + "ark1", 0);
        GM_setValue(location.hostname + "ark_1", 0);
        GM_setValue(location.hostname + "ark2", 0);
        GM_setValue(location.hostname + "ark_2", 0);
        GM_setValue(location.hostname + "ark3", 0);
        GM_setValue(location.hostname + "ark_3", 0);

        if (opt_race==4){
            ARK3 = document.getElementById('ark3').value;
        }else{
            ARK3 = 0;
        }

        if(opt_race == 1){
            GM_setValue(location.hostname + "ark_1", ARK1);
            GM_setValue(location.hostname + "ark_2", ARK2);

            GM_setValue(location.hostname + "ark1", sCharisme);
            GM_setValue(location.hostname + "ark2", sReputation);
        }
        if(opt_race == 2){
            GM_setValue(location.hostname + "ark_2", ARK2);
            GM_setValue(location.hostname + "ark2", sAgilite);
        }
        if(opt_race == 3){
            GM_setValue(location.hostname + "ark_1", ARK1);
            GM_setValue(location.hostname + "ark_2", ARK2);

            GM_setValue(location.hostname + "ark1", sForce);
            GM_setValue(location.hostname + "ark2", sResistance);
        }
        if(opt_race == 4){
            GM_setValue(location.hostname + "ark_3", ARK3);

            GM_setValue(location.hostname + "ark3", sChance);
        }
        if(opt_race == 5){
            GM_setValue(location.hostname + "ark_1", ARK1);

            GM_setValue(location.hostname + "ark1", sPerception);
        }
        if(opt_race<=5&&opt_race>0){
            GM_setValue(location.hostname + "verifCout",1);
        }

        // Set Objet Unique
        EnregistrerObjetQuetes(""+document.getElementById('opt_objetUnique_facile').value,0);
        EnregistrerObjetQuetes(""+document.getElementById('opt_objetUnique_moyenne').value,1);
        EnregistrerObjetQuetes(""+document.getElementById('opt_objetUnique_difficile').value,2);

        // Set Nombre de quêtes
        var nb0 = document.getElementById('opt_nbquete_facile').value;
        var nb1 = document.getElementById('opt_nbquete_moyenne').value;
        var nb2 = document.getElementById('opt_nbquete_difficile').value;
        GM_setValue(location.hostname + "nbQuest_"+0,""+ nb0);
        GM_setValue(location.hostname + "nbQuest_"+1,""+ nb1);
        GM_setValue(location.hostname + "nbQuest_"+2,""+ nb2);

        // Intialisation de l'index des quetes du compteur de quetes effectuées
        setCurrentIndexQuestToDo(""+0);
        GM_setValue(location.hostname + "CurrentNbQuestDone",""+0);

        // Set stuff
        var opt_stuff = document.getElementById('opt_stuff').value;
        GM_setValue(location.hostname + "ens", opt_stuff);

        // Set Talisman
        var opt_talisman = document.getElementById('opt_talisman').value;
        GM_setValue(location.origin + getNameJoueur() + "talisman_restuff", opt_talisman);

        // A t'on du stuff perso à remettre à l'AC
        var optionStuffAc = 0;
        if(document.getElementById('stuffAC').checked){
            optionStuffAc = 1;
        }
        GM_setValue(location.hostname + "optionDestuff",optionStuffAc);

        // on active le destuffage et on sécurise l'armurerie
        activeDestuff();

        // Affichage du message de mise à jour
        alert("Mise à jour des options avec succès");
        Options();
    },true);

    // import de la fonction arcanes dans la page
    document.getElementById('opt_race').addEventListener("change",function(arcanes){
        var opt = '';
        var racetmp = document.getElementById('opt_race').value;
        var ark1 = GM_getValue(location.hostname + "ark_1");
        var ark2 = GM_getValue(location.hostname + "ark_2");
        var ark3 = GM_getValue(location.hostname + "ark_3");

        if(racetmp == 4){
            document.getElementById('ark3_tr').style.visibility = "visible";
        }else{
            document.getElementById('ark3_tr').style.visibility = "hidden";
        }

        if(racetmp == 1){
            document.getElementById('ark1_tr').style.visibility = "visible";
            document.getElementById('ark2_tr').style.visibility = "visible";
            document.getElementById('ark1_txt').innerHTML   = '- '+strings[sCharisme];
            document.getElementById('ark2_txt').innerHTML   = '- '+strings[sReputation];
            document.getElementById('ark1').value       = ark1;
            document.getElementById('ark2').value       = ark2;
        }
        if(racetmp == 2){
            document.getElementById('ark1_tr').style.visibility = "hidden";
            document.getElementById('ark2_tr').style.visibility = "visible";
            document.getElementById('ark2_txt').innerHTML   = '- '+strings[sAgilite];
            document.getElementById('ark2').value       = ark2;
        }
        if(racetmp == 3){
            document.getElementById('ark1_tr').style.visibility = "visible";
            document.getElementById('ark2_tr').style.visibility = "visible";
            document.getElementById('ark1_txt').innerHTML   = '- '+strings[sForce];
            document.getElementById('ark2_txt').innerHTML   = '- '+strings[sResistance];
            document.getElementById('ark1').value       = ark1;
            document.getElementById('ark2').value       = ark2;

        }
        if(racetmp == 4){
            document.getElementById('ark1_tr').style.visibility = "hidden";
            document.getElementById('ark2_tr').style.visibility = "hidden";
            document.getElementById('ark3_txt').innerHTML   = '- '+strings[sChance];
            document.getElementById('ark3').value       = ark3;
        }
        if(racetmp == 5){
            document.getElementById('ark1_tr').style.visibility = "visible";
            document.getElementById('ark2_tr').style.visibility = "hidden";
            document.getElementById('ark1_txt').innerHTML   = '- '+strings[sPerception];
            document.getElementById('ark1').value       = ark1;
        }
    },true);
}
function contenuDsp(){
    var index=parseInt(getCurrentIndexQuestToDo());
    var facile=GM_getValue(location.hostname + "nbQuest_"+0);
    var moyenne=GM_getValue(location.hostname + "nbQuest_"+1);
    var difficile=GM_getValue(location.hostname + "nbQuest_"+2);
    var courant=GM_getValue(location.hostname + "CurrentNbQuestDone");
    var contenu="";

    var facile2='<select class="combobox i_realm" name="opt_nbquete_f" id="opt_nbquete_f">'
        + nbQuete(getNbQuestsToDo(0))
        +'</select>';
    var moyenne2='<select class="combobox i_realm" name="opt_nbquete_m" id="opt_nbquete_m">'
        + nbQuete(getNbQuestsToDo(1))
        +'</select>';
    var difficile2='<select class="combobox i_realm" name="opt_nbquete_d" id="opt_nbquete_d">'
        + nbQuete(getNbQuestsToDo(2))
        +'</select>'
    if(isBotRunning()){
        switch(index){
            case 0:
                contenu+='Faciles : '
                    + '<span style="color: #0F0;">'+(facile-courant)+'/'+facile+'</span><br />'
                    + 'Moyennes : '
                    + moyenne+'/'+moyenne+ '<br />'
                    + 'Difficiles : '
                    + difficile+'/'+difficile+  '<br />';
                break;
            case 1:
                contenu+='Faciles : '
                    + '0'+'/'+facile+'<br />'
                    + 'Moyennes : '
                    + '<span style="color: #0F0;">'+(moyenne-courant)+'/'+moyenne+ '</span><br />'
                    + 'Difficiles : '
                    + difficile+'/'+difficile+  '<br />';
                break;
            case 2:
                contenu+='Faciles : '
                    + '0'+'/'+facile+'<br />'
                    + 'Moyennes : '
                    + '0'+'/'+moyenne+ '<br />'
                    + 'Difficiles : '
                    + '<span style="color: #0F0;">'+(difficile-courant)+'/'+difficile+  '</span><br />';
                break;
        }
    }
    else{

        contenu+="Faciles : "+
            '<span id="aff_f">'+ facile+'</span>'+"/"+facile2+"<br />"
            +"Moyennes : "+
            '<span  id="aff_m">'+ moyenne+'</span>'+"/"+moyenne2+ "<br />"
            +"Difficiles : "+
            '<span id="aff_d">'+  difficile+'</span>'+"/"+difficile2+  "<br />" ;




    }
    return contenu+'<div id="objU"></div>';
}
// MENU LEFT
function dspMenuQuest(){

    var css=GM_getValue(location.hostname + "menuQuestCss","mqhide");
    var questSucced=GM_getValue(location.origin + "nbDrops",0);


    var contenu=contenuDsp();
    var menuQuestOld = '<div id="dspquest"><div class="action-caption" style="text-align: center; font-weight: bold; padding: 5px; font-size: 8pt;">BW Quest Bot</div>'
        + '<ul style="list-style-type: none; margin: 0; text-align: center; padding: 0;"><li class="menu"><a href="#" class="menulink" id="StartQuestBot">'+strings[sStartBot]+'</a></li>'
        + '<li class="menu"><a href="#" class="menulink" id="StopQuestBot">'+strings[sStopBot]+'</a></li>'
        + '<li class="menu"><a href="#" class="menulink" id="OptionsQuestBot">'+strings[sOptions]+'</a></li>'
        + '<li class="menu"><a href="#" class="menulink" id="ShowDrops">'+strings[sShowDrops]+'</a></li>'
        + '<li class="menu"><a href="#" class="menulink" id="ClearDrops">'+strings[sClearDrops]+'</a></li>'
        + '</ul>';

    var menuQuest = '<div id="dspquest"><div id="menucap2" class="action-caption">BW Quest Bot</div>'
        + '<div style="text-align: center; padding: 5px;">'
        + '<a href="#" id="OptionsQuestBot"><img src="http://torrentflux.teamvip.eu/DATA/oOBWOo/imgquest/options.png" title="'+strings[sOptions]+'"></a>'
        + '<a style="margin-left: 5px;" href="#" id="StopQuestBot"><img src="http://torrentflux.teamvip.eu/DATA/oOBWOo/imgquest/stop.png" title="'+strings[sStopBot]+'"></a>'
        + '<a style="margin-left: 5px;" href="#" id="StartQuestBot"><img src="http://torrentflux.teamvip.eu/DATA/oOBWOo/imgquest/demarrer.png" title="'+strings[sStartBot]+'"></a>'
        + '<a style="margin-left: 5px;  position:relative;" href="#" id="ShowDrops"><img src="http://torrentflux.teamvip.eu/DATA/oOBWOo/imgquest/aff_quete.png" title="'+strings[sShowDrops]+'"><div id="drop" class="btn-stop">'+'<span id="dropSup" class="btn-stop">'+'drop'+'</span>'+(questSucced>10?questSucced:'0'+questSucced)+'</div></img></a>'
        + '<a style="margin-left: 5px;" href="#" id="ClearDrops"><img src="http://torrentflux.teamvip.eu/DATA/oOBWOo/imgquest/del_quete.png" title="'+strings[sClearDrops]+'"></a>'
        + '</div>';
    var div='<div id="menuQuest">'
        + menuQuest
        + '<div class="action-caption" style="opacity: 0.95; " >Statut</div>'
        + '<div  class="overlibText" style="text-align: center;">'
        + strings[sBotIs] + (isBotRunning() ? '<font id =dsact size="1" style="color:#0F0; font-weight: bold;">'+ strings[sActive] :'<font size="1" style="color:red; font-weight: bold; opacity: 0.95;">'+ strings[sInactive]) + "<br />"
        + '</font>'
        + contenu
        + '<a href="#" id="RefreshQuest"><img title="Actualiser" src="http://torrentflux.teamvip.eu/DATA/oOBWOo/actualise.png" style="width: 12px; height: 12px;" /></a>&nbsp;&nbsp;Quêtes disponibles <span>' + GM_getValue(location.hostname + "NbQuetesRestantes") + '/' + GM_getValue(location.hostname + "nbQuetesMax")+'</span>'
        + '</div>'
        +'</div></div>';

    if(document.getElementById("dspquest")){
        document.getElementById("dspquest").innerHTML = "";
    }

    main=document.getElementById("sbox");
    main.innerHTML=div+main.innerHTML;
    document.getElementById('menuQuest').className=css;
    if(questSucced>0){
        document.getElementById('drop').className="btn-play";
        var supDrop=parseInt(GM_getValue(location.origin + "nbDropsSup",0));

        if(supDrop>0){

            if(supDrop>3)
            {document.getElementById('dropSup').className="btn-play";

                if(supDrop>=7&&supDrop<11){
                    document.getElementById('dropSup').innerHTML="Big Drop";
                }
                else{
                    if(supDrop>=11&&supDrop<14){
                        document.getElementById('dropSup').innerHTML="Mega Drop";
                    }
                    else{
                        if(supDrop==14)
                            document.getElementById('dropSup').innerHTML="WTF Drop";
                    }
                }
            }
        }
    }
    if(isBotRunning()){
        document.getElementById('StartQuestBot').className="btn-stop";
        document.getElementById('StopQuestBot').className="btn-play";
    }
    else{
        document.getElementById('StartQuestBot').className="btn-play";
        document.getElementById('StopQuestBot').className="btn-stop";

        document.getElementById("opt_nbquete_f").addEventListener("change",function(event){
            var nb = document.getElementById("opt_nbquete_f").value;
            GM_setValue(location.hostname + "nbQuest_0",""+ nb);
            document.getElementById("aff_f").innerHTML=nb;
            var obj= '<select class="combobox i_realm" name="opt_objetUnique" id="opt_objetUnique_f">'
                +							objetUniqueOptions(GM_getValue(location.hostname + "ObjetQuette0"))
                +						'</select>';
            document.getElementById('objU').innerHTML=obj;
            document.getElementById("opt_objetUnique_f").addEventListener("change",function(event){
                EnregistrerObjetQuetes(""+document.getElementById('opt_objetUnique_f').value,0);
                document.getElementById('objU').innerHTML="";
            }, true);

        }, true);

        document.getElementById("opt_nbquete_m").addEventListener("change",function(event){
            var nb = document.getElementById("opt_nbquete_m").value;
            GM_setValue(location.hostname + "nbQuest_1",""+ nb);
            document.getElementById("aff_m").innerHTML=nb;
            var obj= '<select class="combobox i_realm" name="opt_objetUnique" id="opt_objetUnique_m">'
                +							objetUniqueOptions(GM_getValue(location.hostname + "ObjetQuette1"))
                +						'</select>';
            document.getElementById('objU').innerHTML=obj;
            document.getElementById("opt_objetUnique_m").addEventListener("change",function(event){
                EnregistrerObjetQuetes(""+document.getElementById('opt_objetUnique_m').value,1);
                document.getElementById('objU').innerHTML="";
            }, true);

        }, true);

        document.getElementById("opt_nbquete_d").addEventListener("change",function(event){
            var nb = document.getElementById("opt_nbquete_d").value;
            GM_setValue(location.hostname + "nbQuest_2",""+ nb);
            document.getElementById("aff_d").innerHTML=nb;
            var obj= '<select class="combobox i_realm" name="opt_objetUnique" id="opt_objetUnique_d">'
                +							objetUniqueOptions(GM_getValue(location.hostname + "ObjetQuette2"))
                +						'</select>';
            document.getElementById('objU').innerHTML=obj;
            document.getElementById("opt_objetUnique_d").addEventListener("change",function(event){
                EnregistrerObjetQuetes(""+document.getElementById('opt_objetUnique_d').value,2);
                document.getElementById('objU').innerHTML="";
            }, true);

        }, true);


    }
    // Actions
    document.getElementById('RefreshQuest').addEventListener("click",function(event){
        MajQuest();
    }, true);

    document.getElementById('StartQuestBot').addEventListener("click",function(event){
        document.getElementById('StartQuestBot').className="btn-stop";
        document.getElementById('StopQuestBot').className="btn-play";
        startBOT();
    }, true);

    document.getElementById('StopQuestBot').addEventListener("click",function(event){
        document.getElementById('StartQuestBot').className="btn-play";
        document.getElementById('StopQuestBot').className="btn-stop";
        stopBOT();
    }, true);

    document.getElementById('OptionsQuestBot').addEventListener("click",function(event){
        Options();
    }, true);

    document.getElementById('ShowDrops').addEventListener("click",function(event){
        if(document.getElementById('drop').className=="btn-play"){
            GM_setValue(location.origin + "nbDrops",0);
            GM_setValue(location.origin + "nbDropsSup", 0);
        }
        showDrops();
    }, true);

    document.getElementById('ClearDrops').addEventListener("click",function(event){
        if(document.getElementById('drop').className=="btn-play"){
            GM_setValue(location.origin + "nbDrops",0);
            GM_setValue(location.origin + "nbDropsSup", 0);
        }
        clearDrops();
    }, true);

    document.getElementById("menucap2").addEventListener("click",function(event){
        if(document.getElementById('menuQuest').className=="mqvisible"){
            document.getElementById('menuQuest').className="mqhide";
            GM_setValue(location.hostname + "menuQuestCss","mqhide");
        }
        else{
            document.getElementById('menuQuest').className="mqvisible";
            GM_setValue(location.hostname + "menuQuestCss","mqvisible");
        }
    }, true);
}

function whereIam(){
    if(document.getElementsByClassName("eqhdr")[0]!=undefined && location.search.substring(0,11)!="?a=talizman"){
        // enregistrement des pré-équipements
        ensSave();
    }
    if (estSurPageMagasin()){
        var lg=GM_getValue(location.hostname + "NBOBJUNIQUE",0);
        if(lg==0)  ElementUsageUnique();
    }
    if(location.search=="?a=quest"){
        recupDataQuete();
    }
    if(location.search.substring(0,11)=="?a=talizman"){
        // enregistrement des pré-équipements
        talismanSave();
    }
}

function recupDataQuete(){
    var content = document.getElementById("content-mid");
    var div = getChildAttr(content, "DIV", Array("style"), Array("margin-top: 10px; margin-bottom: 20px;"));
    var span = getChild(div, "SPAN");
    var data = span.childNodes[2].nodeValue;
    var tab = data.split(" ");
    var b = getChild(span, "B");

    //Set Values
    GM_setValue(location.hostname + "nbQuetesMax", parseInt(tab[2]));
    GM_setValue(location.hostname + "NbQuetesRestantes", parseInt(b.childNodes[0].nodeValue));

    var span= document.getElementById("menuQuest").getElementsByTagName("span");
    span[span.length-1].innerHTML = ""+parseInt(b.childNodes[0].nodeValue)+"/"+parseInt(tab[2]);
}

function questLog(timequest){
    var idsrv = location.host.split(".")[0];
    var nbQuestLog = getNbQuetesRestantes();
    var typeQuest = (getQuestIndex() == "1" ? strings[sMedium] : (getQuestIndex() == "2" ? strings[sHard] : strings[sEasy]));
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://torrentflux.teamvip.eu/DATA/oOBWOo/questBotLog/log.php?pseudo="+getNameJoueur()+"&nbQuete="+nbQuestLog+"&serveur="+idsrv+"&tpsQuete="+timequest+"&typeQuete="+typeQuest,
        headers: {
            "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
            "Accept": "text/xml"            // If not specified, browser defaults will be used.
        }
    });
}

function Insert(){
    var head=document.getElementsByTagName("head")[0];
    //head.innerHTML+='<link rel="stylesheet" href="http://torrentflux.teamvip.eu/DATA/oOBWOo/css/menuDisp.css" type="text/css"/><br/>';
    head.innerHTML+='<link rel="stylesheet" href="https://www.svidal.fr/css/menuDisp.css" type="text/css"/><br/>';
    //  head.innerHTML+='<link rel="stylesheet" href="http://gheraibia.free.fr/css/menuDisp.css" type="text/css"/>';
}
// ------------------------------------------------------------------------------------------------
// ========================================== DEBUG ===============================================
// ------------------------------------------------------------------------------------------------
function debug(){
    // rendStuffClan();
    //  var index=parseInt(GM_getValue(location.hostname + "CurrentIndexQuest","0"));
    //GM_setValue(location.origin + "nbDrops",1);
    //  GM_setValue(location.origin + "nbDropsSup", 14);
    // GM_log(getArgent());
    //testDrops();
    /* alert(''+getZone() +' '+getQuestIndex()+' '+questCost[parseInt(2)][(getZone() - 5) * -1])*/
    //  vendreFerraille();
    // alert(evalObject("Légendaire Bonne Armure En Plate Chasseur De La Vitesse"));
    //   testeval();
}

// ------------------------------------------------------------------------------------------------
// ======================================== Commandes =============================================
// ------------------------------------------------------------------------------------------------
GM_registerMenuCommand("debugQuest", debug);

// ------------------------------------------------------------------------------------------------
// ======================================== MAIN ==================================================
// ------------------------------------------------------------------------------------------------
if (isBotRunning()) {
    runBot();
}

dspMenuQuest();
Insert();
whereIam();