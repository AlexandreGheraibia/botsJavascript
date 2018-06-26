// ==UserScript==
// @author          ΞViPΞ Team
// @name            Blood Wars Fight Bot V3.3
// @namespace       ΞViPΞ Team
// @version         2018.02.28.2
// @include         https://r1.fr.bloodwars.net/*
// @include         https://r2.fr.bloodwars.net/*
// @include         https://r4.fr.bloodwars.net/*
// @include         https://r6.fr.bloodwars.net/*
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_log
// @grant           GM_xmlhttpRequest
// @updateURL       http://torrentflux.teamvip.eu/DATA/oOBWOo/Blood_Wars_Fight_Botv3.3.user.js
// @icon            http://torrentflux.teamvip.eu/DATA/oOBWOo/attack.png
// @description     Ce script prend en charge de façon automatisée les embuscades dans blood wars.
// @require         https://raw.githubusercontent.com/eligrey/FileSaver.js/master/FileSaver.js
//allow pasting
// ==/UserScript==

var adversaire = new Array();
var PreSetAdversaire=new Array();
var Talisman=new Array();
var arcanesC=new Array(3);
var timeoutbase=1000;//1 s //temps entre les transitions
arcanesC0=new Array();
arcanesC1=new Array();
arcanesC2=new Array();
// ------------------------------------------------------------------------------------------------
// ======================================== LANG ==================================================
// ------------------------------------------------------------------------------------------------
function navigateur(){
    var ua = navigator.userAgent;
    agent = "Firefox";
    if(ua.indexOf("Chrome") != -1){
        agent = "Chrome";
    }
    return agent;
}

var raceName = new Array();
raceName[1]=1;
raceName[2]=2;
raceName[3]=3;
raceName[4]=4;
raceName[5]=5;

var sUpdate     = 0;
var sCapteur    = 1;
var sCultiste   = 2;
var sSeigneur   = 3;
var sAbsorbeur  = 4;
var sDamne      = 5;
var sChooseRace = 6;
var sParamStuff1= 7;
var sNbOfArk    = 8;
var sCharisme   = 9;
var sReputation = 10;
var sAgilite    = 11;
var sForce      = 12;
var sResistance = 13;
var sChance     = 14;
var sPerception = 15;
var sMajeste    = 16;
var sArdSang    = 17;
var sSangVie    = 18;
var sOmbreBete  = 19;
var sSilence    = 20;
var sAbsForce   = 21;
var sSouffle    = 22;
var sHorreur    = 23;
var splayerAdded= 24;
var sStartBot   = 25;
var sStopBot    = 26;
var sOptionsBot = 27;
var sTaxi       = 28;
var sFightList  = 29;
var sFightTotal = 30;
var sAdd2List   = 31;
var sDel2Total  = 32;
var sCreateList = 33;
var sDel2List   = 34;

var frenchStrings = new Array(
    "Mettre à jour les options générale",
    "Capteur d'Esprit",
    "Cultiste",
    "Seigneur des Bêtes",
    "Absorbeur",
    "Damné",
    "Choisir la Race",
    "Stuff à replacer après les attaques.",
    "Nombre d'arcane",
    "Masque d'Adonis (Charisme)",
    "Masque de Caligula (Réputation)",
    "Voies Félines (Agilité)",
    "Frénésie Sauvage (Force)",
    "Peau de Bête (Rsistance)",
    "Pouvoir du Sang (Coups Critiques)",
    "Le Chasseur de la Nuit (Perception)",
    "La Majesté (Augmente la vie)",
    "L'Ardeur du Sang (Dommages a chaques manches)",
    "Le Sang de la Vie (Regénère les points de vie)",
    "Ombre de la Bête (Une attaque en plus CAC)",
    "Silence du Sang (Annule arcanes adverse)",
    "Absorption de la Force (Reprend arcanes adverse)",
    "Le Souffle Mortel",
    "L'Horreur (Bloque l'adversaire durant la première manche)",
    "à correctement été ajouté à la liste.",
    "Démarrer le FightBot",
    "Arrêter le FightBot",
    "Options du FightBot",
    "Vitesse du Taxi",
    "Liste des adversaires",
    "Liste complète des adversaires",
    "Ajouter à la liste d'adversaires",
    "Supprimer de la liste totale",
    "Créer une nouvelle la liste d'adversaires",
    "Supprimer de la liste d'adversaires"
);
var strings = frenchStrings;


// ------------------------------------------------------------------------------------------------
// ======================================== Functions =============================================
// ------------------------------------------------------------------------------------------------

function getChildAttr(element, tagName, attributeNames, attributeValues){
    if (element == null || attributeNames.length != attributeValues.length) {
        return null;
    }
    //alert("Looking for " + tagName + " in " + element.childNodes.length + " elements.");
    for (var i = 0; i < element.childNodes.length; ++i) {
        if (tagName == null || element.childNodes[i].nodeName == tagName) {
            //alert("found " + tagName);
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
    var numbers = str.match(/(\d{1,3})/g);
    var strFormattee = "";
    for(var i = 0; i < numbers.length; ++i) {
        strFormattee = strFormattee.concat(numbers[i]);
    }
    return parseInt(strFormattee);
}

function getAssezPourFaireFerraille(){
    return getArgent()>30000;
}
function getChild(element, tagName){
    return getChildAttr(element, tagName, Array(), Array());
}

function incremIndiceCourant(){
    GM_setValue(location.origin + getNameJoueur() + "indiceCourant",GM_getValue(location.origin + getNameJoueur() + "indiceCourant", 0)+1);
}

function resetIndiceCourant(){
    GM_setValue(location.origin + getNameJoueur() + "indiceCourant", 0);
}

function getIndiceCourant(){
    return GM_getValue(location.origin + getNameJoueur() + "indiceCourant", 0);
}

function setChangementPageAutomatique(){
    GM_setValue(location.origin + getNameJoueur() + "autoNavigate", "true");
}

function setChangementPageAutomatiqueEffectue(){
    GM_setValue(location.origin + getNameJoueur() + "autoNavigate", "false");
}

function estChangementPageAutomatique(){
    return GM_getValue(location.origin + getNameJoueur() + "autoNavigate", "false") == "true";
}
function isFightBOTRunning(){
    return GM_getValue(location.origin + getNameJoueur() + "isBotFightRunning", "false") == "true";
}

function startFightBOT(){
    GM_setValue(location.origin + getNameJoueur() + "isBotFightRunning", "true");
}

function stopFightBOT(){
    resetIndiceCourant();
    declencheAttaque("false");
    restufToiDesact();
    GM_setValue(location.origin + getNameJoueur() + "isBotFightRunning", "false");
}
function estSurPageTalisman(){
    return location.search.substring(0,11)=="?a=talizman"
}
function estSurPageMagasin(){
    return document.getElementsByClassName("eqtypehdr").length != 0;
}

function estSurPageArmurerie(){
    return document.getElementById("formularz") != null;
}

function estSurPageAttaque(){
    return document.getElementsByClassName("search")!=null && document.getElementsByClassName("search").length!=0;
}

function estSurProfil(){
    return document.getElementsByClassName("profile-hdr") != null && document.getElementsByClassName("profile-hdr").length!=0;
}

function estSurArcaneAttaque(){
    var div=document.getElementsByClassName("top-options")[0];
    if(div!=null){
        a=div.getElementsByTagName("A");
        if(a!=null){
            return a.length==3 && a[1].className=="active"&&a[1].innerHTML=="ATTAQUER";
        }
    }
    return false;
}

function estSurPageProgressionAttaque(){
    return estSurPageAttaque() && document.getElementById("atkTimeLeft") != null;
}

function estSurPageMessages(){
    /* var div=document.getElementsByClassName("top-options")[0];
    var val=4;
    if(div!=null){
        a=div.getElementsByTagName("A");
        if(a!=null){
            if(navigateur()=="Chrome"||location.origin.indexOf('r1')!=-1){
                val=5;
            }
            return a.length==val && a[0].className=="active"&&a[0].innerHTML=="LISTE DES MESSAGES";
        }
    }
    return false;*/
    return location.search.substring(0,6)=="?a=msg";
}

function estSurRapportAttaque(){

    if(estSurPageMessages()){
        var div=document.getElementsByClassName("msg-content ")[0];
        if(div!=null&&div.length!=0){
            a=div.getElementsByTagName("A");
            if(a!=null){
                if(a.length!=0&&a[0].className=="clanSecOwner"){
                    return true;
                }
            }
        }
    }
    return false;
}

function entrerPseudo(ind){
    var Pseudo=adversaire[ind];
    var champ=document.getElementsByClassName("inputbox");
    var button=document.getElementsByClassName("button");
    if(champ.length!=0){
        champ[0].value=Pseudo;
        setChangementPageAutomatique();
        button[0].click();
    }
}

function replaceAdversaire(ind){
    var i=adversaire.length;
    var tmp1,tmp2;
    while(i>-1&&timeAdversaire[ind]<timeAdversaire[i]){
        i--;
    }
    if(i!=-1){
        tmp1=timeAdversaire[ind];
        tmp2=adversaire[ind];
        timeAdversaire[ind]=timeAdversaire[i];
        adversaire[ind]=adversaire[i];
        timeAdversaire[i]=tmp1;
        adversaire[i]=tmp2;
    }
}

function attaqueProfil(){
    var i;
    var j=0;
    var legAction;
    var fieldSet;
    var trouve=0;
    var a;
    var ut=false;
    var paspremium=false;
    //recherche de action dans la legende du champs de saisie
    fieldSet=document.getElementsByTagName("FIELDSET");

    if(fieldSet!=null&&fieldSet.length!=0){
        lg2=fieldSet.length;
        while(j<lg2&&!trouve){//looking for action in legend
            i=0;
            legAction=fieldSet[j].getElementsByTagName("legend");
            lg=legAction.length;
            while(i<lg&&legAction[i].innerHTML!="ACTIONS"){

                i++;
            }
            trouve=(i!=lg);
            j++;
        }

        if(trouve){//si "ACTIONS" est trouvé
            //si nav chrome et pas de span ou firefox et une span mais pas ut1 ou pas de premium , une span sur ut1
            paspremium=document.getElementsByClassName("premiumExpired")!=undefined;
            if(paspremium){
                //var test=""+document.getElementsByClassName("premiumExpired")[0].onmouseover;
                //paspremium=test.indexOf(" actif")==-1;
                paspremium = -1;
            }
            //ut=(fieldSet[j-1].getElementsByTagName("SPAN").length==0&&(location.origin.indexOf('r1')!=-1||navigateur()== "Chrome"))||(fieldSet[j-1].getElementsByTagName("SPAN").length==1&&(location.origin.indexOf('r1')==-1||(paspremium&&location.origin.indexOf('r1')!=-1)));
            ut=fieldSet[j-1].getElementsByTagName("SPAN").length==0
            if(ut){ //il n'y a pas de compt à rebourgs
                a=fieldSet[j-1].getElementsByClassName("profileLinks");
                lg=a.length;
                i=0;

                while(i<lg&&a[i].innerHTML!="ATTAQUER"){//recherche du lien d'attaque
                    i++;
                }
                if(i<lg){//on 'la trouvé
                    setChangementPageAutomatique();
                    setTimeout( window.document.location =  a[i].href,  Math.ceil(Math.random() * 2000)+timeoutbase);

                }
                else{//le joueur est bloqué ou en congé
                    incremIndiceCourant();
                    declencheAttaque("false");
                    AllerPageAttaque();     // on passe au joueur suivant
                }
            }
            else{// le joueur n'est pas attaquable
                incremIndiceCourant();
                declencheAttaque("false");
                AllerPageAttaque(); //on passe au joueur suivant
            }
        }
    }
}
/*
psec
lancer attaque si le joueur n'est pas attaquable retenir son temps
dans une variable temps, réorganiser le tableau en fonction du temps ce qui implique
de mettre un temps de base et de comparer le temps courant avec les autres de placer l'element de moins éloigner en tete de liste
donc le tableau doit etre initialisé avec le temps le plus long.
ajouter un compteur d'attaque pour ne pas attaquer plus de 2 fois le meme joueurs et l'eliminer de la liste d'attaque.
dupliquer le tableau de départ ou travailler dessus.


*/
function lanceAttaque(){

    var race=GM_getValue(location.origin + getNameJoueur() + "race");
    ind=getIndiceCourant();
    if(GM_getValue(location.origin + getNameJoueur() +"verifCout",0)==1){
        verifCout(race);
        GM_setValue(location.origin + getNameJoueur() +"verifCout",0);
    }

    //arcane
    if(race==3||race==5||race==2){
        //3eme arcane seigneur des betes
        if(race==3){
            id3="10";
        }
        else{
            if(race==2){//Cultiste
                id3="11";
            }else{
                id3="15";
            }
        }
        var arcaneBorder=document.getElementsByClassName("arcane-border")[0];
        var checkBox=document.getElementById("ark_"+id3);
        //var arkV3=GM_getValue(location.origin + getNameJoueur() + "ark_3",0);
        var arkV3=parseInt(arcanesC2[ind]);
        if(arkV3!=0){
            checkBox.click();
        }
    }
    else{//
        if(race==1){//Capteur d'esprit
            id3="9";
        }
        else if(race==4){//absorbeur
            id3="12";
        }
        if(document.getElementById("ark_"+id3)!=null)
            document.getElementById("ark_"+id3).value = parseInt(arcanesC2[ind]);
    }

    if(race==1){//cap
        document.getElementById("ark_1").value = parseInt(arcanesC0[ind]);
        document.getElementById("ark_2").value = parseInt(arcanesC1[ind]);
    }
    else if(race==2){//cultiste
        document.getElementById("ark_5").value = parseInt(arcanesC0[ind]);
        document.getElementById("ark_6").value = parseInt(arcanesC1[ind]);
    }
    else if(race==3){//seigneur
        document.getElementById("ark_3").value = parseInt(arcanesC0[ind]);
        document.getElementById("ark_4").value = parseInt(arcanesC1[ind]);
    }
    else if(race==4){//absorbeur
        document.getElementById("ark_7").value = parseInt(arcanesC0[ind]);
        document.getElementById("ark_8").value = parseInt(arcanesC1[ind]);
    }
    else if(race==5){//Damné
        document.getElementById("ark_13").value = parseInt(arcanesC0[ind]);
        document.getElementById("ark_14").value = parseInt(arcanesC1[ind]);
    }
    //evolution

    //taxi
    var argent=getArgent();
    if(parseInt(argent)<6000){
        activerVendreFerraille("true");
        allerPageMagasin();
    }else{
        var taxiCost =parseInt(document.getElementById("taxiCost"));
        var taxiDisp = document.getElementById('taxiDisp');
        if (taxiDisp) {
            var nivTaxi=GM_getValue(location.origin + getNameJoueur() + "taxi");
            document.getElementById('taxi').value = nivTaxi;
        }
        setChangementPageAutomatique();
        document.getElementById("submit").click();

    }
}

function ptSang(){
    return parseInt(document.getElementById('bloodd').innerHTML);
}

function coutArc(ark){
    var valeurs = new Array(20, // ce 1
        20, // ce 2
        13, // sb 3
        20, // sb 4
        20, // cult 5
        15, // cult 6
        15, // abs 7
        30, // abs 8
        50, // ce 9
        225, // sb 10
        15, // cult 11
        25, // abs 12
        20, // damn 13
        40, // damn 14
        225 // damn 15
    );
    return valeurs[ark-1];
}

function coutArcSD(ark){
    var sb = 273;
    var damn = 225;
    if(ark==10){
        return sb;
    }else{
        return damn;
    }
}

function verifCout(race){
    var arkV1;
    var arkV2;
    var arkV3=0;
    var cout1;
    var cout2;
    var cout3;
    var pt;
    var i;
    var cout;
    var id1;
    var id2;
    var id3;
    ind=getIndiceCourant();
    pt=ptSang();
    arkV3=parseInt(arcanesC2[ind]);
    if(arkV3>0){//la troisieme arcane existe
        if(race==3||race==5){
            if(race==3){ //Seigneur des betes
                id3="10";
            }
            else{   //Damné
                id3="15";
            }
            arkV3=coutArcSD(id3);
        }
        else{//pour cultiste , absorbeur et capteur d'esprit;
            if(race==1){
                id3="9";
            }
            if(race==2){
                id3="11";
            }
            if(race==4){
                id3="12";
            }
            arkV3=parseInt(arcanesC2[ind]);
            cout3=coutArc(id3);
            if(pt-arkV3*cout3<0){
                i=arkV3;
                cout=i*cout3;
                while((pt-cout)<0){
                    cout-=cout3;
                    i--;
                }
                //GM_setValue(location.origin + getNameJoueur() + "ark_3",i);//////////////////////////////////////////
                arcanesC2[ind]=i;
                tabVersChaine(arcanesC2);
                arkV3=i*cout3;
            }
            else{
                arkV3=arkV3*cout3;
            }
        }

        if(arkV3<=pt){  //l'arcane est mettable
            pt=pt-arkV3;
        }
        else{
            //GM_setValue(location.origin + getNameJoueur()+ "ark_3",0);/////////////////////////////////////////////////
            arcanesC2[ind]=0;
            tabVersChaine(arcanesC2);
        }
    }

    if(race==1){//Capteur d'esprit
        id1="2";//reputation
        id2="1";//charisme
        //id3=9
    }
    if(race==2){//Cultiste
        id1="6";//voie Feline
        id2="5";//sang de la vie
        //id3=11
    }
    if(race==3){//Seigneur des betes
        id1="3";//force
        id2="4";//resistance
        //id=10
    }
    if(race==4){//absorbeur
        id1="8";//absorbtion ?
        id2="7";//bloqué?
        //id3=12
    }
    if(race==5){//damné
        id1="13";
        id2="14";
        //id3=15
    }
    if(race==5||race==3){
        arcV1=parseInt(arcanesC0[ind]);
        arcV2=parseInt(arcanesC1[ind]);
    }else{
        arcV1=parseInt(arcanesC0[ind]);
        arcV2=parseInt(arcanesC1[ind]);
    }
    cout1=coutArc(id1);
    cout2=coutArc(id2);

    if(pt-arcV1*cout1>=0){
        pt-=arcV1*cout1;
        i=arcV2;
        cout=i*cout2;

        while((pt-cout)<0){
            cout-=cout2;
            i--;
        }
        if(race==5||race==3){
            //GM_setValue(location.origin + getNameJoueur()+"ark_2",i);//////////////////////////////////////
            arcanesC1[ind]=i;
            tabVersChaine(arcanesC1);
        }else{
            //GM_setValue(location.origin + getNameJoueur()+"ark_1",i);/////////////////////////////////////
            arcanesC0[ind]=i;
            tabVersChaine(arcanesC0);
        }
    }
    else{
        i=arcV1;
        cout=i*cout1;

        while((pt-cout)<0){
            cout-=cout1;
            i--;
        }
        if(race==5||race==3){
            //GM_setValue(location.origin + getNameJoueur() +"ark_1",i);///////////////////////////////////////////
            arcanesC0[ind]=i;
            tabVersChaine(arcanesC0);
        }
        else{
            //GM_setValue(location.origin + getNameJoueur() +"ark_2",i);////////////////////////////////////////////
            arcanesC1[ind]=i;
            tabVersChaine(arcanesC1);
        }
        pt-=i*cout1;
        i=arcV2;
        cout=i*cout2;
        while((pt-cout)<0){
            cout-=cout2;
            i--;
        }
        if(race==5||race==3){
            //GM_setValue(location.origin + getNameJoueur() + "ark_2",i);///////////////////////////////////////////////
            arcanesC1[ind]=i;
            tabVersChaine(arcanesC1);
        }
        else{
            //GM_setValue(location.origin + getNameJoueur() + "ark_1",i);//////////////////////////////////////////////////
            arcanesC0[ind]=i;
            tabVersChaine(arcanesC0);
        }
    }
}

function getNbAttaquesRestantes(){
    var content = document.getElementById("content-mid");
    var div = getChildAttr(content, "DIV", Array("style"), Array("margin-top: 10px;"));
    var span = getChild(div, "SPAN");
    var b = getChild(span, "B");
    return parseInt(b.childNodes[0].nodeValue);
}

function getNbAttaquesMax(){
    var content = document.getElementById("content-mid");
    var div = getChildAttr(content, "DIV", Array("style"), Array("margin-top: 10px;"));
    var span = getChild(div, "SPAN");
    var data = span.childNodes[2].nodeValue;
    var tab = data.split(" ");
    return parseInt(tab[2]);
}

function getSecondesRestantesA(){
    var timeleft = document.getElementById("atkTimeLeft");
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

function attendreFinDeLAttaque(){
    var secondsRemaining = getSecondesRestantesA();
    if (secondsRemaining >= 0) {
        //alert("attend fin quete");
        setTimeout(attendreFinDeLAttaque, (secondsRemaining + Math.ceil(10*Math.random()) + 1) * timeoutbase);
    } else {
        var timeleft = document.getElementById("atkTimeLeft");
        if (timeleft.childNodes[0].nodeName == "A") {
            //alert("redirige vers rapport");
            setChangementPageAutomatique();
            window.location.href = timeleft.childNodes[0].href;
        }
    }
}

function pageAttaque(){
    window.location.href = '/?a=ambush';
}
function pageArmurerie(){
    window.location.href = '/?a=equip';
}
function pageMagasin(){
    window.location.href = '/?a=townshop';
}
function pageTalisman(){
    window.location.href = '/?a=talizman';
}
function AllerPageAttaque(){
    setChangementPageAutomatique();
    setTimeout(pageAttaque, Math.ceil(Math.random() * 2000)+timeoutbase);
}

function allerPageArmurerie(){
    setChangementPageAutomatique();
    setTimeout(pageArmurerie, Math.ceil(Math.random() * 2000)+timeoutbase);
}

function allerPageTalisman(){
    setChangementPageAutomatique();
    setTimeout(pageTalisman, Math.ceil(Math.random() * 2000)+timeoutbase);
}

function allerPageMagasin(){
    setChangementPageAutomatique();
    setTimeout(pageMagasin, Math.ceil(Math.random() * 2000)+timeoutbase);
}

function restufToi(){
    GM_setValue(location.origin+getNameJoueur() + "restufToi", "true");
}

function restufToiDesact(){
    GM_setValue(location.origin+getNameJoueur() + "restufToi", "false");
}

function doitRestuff(){
    return GM_getValue(location.origin+getNameJoueur() + "restufToi") == "true";
}

function doitMettreTalisman(){
    return GM_getValue(location.origin+getNameJoueur() + "MettreTalisman") == "true";
}
function declencheMettreTalisman(param){
    GM_setValue(location.origin+getNameJoueur() + "MettreTalisman", ""+param);
}
function declencheAttaque(param){
    GM_setValue(location.origin+getNameJoueur() + "doitAtt", ""+param);

}
function doitAttaquer(){
    return GM_getValue(location.origin +getNameJoueur()+ "doitAtt", "false") == "true";

}

//mettre stuff defense
function mettreStuffDef(){
    restufToi();
    setTimeout("window.location.href = '/?a=equip';",Math.ceil(2000*Math.random() + timeoutbase));
}

function acheterFerraille(){
    setChangementPageAutomatique();
    var fieldSet=document.getElementsByClassName("equip")[0];
    var junk=document.getElementById("buy_junk");
    junk.value=Math.floor((getArgent()-10000)/20000);
    var a=fieldSet.getElementsByTagName("A")[0];
    a.click();
}

function vendreFerraille(){
    setChangementPageAutomatique();
    var fieldSet=document.getElementsByClassName("equip")[0];
    var a=fieldSet.getElementsByClassName("sellItem")[0];
    a.click();
}

function activerVendreFerraille(bool){
    GM_setValue(location.origin + getNameJoueur() + "doitVendreFeraille", bool);
}

function doitVendreFerraille(){
    return GM_getValue(location.origin + getNameJoueur() + "doitVendreFeraille","false") == "true";
}

function premiereUtilisation(){
    var pasPremier = GM_getValue(location.origin + getNameJoueur() + "firstUsageF") == "true";
    GM_setValue(location.origin + getNameJoueur() + "firstUsageF", "true");
    return !pasPremier;
}
//**************************************//
//              runAttackBot           //
//************************************//
function runAttackBot(){

    /*  if (premiereUtilisation()) {
        var answer = confirm(strings[sFirstUsage]);
        if (!answer) {
            stopBOTFight();
            return;
        }
    }*/
    var ind=getIndiceCourant();
    //alert(ind);
    var changementPageAutomatique = estChangementPageAutomatique();
    setChangementPageAutomatiqueEffectue();
    if(ind<adversaire.length ){
        if(changementPageAutomatique){
            if(estSurPageAttaque()){//1
                if(!doitAttaquer()){
                    if(ind==0){//si le joueur est le premier il n'y a pas de verification de changement de stuff
                        restufToi();
                        allerPageArmurerie();
                    }else{//sinon on verifie que les stuffs ne sont pas identique
                        if(PreSetAdversaire[ind-1]!=PreSetAdversaire[ind]){
                            restufToi();
                            allerPageArmurerie();
                        }else{
                            declencheAttaque("true");
                            if(Talisman[ind]==0){
                                AllerPageAttaque();
                            }else
                            if(Talisman[ind-1]!=Talisman[ind]){
                                declencheMettreTalisman("true");
                                allerPageTalisman();
                            }
                            else{
                                AllerPageAttaque();
                            }
                        }
                    }
                }
                else if(getAssezPourFaireFerraille()){
                    allerPageMagasin();
                }
                else{
                    if(estSurPageProgressionAttaque()){//4
                        attendreFinDeLAttaque();
                    }
                    else{
                        if(document.getElementsByClassName("auBid")!=null&&document.getElementsByClassName("auBid").length!=0){//si le joueur n'existe pas on passe au suivant
                            incremIndiceCourant();
                            declencheAttaque("false");
                            AllerPageAttaque();
                        }
                        entrerPseudo(ind);
                    }
                }
            }
            else{
                if(estSurProfil()){//2
                    attaqueProfil();
                }
                else{
                    if(estSurArcaneAttaque()){//3
                        if(getNbAttaquesRestantes()>0){//on peut attaquer
                            if(document.getElementsByClassName("auBid")!=null&&document.getElementsByClassName("auBid").length!=0){//si pas attaquable
                                declencheAttaque("false");
                                incremIndiceCourant();
                                AllerPageAttaque();
                            }
                            else{
                                lanceAttaque();
                            }
                        }
                        else{//plus d'attaque
                            GM_setValue(location.origin + getNameJoueur() + "indiceCourant",adversaire.length);
                            declencheAttaque("false");
                            allerPageArmurerie();
                        }
                    }
                    else{
                        if(estSurRapportAttaque()){//5
                            declencheAttaque("false");
                            incremIndiceCourant();
                            AllerPageAttaque();
                        }
                        else{
                            if(estSurPageTalisman()){
                                if(doitMettreTalisman()){
                                    //declencheMettreTalisman(param)
                                    var script=document.body.getElementsByTagName("script")[0].innerHTML;
                                    var len=script.length;
                                    script=script.substring(17,len-2);
                                    declencheMettreTalisman("false");
                                    setChangementPageAutomatique();
                                    document.location = (location.origin + '?a=talizman&do=main&equipSet='+Talisman[ind]+'&akey='+script);
                                }
                                else{
                                    AllerPageAttaque();
                                }

                            }
                            else{

                                if(estSurPageArmurerie()){
                                    if(doitRestuff()){
                                        var script=document.body.getElementsByTagName("script")[0].innerHTML;
                                        var len=script.length;
                                        script=script.substring(17,len-2);
                                        restufToiDesact();
                                        declencheAttaque("true");
                                        setChangementPageAutomatique();
                                        document.location = (location.origin + '?a=equip&eqset='+PreSetAdversaire[ind]+'&akey='+script);
                                    }else{
                                        //alert(doitAttaquer());
                                        if(doitAttaquer()){
                                            if(ind==0&&Talisman[ind]!=0){//si le joueur est le premier il n'y a pas de verification de changement de talisman
                                                declencheMettreTalisman("true");
                                                allerPageTalisman();

                                            }else{//sinon on verifie que les talisman ne sont pas identique
                                                if(Talisman[ind]==0){
                                                    AllerPageAttaque();
                                                }else{
                                                    if(Talisman[ind-1]!=Talisman[ind]){
                                                        declencheMettreTalisman("true");
                                                        allerPageTalisman();
                                                    }else{

                                                        AllerPageAttaque();
                                                    }
                                                }
                                            }
                                        }
                                        else{//alert("ici");
                                            setTimeout(mettreStuffDef, Math.ceil(Math.random() * 10)+timeoutbase);
                                        }
                                    }
                                }
                                else{
                                    if(estSurPageMagasin()){
                                        if(doitVendreFerraille()){
                                            vendreFerraille();
                                            activerVendreFerraille("false");
                                        }else if(getAssezPourFaireFerraille()){
                                            acheterFerraille();
                                        }
                                        else{
                                            AllerPageAttaque();
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    else{
        if(changementPageAutomatique){
            if(estSurPageMagasin()){
                if(getAssezPourFaireFerraille()){
                    acheterFerraille();
                }
                else{
                    allerPageArmurerie();
                }
            }
            else{
                if(estSurPageArmurerie()){
                    setTimeout(mettreStuffDef, Math.ceil(Math.random() * 10)+timeoutbase);
                }
                else{
                    if(estSurRapportAttaque()||estSurProfil()||estSurPageAttaque()){//pas vraiment utile le test
                        if(getAssezPourFaireFerraille()){
                            allerPageMagasin();
                        }
                        else{
                            allerPageArmurerie();
                        }
                    }
                }
            }
        }else if (estSurPageArmurerie()) {
            if(doitRestuff()){
                var test=GM_getValue(location.origin+ getNameJoueur()  + "ens");
                var script=document.body.getElementsByTagName("script")[0].innerHTML;
                var len=script.length;
                var talis=0;
                script=script.substring(17,len-2);
                restufToiDesact();
                talis=GM_getValue(location.origin + getNameJoueur() + "talisman_restuff", 0);
                if(talis==0){
                    stopFightBOT();
                }
                document.location = (location.origin + '?a=equip&eqset='+test+'&akey='+script);
            }
            else{
                declencheMettreTalisman("true");
                setTimeout(pageTalisman, Math.ceil(Math.random() * 2000)+timeoutbase);
            }
        }else{
            if(estSurPageTalisman()){
                if(doitMettreTalisman()){
                    //declencheMettreTalisman(param)
                    var script=document.body.getElementsByTagName("script")[0].innerHTML;
                    var len=script.length;
                    var talis=0;
                    talis=GM_getValue(location.origin + getNameJoueur() + "talisman_restuff", 0);
                    script=script.substring(17,len-2);
                    declencheMettreTalisman("false");
                    if(talis!=0){
                        document.location = (location.origin + '?a=talizman&do=main&equipSet='+talis+'&akey='+script);
                    }
                }
                else stopFightBOT();
            }
        }
    }
}

function Demarrer(){
    startFightBOT();
    AllerPageAttaque();
}

function Arreter(){
    stopFightBOT();
}

// ------------------------------------------------------------------------------------------------
// ==================================== Array Function ============================================
// ------------------------------------------------------------------------------------------------

function getNameJoueur(){
    var stat=document.getElementsByClassName("stats-player")[0];
    nom=stat.getElementsByClassName("me")[0];
    return nom.innerHTML;
}

function getTab(nomTab){
    chaineTemp=GM_getValue(location.origin + getNameJoueur() +""+nomTab, "");
    var sep = '|*|';
    tabTemp=chaineTemp.split(sep);
    tabTemp.length--;
    return tabTemp;
}

function ajouterElementTab(tab,element){
    tab[tab.length]=element;
    return tab;
}

function estElementDuTab(tab,element){
    return getIndElementTab(tab,element)!=-1;
}

function getIndElementTab(tab,element){
    var i=0;
    while(i<tab.length&&!(element==tab[i])){
        i++;
    }
    return i!=tab.length ? i : -1 ;
}

function tabVersChaine(tab){
    var chaine="";
    var i=0;
    while(i<tab.length){
        chaine+=tab[i]+"|*|";
        i++;
    }
    return chaine;
}

function suppElementTab(tab,element){
    var i=getIndElementTab(tab,element);
    if(i!=-1){
        while(i<tab.length-1){
            tab[i]=tab[i+1];
            i++;
        }
        tab.length--;
    }
    return tab;
}

function suppElementTab2(nom,element){
    tab=getTab("adversaire");
    tab2=getTab(nom);
    var i=getIndElementTab(tab,element);
    if(i!=-1){
        while(i<tab.length-1){
            tab2[i]=tab2[i+1];
            i++;
        }
        tab2.length--;
    }
    return tab2;
}

function AddToGlobalVar(nomTab, element){
    var array = getTab(nomTab);
    if(estElementDuTab(array, element)==false){
        array = ajouterElementTab(array, element);
        GM_setValue(location.origin + getNameJoueur() +""+nomTab, tabVersChaine(array));
    }
}

function Add2ToGlobalVar(nomTab, element){
    var array = getTab(nomTab);
    array = ajouterElementTab(array, element);
    GM_setValue(location.origin + getNameJoueur() +""+nomTab, tabVersChaine(array));
}

function DeleteFromGlobalVar(nomTab, element){
    var array = getTab(nomTab);
    if(estElementDuTab(array, element)){
        array = suppElementTab(array, element);
        GM_setValue(location.origin + getNameJoueur() +""+nomTab, tabVersChaine(array));
    }
}

function DeleteFromGlobalVar2(nom,element){
    var array = getTab("adversaire");
    if(estElementDuTab(array, element)){
        array = suppElementTab2(nom,element);
        GM_setValue(location.origin + getNameJoueur()+nom, tabVersChaine(array));
    }
}

// ------------------------------------------------------------------------------------------------
// =================================== KOKO'S Function ============================================
// ------------------------------------------------------------------------------------------------
function getClan(){
    // on recupere le tag de son clan
    var TABLE   = document.getElementsByTagName("TABLE");
    var clanName    = TABLE[3].getElementsByTagName("TR")[1].getElementsByTagName("TD")[1].innerHTML;
    nba         = clanName.indexOf("<b>", 0);
    nbb         = clanName.indexOf("</b>", nba);
    clanName    = clanName.substring(nba+3, nbb);
    return clanName;
}

function arcanes(){
    var opt = '';
    var racetmp = GM_getValue(location.origin + getNameJoueur() + "race");

    var ark1 = GM_getValue(location.origin + getNameJoueur() + "ark_1");
    var ark2 = GM_getValue(location.origin + getNameJoueur() + "ark_2");
    var ark3 = GM_getValue(location.origin + getNameJoueur() + "ark_3");

    if(racetmp == 1 || racetmp==4){
        document.getElementById('ark3_tr').style.visibility = "visible";
    }else{
        document.getElementById('ark3_tr').style.visibility = "hidden";
    }

    if(racetmp==2 || racetmp == 3 || racetmp==5){
        document.getElementById('ark3a_tr').style.visibility = "visible";
    }else{
        document.getElementById('ark3a_tr').style.visibility = "hidden";
    }

    if(racetmp == 1){
        document.getElementById('ark1_txt').innerHTML   = '- '+strings[sCharisme];
        document.getElementById('ark2_txt').innerHTML   = '- '+strings[sReputation];
        document.getElementById('ark3_txt').innerHTML   = '- '+strings[sMajeste];
        document.getElementById('ark1').value       = ark1;
        document.getElementById('ark2').value       = ark2;
        document.getElementById('ark3').value       = ark3;
    }
    if(racetmp == 2){
        document.getElementById('ark1_txt').innerHTML   = '- '+strings[sSangVie];
        document.getElementById('ark2_txt').innerHTML   = '- '+strings[sAgilite];
        document.getElementById('ark3a_txt').innerHTML   = '- '+strings[sArdSang];
        document.getElementById('ark1').value       = ark1;
        document.getElementById('ark2').value       = ark2;
        if(ark3 == 1){ document.getElementById('ark3a').checked = true; }
    }
    if(racetmp == 3){
        document.getElementById('ark1_txt').innerHTML   = '- '+strings[sForce];
        document.getElementById('ark2_txt').innerHTML   = '- '+strings[sResistance];
        document.getElementById('ark3a_txt').innerHTML  = '- '+strings[sOmbreBete];
        document.getElementById('ark1').value       = ark1;
        document.getElementById('ark2').value       = ark2;
        if(ark3 == 1){ document.getElementById('ark3a').checked = true; }

    }
    if(racetmp == 4){
        document.getElementById('ark1_txt').innerHTML   = '- '+strings[sSilence];
        document.getElementById('ark2_txt').innerHTML   = '- '+strings[sAbsForce];
        document.getElementById('ark3_txt').innerHTML   = '- '+strings[sChance];
        document.getElementById('ark1').value       = ark1;
        document.getElementById('ark2').value       = ark2;
        document.getElementById('ark3').value       = ark3;
    }
    if(racetmp == 5){
        document.getElementById('ark1_txt').innerHTML   = '- '+strings[sPerception];
        document.getElementById('ark2_txt').innerHTML   = '- '+strings[sSouffle];
        document.getElementById('ark3a_txt').innerHTML  = '- '+strings[sHorreur];
        document.getElementById('ark1').value       = ark1;
        document.getElementById('ark2').value       = ark2;
        if(ark3 == 1){ document.getElementById('ark3a').checked = true; }
    }
}

//function ensSave(){
//    var data    = document.getElementsByTagName("SELECT")[0];
//    if(GM_getValue(location.hostname + "ENS_"+1,"")!=data.getElementsByTagName("OPTION")[1].innerHTML)
//        for (i=1;i<=20;i++){
//            GM_setValue(location.origin + getNameJoueur() + "ENS_"+i, data.getElementsByTagName("OPTION")[i].innerHTML);
//        }
//}

function ensSave(){
    var set = 1;
    for(set=1; set<21; set++){ GM_setValue(location.origin + getNameJoueur() + "ENS_"+set, ""); }
    var i=0;
    var combobox=document.getElementsByClassName("combobox");
    while(i<combobox.length&&combobox[i].name!="itemSetNr"){
        i++;
    }
    var data    = document.getElementsByClassName("combobox")[i];
    var ens_1=data.getElementsByTagName("OPTION");
    for (i=0;i<ens_1.length;i++){
        if(ens_1[i].innerHTML.indexOf("(néant)") == -1){
            GM_setValue(location.origin + getNameJoueur() + "ENS_"+i, ens_1[i].innerHTML);
        }
    }
}

//function talismanSave(){
//    var data    = document.getElementsByTagName("SELECT")[0];
//    if(GM_getValue(location.hostname + "TALISMAN_"+1,"")!=data.getElementsByTagName("OPTION")[1].innerHTML)
//        for (i=1;i<=10;i++){
//            GM_setValue(location.origin + getNameJoueur() + "TALISMAN_"+i, data.getElementsByTagName("OPTION")[i].innerHTML);
//        }
//}

function talismanSave(){
    var set = 1;
    for(set=1; set<11; set++){ GM_setValue(location.origin + getNameJoueur() + "TALISMAN_"+set, ""); }
    var i=0;
    var combobox=document.getElementsByClassName("combobox");
    while(i<combobox.length&&combobox[i].name!="setNr"){
        i++;
    }
    var data    = document.getElementsByClassName("combobox")[i];
    var ens_1=data.getElementsByTagName("OPTION");
    for (i=0;i<ens_1.length;i++){
        if(ens_1[i].innerHTML.indexOf("(néant)") == -1){
            GM_setValue(location.origin + getNameJoueur() + "TALISMAN_"+i, ens_1[i].innerHTML);
        }
    }
}

function testStuff(data,tab){
    var out = data;
    if(GM_getValue(location.origin + getNameJoueur() + tab + data) != null){
        out = GM_getValue(location.origin + getNameJoueur() + tab + data);
    }
    return out;
}

function raceOptions(){
    var opt = '';
    var racetmp = GM_getValue(location.origin + getNameJoueur() + "race");
    for(i=1; i<=5; i++){
        if(i==racetmp){
            opt += '<option value="'+i+'" selected>'+strings[i]+'</option>'
        }else{
            opt += '<option value="'+i+'">'+strings[i]+'</option>'
        }
    }
    return opt;
}

function taxiOptions(){
    var opt = '';
    var taxi = GM_getValue(location.origin + getNameJoueur() + "taxi");
    for(i=1; i<=5; i++){
        if(i==taxi){
            opt += '<option value="'+i+'" selected>'+i+'</option>'
        }else{
            opt += '<option value="'+i+'">'+i+'</option>'
        }
    }
    return opt;
}

function OptionStuff(data, tab){
    var opt = '';
    var stufftmp = GM_getValue(location.origin + getNameJoueur() + data);
    for(i=1; i<=20; i++){
        if(GM_getValue(location.origin + getNameJoueur() + "ENS_"+i)!=""){
            if(i==stufftmp){
                opt += '<option value="'+i+'" selected>'+testStuff(i,tab)+'</option>'
            }else{
                opt += '<option value="'+i+'">'+testStuff(i,tab)+'</option>'
            }
        }
    }
    return opt;
}

function talismanOptions(data, tab){
    var opt = '<option value="0">Aucun</option>';
    var stufftmp = GM_getValue(location.origin + getNameJoueur() + data, 0);
    for(i=1; i<=10; i++){
        if(GM_getValue(location.origin + getNameJoueur() + "TALISMAN_"+i)!=""){
            if(i==stufftmp){
                opt += '<option value="'+i+'" selected>'+testStuff(i,tab)+'</option>'
            }else{
                opt += '<option value="'+i+'">'+testStuff(i,tab)+'</option>'
            }
        }
    }
    return opt;
}

function optionsPreset(stufftmp1){
    var opt = '';
    for(j=1; j<=20; j++){
        if(j==parseInt(stufftmp1)){
            opt += '<option value="'+j+'" selected>'+testStuff(j,"ENS_")+'</option>'
        }else{
            opt += '<option value="'+j+'">'+testStuff(j,"ENS_")+'</option>'
        }
    }
    return opt;
}

function optionsTalisman(stufftmp2){
    var opt = '<option value="0">Aucun</option>';
    for(k=1; k<=10; k++){
        if(k==parseInt(stufftmp2)){
            opt += '<option value="'+k+'" selected>'+testStuff(k,"TALISMAN_")+'</option>'
        }else{
            opt += '<option value="'+k+'">'+testStuff(k,"TALISMAN_")+'</option>'
        }
    }
    return opt;
}

function adversaireTotalOptionsPage(){
    var compteur = 0;
    var dsp = '<tr><td colspan="2"><table><tr>';
    var advOptions = getTab("adversaire_total");
    var presetOptions = getTab("PreSetAdversaire_total");
    var talismanOptions = getTab("Talisman_total");
    var ARK1TMP = getTab("arcanesC0_total");
    var ARK2TMP = getTab("arcanesC1_total");
    var ARK3TMP = getTab("arcanesC2_total");
    for(i=0;i<advOptions.length;i++){
        if (compteur==6){
            dsp += '</tr><tr>'
            compteur = 0;
        }
        dsp += '<td style="width: 100px; text-align: center;">'
            + '<input name="login" type="checkbox" id="'+i+'" value="'+advOptions[i]+'" /><b>'+advOptions[i]+'</b>'
            + '<br /><select class="combobox i_realm" name="preset" id="preset_'+i+'">'+optionsPreset(presetOptions[i])+'</select>'
            + '<br /><select class="combobox i_realm" name="talisman" id="talisman_'+i+'">'+optionsTalisman(talismanOptions[i])+'</select>'
            + '<br />ARK1 <input size="1" class="inputbox" name="ARK1" type="text" id="ARK1_'+i+'" value="'+ARK1TMP[i]+'" />'
            + '<br />ARK2 <input size="1" class="inputbox" name="ARK2" type="text" id="ARK2_'+i+'" value="'+ARK2TMP[i]+'" />'
            + '<br />ARK3 <input size="1" class="inputbox" name="ARK3" type="text" id="ARK3_'+i+'" value="'+ARK3TMP[i]+'" />'
            + '</td><td></td>';
        compteur++;
    }

    while(compteur<6){
        dsp += '<td></td>';
        compteur++;
    }
    dsp += '</tr>';
    dsp += '</table></td></tr>'
    return dsp;
}

function adversaireOptionsPage(){
    var compteur = 0;
    var dsp = '<tr><td colspan="2"><table><tr>';
    var advOptions = getTab("adversaire");
    var presetOptions = getTab("PreSetAdversaire");
    var talismanOptions = getTab("Talisman");
    var ARK1TMP = getTab("arcanesC0");
    var ARK2TMP = getTab("arcanesC1");
    var ARK3TMP = getTab("arcanesC2");
    for(i=0;i<advOptions.length;i++){
        if (compteur==7){
            dsp += '</tr><tr>'
            compteur = 0;
        }
        dsp += '<td style="width: 100px; text-align: center;"><b>'+advOptions[i]+'</b><br />('+testStuff(presetOptions[i],"ENS_")+')<br />('+testStuff(talismanOptions[i],"TALISMAN_")+')'
            + '<br />ARK1 ' + ARK1TMP[i]
            + '<br />ARK2 ' + ARK2TMP[i]
            + '<br />ARK3 ' + ARK3TMP[i]
            + '</td>';
        compteur++;
    }
    while(compteur<7){
        dsp += '<td></td>';
        compteur++;
    }
    dsp += '</tr>';
    dsp += '</table></td></tr>'
    return dsp;
}

function chargerConf(){
    var royaume = '';
    //((location.origin.indexOf('r1')!=-1) ? ".r1":".r2")

    if(location.origin.indexOf('r1')!=-1){ royaume = '.r1'; }
    else if(location.origin.indexOf('r2')!=-1){ royaume = '.r2'; }
    else if(location.origin.indexOf('r6')!=-1){ royaume = '.r6'; }

    var Url="http://torrentflux.teamvip.eu/DATA/oOBWOo/conf/fightConf."+getNameJoueur().toLowerCase()+royaume+".json";
    GM_xmlhttpRequest({
        method: "GET",
        url: Url,
        headers: {
            "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
            "Accept": "application/json",           // If not specified, browser defaults will be used.
        },

        onload : function(response) {
            fightConf= JSON.parse(response.responseText);
            if(fightConf!=undefined){

                //JSON.stringify(fightConf);
                //chargement de la conf du joueur
                GM_setValue(location.origin + getNameJoueur() + "race",parseInt(fightConf["race"]));
                GM_setValue(location.origin + getNameJoueur() + "ens",fightConf["ens"]) ;
                GM_setValue(location.origin + getNameJoueur() + "talisman_restuff",fightConf["talisman_restuff"]) ;
                GM_setValue(location.origin + getNameJoueur() + "ens_init_attack",fightConf["ens_init_attack"]) ;
                GM_setValue(location.origin + getNameJoueur() + "talisman_init_attack",fightConf["talisman_init_attack"]) ;
                GM_setValue(location.origin + getNameJoueur() + "taxi",fightConf["taxi"]) ;
                GM_setValue(location.origin + getNameJoueur() + "ark_1",fightConf["arcanes"].ark_1) ;
                GM_setValue(location.origin + getNameJoueur() + "ark_2",fightConf["arcanes"].ark_2) ;
                GM_setValue(location.origin + getNameJoueur() + "ark_3",fightConf["arcanes"].ark_3) ;

                //Reinitialisation de la liste d'adversaire
                GM_setValue(location.origin + getNameJoueur() + "adversaire","");
                GM_setValue(location.origin + getNameJoueur() + "PreSetAdversaire","") ;
                GM_setValue(location.origin + getNameJoueur() + "Talisman","") ;
                GM_setValue(location.origin + getNameJoueur() + "arcanesC0","") ;
                GM_setValue(location.origin + getNameJoueur() + "arcanesC1","") ;
                GM_setValue(location.origin + getNameJoueur() + "arcanesC2","") ;

                //Reinitialisation de la liste d'adversairetotal
                GM_setValue(location.origin + getNameJoueur() + "adversaire_total","") ;
                GM_setValue(location.origin + getNameJoueur() + "PreSetAdversaire_total","") ;
                GM_setValue(location.origin + getNameJoueur() + "Talisman_total","") ;
                GM_setValue(location.origin + getNameJoueur() + "arcanesC0_total","") ;
                GM_setValue(location.origin + getNameJoueur() + "arcanesC1_total","") ;
                GM_setValue(location.origin + getNameJoueur() + "arcanesC2_total","") ;

                //Remplissage de la liste d'adversairetotal
                for(i=0;i<fightConf["oppenentListTotal"].length;i++){
                    Add2ToGlobalVar("adversaire_total",fightConf["oppenentListTotal"][i].adversaire_total);
                    Add2ToGlobalVar("PreSetAdversaire_total",fightConf["oppenentListTotal"][i].PreSetAdversaire_total);
                    Add2ToGlobalVar("Talisman_total",fightConf["oppenentListTotal"][i].Talisman_total);
                    Add2ToGlobalVar("arcanesC0_total",fightConf["oppenentListTotal"][i]. arcanesC0_total);
                    Add2ToGlobalVar("arcanesC1_total",fightConf["oppenentListTotal"][i]. arcanesC1_total);
                    Add2ToGlobalVar("arcanesC2_total",fightConf["oppenentListTotal"][i]. arcanesC2_total);
                }
            }
        }
    });
}

function generateJson(){
    // ut:   (location.origin.indexOf('r1')!=-1) ? ut=".r1":ut=".r2",
    var ut="";
    if(location.origin.indexOf('r1')!=-1){ ut = '.r1'; }
    else if(location.origin.indexOf('r2')!=-1){ ut = '.r2'; }
    else if(location.origin.indexOf('r6')!=-1){ ut = '.r6'; }
    var myObject = {
        player:    getNameJoueur().toLowerCase(),
        ut:   ut,
        race:      GM_getValue(location.origin + getNameJoueur() + "race"),
        ens:   GM_getValue(location.origin + getNameJoueur() + "ens"),
        talisman_restuff:   GM_getValue(location.origin + getNameJoueur() + "talisman_restuff"),
        ens_init_attack:   GM_getValue(location.origin + getNameJoueur() + "ens_init_attack"),
        talisman_init_attack:    GM_getValue(location.origin + getNameJoueur() + "talisman_init_attack"),
        taxi:   GM_getValue(location.origin + getNameJoueur() + "taxi"),
        arcanes:{
            ark_1:GM_getValue(location.origin + getNameJoueur() + "ark_1"),
            ark_2:GM_getValue(location.origin + getNameJoueur() + "ark_2"),
            ark_3:GM_getValue(location.origin + getNameJoueur() + "ark_3")
        },

        oppenentListTotal:[],
        oppenentList:[]
    };


    var advOptions = getTab("adversaire_total");
    var presetOptions = getTab("PreSetAdversaire_total");
    var talismanOptions = getTab("Talisman_total");
    var ARK1TMP = getTab("arcanesC0_total");
    var ARK2TMP = getTab("arcanesC1_total");
    var ARK3TMP = getTab("arcanesC2_total");
    var adv = getTab("adversaire");
    var preset = getTab("PreSetAdversaire");
    var talisman= getTab("Talisman");
    var ARK1 = getTab("arcanesC0");
    var ARK2= getTab("arcanesC1");
    var ARK3 = getTab("arcanesC2");

    for(i=0;i<advOptions.length;i++){
        myObject.oppenentListTotal[i]={adversaire_total:advOptions[i],
            PreSetAdversaire_total:presetOptions[i],
            Talisman_total:talismanOptions[i],
            arcanesC0_total:ARK1TMP[i],
            arcanesC1_total:ARK2TMP[i],
            arcanesC2_total:ARK3TMP[i],
        };
    }

    var myJSONText = JSON.stringify(myObject);

    GM_xmlhttpRequest({
        method: "GET",
        url: "http://torrentflux.teamvip.eu/DATA/oOBWOo/conf/saveConf.php?q="+myJSONText
    });

    /* generation du blob ou fichier
   var blob = new Blob([myJSONText], {type: "text/javascript;charset=utf-8"});
   (location.origin.indexOf('r1')!=-1) ? ut=".r1":ut=".r2";
    saveAs(blob, "fightConf"+ut+".js");*/
}


function Options(){
    var doc = document.getElementById("content-mid");
    var html = '';

    html += '<div id="opt_menu">'
        +'	<form id="botFight" name="botFight">'
        +'		<div style="text-align: center; font-size: 16px; font-weight: bold; width: 100%;" >Blood Wars Fight Bot - Options</div><br />'

        +'		<fieldset style="-moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 10px;">'
        +'			<legend style="text-align: center; font-size: 14px;"><b>'+strings[sChooseRace]+'</b></legend>'
        +'			<select class="combobox i_realm" name="opt_race" id="opt_race">' + raceOptions() + '</select>'
        +'			<table>'
        +'				<tr>'
        +'					<td id="ark1_txt"></td>'
        +'					<td><input id="ark1" class="inputbox" type="texte" value="" size="3" /></td>'
        +'				</tr>'
        +'				<tr id="ark2_tr">'
        +'					<td id="ark2_txt"></td>'
        +'					<td><input id="ark2" class="inputbox" type="texte" value="" size="3" /></td>'
        +'				</tr>'
        +'				<tr id="ark3_tr" style="visibility: none;">'
        +'					<td id="ark3_txt"></td>'
        +'					<td><input id="ark3" class="inputbox" type="texte" value="" size="3" /></td>'
        +'				</tr>'
        +'				<tr id="ark3a_tr" style="visibility: none;">'
        +'					<td id="ark3a_txt"></td>'
        +'					<td><input id="ark3a" class="inputbox" type="checkbox" value="" /></td>'
        +'				</tr>'
        +'			</table>'
        +'		</fieldset><br />'

        +'		<fieldset style="-moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 10px;">'
        +'			<legend style="text-align: center; font-size: 14px;"><b>Stuff, Talismans et Taxi</b></legend>'
        +'			<table>'
        +'				<tr>'
        +'					<td width="300"><b>Stuff / Talisman à replacer après les attaques</b></td>'
        +'					<td><select class="combobox i_realm" name="opt_stuff" id="opt_stuff">' + OptionStuff("ens", "ENS_") + '</select></td>'
        +'					<td>&nbsp;<select class="combobox i_realm" name="opt_talisman" id="opt_talisman">' + talismanOptions("talisman_restuff", "TALISMAN_") + '</select></td>'
        +'				</tr>'
        +'			</table>'
        +'			<table>'
        +'				<tr>'
        +'					<td width="300"><b>Stuff / Talisman initiaux</b></td>'
        +'					<td><select class="combobox i_realm" name="opt_stuff_init_attack" id="opt_stuff_init_attack">' + OptionStuff("ens_init_attack", "ENS_") + '</select></td>'
        +'					<td>&nbsp;<select class="combobox i_realm" name="opt_talisman_init_attack" id="opt_talisman_init_attack">' + talismanOptions("talisman_init_attack", "TALISMAN_") + '</select></td>'
        +'				</tr>'
        +'			</table>'
        +'			<table>'
        +'				<tr>'
        +'					<td width="300"><b>'+strings[sTaxi]+'</b></td>'
        +'					<td><select class="combobox i_realm" name="opt_taxi" id="opt_taxi">' + taxiOptions() + '</select></td>'
        +'				</tr>'
        +'			</table>'
        +'		</fieldset><br />'

        +'		<div style="text-align: center;"><input class="button" id="opt_go" type="button" value="'+strings[sUpdate]+'" /></div><br />'

        +'		<fieldset style="-moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 10px;">'
        +'			<legend style="text-align: center; font-size: 14px;"><b>Ajout rapide d\'un joueur à la liste d\'attaque</b></legend>'
        +'			<table style="width: 100%; text-align: center;">'
        +'				<tr>'
        +'					<td>'
        +'						<input class="inputbox" type="text" value="" name="SpeedLogin" id="SpeedLogin" />'
        +'						<select class="combobox i_realm" name="opt_preset_speed_add" id="opt_preset_speed_add">' + OptionStuff("ens_init_attack", "ENS_") + '</select>'
        +'						<select class="combobox i_realm" name="opt_talisman_speed_add" id="opt_talisman_speed_add">' + talismanOptions("talisman_init_attack", "TALISMAN_") + '</select>'
        +'					</td>'
        +'				</tr>'
        +'				<tr>'
        +'					<td colspan="2" align="center"><br />'
        +'						ARK1 <input size="1" class="inputbox" name="ARK1" type="text" id="ARK1_SpeedAdd" value="'+GM_getValue(location.origin + getNameJoueur() + "ark_1")+'" />'
        +'						ARK2 <input size="1" class="inputbox" name="ARK2" type="text" id="ARK2_SpeedAdd" value="'+GM_getValue(location.origin + getNameJoueur() + "ark_2")+'" />'
        +'						ARK3 <input size="1" class="inputbox" name="ARK3" type="text" id="ARK3_SpeedAdd" value="'+GM_getValue(location.origin + getNameJoueur() + "ark_3")+'" />'
        +'					</td>'
        +'				</tr>'
        +'				<tr>'
        +'					<td colspan="2" align="center"><br /><input class="button" type="button" name="opt_speed_add" id="opt_speed_add" value="Ajouter à la liste d\'attaque" /></td>'
        +'				</tr>'
        +'			</table>'
        +'		</fieldset><br />'

        +'		<fieldset style="-moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 10px;">'
        +'			<legend style="text-align: center; font-size: 14px;"><b>' + strings[sFightTotal] + '</b></legend>'
        +			adversaireTotalOptionsPage()
        +'			<table style="width: 100%; text-align: center;">'
        +'				<tr><td align="center" style=""><br /><input type="button" class="button" value="Cocher tout" name="checkAll" id="checkAll" /> <input class="button" type="button" value="Décocher tout" name="uncheckAll" id="uncheckAll" /> <input class="button action-caption" id="opt_majstuff" type="button" value="MAJ des Stuffs attaque" /></td></tr>'
        +'				<tr><td align="center"><br /><input class="button" id="opt_add2list" type="button" value="'+strings[sAdd2List]+'" /> <input class="button" id="opt_delete2list" type="button" value="'+strings[sDel2List]+'" /> <input class="button" id="opt_del2total" type="button" style="color: RED;" value="'+strings[sDel2Total]+'" /></td></tr>'
        +'				<tr><td align="center"><br /><input class="button" id="opt_createlist" type="button" value="'+strings[sCreateList]+'" /></td></tr>'
        +'			</table>'
        +'		</fieldset><br />'

        +'		<fieldset style="-moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 10px;">'
        +'			<legend style="text-align: center; font-size: 14px;"><b>' + strings[sFightList] + '</b></legend>'
        +   		adversaireOptionsPage()
        +'		</fieldset><br />'

        +'		<fieldset style="-moz-border-radius: 5px; -webkit-border-radius: 5px; padding: 10px;">'
        +'			<legend style="text-align: center; font-size: 14px;"><b>Sauvegarde et restauration de la configuration</b></legend>'
        +'   		<div style="text-align: center; width: 100%;"><input class="button" id="opt_saveAll" type="button" value="'+"Sauvegarder la Configuration"+'" /> <input class="button" id="opt_loadAll" type="button" value="'+'Charger la Configuration'+'" /></div>'
        +'		</fieldset>'

        +'	</form>'
        +'</div>';

    doc.innerHTML = html;
    arcanes();

    // select All checkboxes
    document.getElementById('checkAll').addEventListener("click",function(event){
        var tailleLogin = document.getElementsByName('login').length;
        for(i=0;i<tailleLogin;i++){
            document.getElementById(i).checked = "checked";
        }
    },true);

    document.getElementById('uncheckAll').addEventListener("click",function(event){
        var tailleLogin = document.getElementsByName('login').length;
        for(i=0;i<tailleLogin;i++){
            document.getElementById(i).checked = "";
        }
    },true);

    // ajout d'un joueur manuellement
    document.getElementById('opt_speed_add').addEventListener("click",function(event){
        var SpeedLogin = document.getElementById('SpeedLogin').value;
        var SpeedTalisman = document.getElementById('opt_talisman_speed_add').value;
        var SpeedPreset = document.getElementById('opt_preset_speed_add').value;
        var SpeedARK1 = document.getElementById('ARK1_SpeedAdd').value;
        var SpeedARK2 = document.getElementById('ARK2_SpeedAdd').value;
        var SpeedARK3 = document.getElementById('ARK3_SpeedAdd').value;

        var sep = '|*|';
        var tmp = '';
        var tmp2 = '';
        // Preset
        var tmp3 = '';
        var tmp4 = '';
        // Talismans
        var tmp5 = '';
        var tmp6 = '';
        // Arcanes
        var tmp7 = '';
        var tmp8 = '';
        var tmp9 = '';
        var tmp10 = '';
        var tmp11 = '';
        var tmp12 = '';

        tmp = tmp + GM_getValue(location.origin + getNameJoueur() + "adversaire","");
        tmp2 = tmp2 + GM_getValue(location.origin + getNameJoueur() + "adversaire_total","");
        GM_setValue(location.origin + getNameJoueur() + "adversaire", tmp + SpeedLogin + sep);
        GM_setValue(location.origin + getNameJoueur() + "adversaire_total", tmp2 + SpeedLogin + sep);

        tmp3 = tmp3 + GM_getValue(location.origin + getNameJoueur() + "PreSetAdversaire","");
        tmp4 = tmp4 + GM_getValue(location.origin + getNameJoueur() + "PreSetAdversaire_total","");
        GM_setValue(location.origin + getNameJoueur() + "PreSetAdversaire", tmp3 + SpeedPreset + sep);
        GM_setValue(location.origin + getNameJoueur() + "PreSetAdversaire_total", tmp4 + SpeedPreset + sep);

        tmp5 = tmp5 + GM_getValue(location.origin + getNameJoueur() + "Talisman","");
        tmp6 = tmp6 + GM_getValue(location.origin + getNameJoueur() + "Talisman_total","");
        GM_setValue(location.origin + getNameJoueur() + "Talisman", tmp5 + SpeedTalisman + sep);
        GM_setValue(location.origin + getNameJoueur() + "Talisman_total", tmp6 + SpeedTalisman + sep);

        // Arcanes
        tmp7 = tmp7 + GM_getValue(location.origin + getNameJoueur() + "arcanesC0","");
        tmp8 = tmp8 + GM_getValue(location.origin + getNameJoueur() + "arcanesC0_total","");
        GM_setValue(location.origin + getNameJoueur() + "arcanesC0", tmp7 + SpeedARK1 + sep);
        GM_setValue(location.origin + getNameJoueur() + "arcanesC0_total", tmp8 + SpeedARK1 + sep);

        tmp9 = tmp9 + GM_getValue(location.origin + getNameJoueur() + "arcanesC1","");
        tmp10 = tmp10 + GM_getValue(location.origin + getNameJoueur() + "arcanesC1_total","");
        GM_setValue(location.origin + getNameJoueur() + "arcanesC1", tmp9 + SpeedARK2 + sep);
        GM_setValue(location.origin + getNameJoueur() + "arcanesC1_total", tmp10 + SpeedARK2 + sep);

        tmp11 = tmp11 + GM_getValue(location.origin + getNameJoueur() + "arcanesC2","");
        tmp12 = tmp12 + GM_getValue(location.origin + getNameJoueur() + "arcanesC2_total","");
        GM_setValue(location.origin + getNameJoueur() + "arcanesC2", tmp11 + SpeedARK3 + sep);
        GM_setValue(location.origin + getNameJoueur() + "arcanesC2_total", tmp12 + SpeedARK3 + sep);
        // on actualise la page Options
        Options();
    },true);

    // mettre à jour les stuf attaques
    document.getElementById('opt_majstuff').addEventListener("click",function(event){
        var taillePreset = document.getElementsByName('preset').length;
        GM_setValue(location.origin + getNameJoueur() + "PreSetAdversaire_total", "");
        GM_setValue(location.origin + getNameJoueur() + "Talisman_total", "");
        GM_setValue(location.origin + getNameJoueur() + "arcanesC0_total", "");
        GM_setValue(location.origin + getNameJoueur() + "arcanesC1_total", "");
        GM_setValue(location.origin + getNameJoueur() + "arcanesC2_total", "");
        for (i=0;i<taillePreset; i++){
            Add2ToGlobalVar("PreSetAdversaire_total",document.getElementById('preset_'+i).value);
            Add2ToGlobalVar("Talisman_total",document.getElementById('talisman_'+i).value);
            Add2ToGlobalVar("arcanesC0_total",document.getElementById('ARK1_'+i).value);
            Add2ToGlobalVar("arcanesC1_total",document.getElementById('ARK2_'+i).value);
            Add2ToGlobalVar("arcanesC2_total",document.getElementById('ARK3_'+i).value);
        }
        Options();
    },true);

    //mettre à jour les valeurs
    document.getElementById('opt_go').addEventListener("click",function(event){
        // Set Race
        var opt_race = document.getElementById('opt_race').value;
        GM_setValue(location.origin + getNameJoueur() + "race", opt_race);

        // vitesse du taxi
        GM_setValue(location.origin + getNameJoueur() + "taxi", document.getElementById('opt_taxi').value);

        // Set Arcanes
        var ARK1 = document.getElementById('ark1').value;
        var ARK2 = document.getElementById('ark2').value;
        var ARK3 = 0;

        GM_setValue(location.origin + getNameJoueur() + "ark2", 0);
        GM_setValue(location.origin + getNameJoueur() + "ark_2", 0);
        GM_setValue(location.origin + getNameJoueur() + "ark3", 0);
        GM_setValue(location.origin + getNameJoueur() + "ark_3", 0);

        if (opt_race==2||opt_race==3||opt_race==5){
            if(document.getElementById('ark3a').checked){
                ARK3 = 1;
            }
        }else{
            ARK3 = document.getElementById('ark3').value;
        }

        if(opt_race == 1){
            GM_setValue(location.origin + getNameJoueur() + "ark_1", ARK1);
            GM_setValue(location.origin + getNameJoueur() + "ark_2", ARK2);
            GM_setValue(location.origin + getNameJoueur() + "ark_3", ARK3);

            GM_setValue(location.origin + getNameJoueur() + "ark1", sCharisme);
            GM_setValue(location.origin + getNameJoueur() + "ark2", sReputation);
            GM_setValue(location.origin + getNameJoueur() + "ark3", sMajeste);
        }
        if(opt_race == 2){
            GM_setValue(location.origin + getNameJoueur() + "ark_1", ARK1);
            GM_setValue(location.origin + getNameJoueur() + "ark_2", ARK2);
            GM_setValue(location.origin + getNameJoueur() + "ark_3", ARK3);

            GM_setValue(location.origin + getNameJoueur() + "ark1", sSangVie);
            GM_setValue(location.origin + getNameJoueur() + "ark2", sAgilite);
            GM_setValue(location.origin + getNameJoueur() + "ark3", sArdSang);
        }
        if(opt_race == 3){
            GM_setValue(location.origin + getNameJoueur() + "ark_1", ARK1);
            GM_setValue(location.origin + getNameJoueur() + "ark_2", ARK2);
            GM_setValue(location.origin + getNameJoueur() + "ark_3", ARK3);

            GM_setValue(location.origin + getNameJoueur() + "ark1", sForce);
            GM_setValue(location.origin + getNameJoueur() + "ark2", sResistance);
            GM_setValue(location.origin + getNameJoueur() + "ark2", sOmbreBete);
        }
        if(opt_race == 4){
            GM_setValue(location.origin + getNameJoueur() + "ark_1", ARK1);
            GM_setValue(location.origin + getNameJoueur() + "ark_2", ARK2);
            GM_setValue(location.origin + getNameJoueur() + "ark_3", ARK3);

            GM_setValue(location.origin + getNameJoueur() + "ark1", sSilence);
            GM_setValue(location.origin + getNameJoueur() + "ark2", sAbsForce);
            GM_setValue(location.origin + getNameJoueur() + "ark3", sChance);
        }
        if(opt_race == 5){
            GM_setValue(location.origin + getNameJoueur() + "ark_1", ARK1);
            GM_setValue(location.origin + getNameJoueur() + "ark_2", ARK2);
            GM_setValue(location.origin + getNameJoueur() + "ark_3", ARK3);

            GM_setValue(location.origin + getNameJoueur() + "ark1", sPerception);
            GM_setValue(location.origin + getNameJoueur() + "ark2", sSouffle);
            GM_setValue(location.origin + getNameJoueur() + "ark3", sHorreur);
        }
        if(opt_race<=5&&opt_race>0){
            GM_setValue(location.origin + getNameJoueur() + "verifCout",1);
        }
        // Set stuff
        GM_setValue(location.origin + getNameJoueur() + "ens", document.getElementById('opt_stuff').value);
        GM_setValue(location.origin + getNameJoueur() + "ens_init_attack", document.getElementById('opt_stuff_init_attack').value);
        GM_setValue(location.origin + getNameJoueur() + "talisman_init_attack", document.getElementById('opt_talisman_init_attack').value);
        GM_setValue(location.origin + getNameJoueur() + "talisman_restuff", document.getElementById('opt_talisman').value);

        // Affichage du message de mise à jour
        alert("Mise à jour des options avec succès");
        Options();
    },true);

    document.getElementById('opt_createlist').addEventListener("click",function(event){
        // login des attaquables
        var tailleLogin = document.getElementsByName('login').length;
        var tmp = '';
        var sep = '|*|';
        tmp = GM_getValue(location.origin + getNameJoueur() + "adversaire");
        GM_setValue(location.origin + getNameJoueur() + "adversaire", "");
        GM_setValue(location.origin + getNameJoueur() + "PreSetAdversaire", "");
        GM_setValue(location.origin + getNameJoueur() + "Talisman", "");
        GM_setValue(location.origin + getNameJoueur() + "arcanesC0", "");
        GM_setValue(location.origin + getNameJoueur() + "arcanesC1", "");
        GM_setValue(location.origin + getNameJoueur() + "arcanesC2", "");
        for (i=0;i<tailleLogin; i++){
            if (document.getElementById(i).checked){
                tmp = GM_getValue(location.origin + getNameJoueur() + "adversaire");
                GM_setValue(location.origin + getNameJoueur() + "adversaire", tmp + document.getElementById(i).value + sep);
                Add2ToGlobalVar("PreSetAdversaire",document.getElementById('preset_'+i).value);
                Add2ToGlobalVar("Talisman",document.getElementById('talisman_'+i).value);
                Add2ToGlobalVar("arcanesC0",document.getElementById('ARK1_'+i).value);
                Add2ToGlobalVar("arcanesC1",document.getElementById('ARK2_'+i).value);
                Add2ToGlobalVar("arcanesC2",document.getElementById('ARK3_'+i).value);
            }
        }
        Options();
    },true);

    document.getElementById('opt_del2total').addEventListener("click",function(event){
        // login des attaquables
        var tailleLogin = document.getElementsByName('login').length;
        var tmp = '';
        var sep = '|*|';
        tmp = GM_getValue(location.origin + getNameJoueur() + "adversaire_total");
        GM_setValue(location.origin + getNameJoueur() + "adversaire_total", "");
        GM_setValue(location.origin + getNameJoueur() + "PreSetAdversaire_total", "");
        GM_setValue(location.origin + getNameJoueur() + "Talisman_total", "");
        GM_setValue(location.origin + getNameJoueur() + "arcanesC0_total", "");
        GM_setValue(location.origin + getNameJoueur() + "arcanesC1_total", "");
        GM_setValue(location.origin + getNameJoueur() + "arcanesC2_total", "");
        for (i=0;i<tailleLogin; i++){
            if (document.getElementById(i).checked == false){
                tmp = GM_getValue(location.origin + getNameJoueur() + "adversaire_total");
                GM_setValue(location.origin + getNameJoueur() + "adversaire_total", tmp + document.getElementById(i).value + sep);
                Add2ToGlobalVar("PreSetAdversaire_total",document.getElementById('preset_'+i).value);
                Add2ToGlobalVar("Talisman_total",document.getElementById('talisman_'+i).value);
                Add2ToGlobalVar("arcanesC0_total",document.getElementById('ARK1_'+i).value);
                Add2ToGlobalVar("arcanesC1_total",document.getElementById('ARK2_'+i).value);
                Add2ToGlobalVar("arcanesC2_total",document.getElementById('ARK3_'+i).value);
            }
        }
        Options();
    },true);

    document.getElementById('opt_add2list').addEventListener("click",function(event){
        // login des attaquables
        var tailleLogin = document.getElementsByName('login').length;
        for (i=0;i<tailleLogin; i++){
            if (document.getElementById(i).checked){
                if(estElementDuTab("adversaire",document.getElementById(i).value)==false){
                    AddToGlobalVar("adversaire", document.getElementById(i).value);
                    Add2ToGlobalVar("PreSetAdversaire",document.getElementById('preset_'+i).value);
                    Add2ToGlobalVar("Talisman",document.getElementById('talisman_'+i).value);
                    Add2ToGlobalVar("arcanesC0",document.getElementById('ARK1_'+i).value);
                    Add2ToGlobalVar("arcanesC1",document.getElementById('ARK2_'+i).value);
                    Add2ToGlobalVar("arcanesC2",document.getElementById('ARK3_'+i).value);
                }
            }
        }
        Options();
    },true);

    document.getElementById('opt_delete2list').addEventListener("click",function(event){
        // login des attaquables
        var tailleLogin = document.getElementsByName('login').length;
        for (i=0;i<tailleLogin; i++){
            if (document.getElementById(i).checked){
                DeleteFromGlobalVar2("PreSetAdversaire",document.getElementById(i).value);
                DeleteFromGlobalVar2("Talisman",document.getElementById(i).value);
                DeleteFromGlobalVar2("arcanesC0",document.getElementById(i).value);
                DeleteFromGlobalVar2("arcanesC1",document.getElementById(i).value);
                DeleteFromGlobalVar2("arcanesC2",document.getElementById(i).value);
                DeleteFromGlobalVar("adversaire", document.getElementById(i).value);
            }
        }
        Options();
    },true);

    // import de la fonction arcanes dans la page
    document.getElementById('opt_race').addEventListener("change",function(arcanes){
        var opt = '';
        var racetmp = document.getElementById('opt_race').value;
        var ark1 = GM_getValue(location.origin + getNameJoueur() + "ark_1");
        var ark2 = GM_getValue(location.origin + getNameJoueur() + "ark_2");
        var ark3 = GM_getValue(location.origin + getNameJoueur() + "ark_3");

        if(racetmp == 1 || racetmp==4){
            document.getElementById('ark3_tr').style.visibility = "visible";
        }else{
            document.getElementById('ark3_tr').style.visibility = "hidden";
        }

        if(racetmp == 2 || racetmp == 3 || racetmp==5){
            document.getElementById('ark3a_tr').style.visibility = "visible";
        }else{
            document.getElementById('ark3a_tr').style.visibility = "hidden";
        }

        if(racetmp == 1){
            document.getElementById('ark1_txt').innerHTML   = '- '+strings[sCharisme];
            document.getElementById('ark2_txt').innerHTML   = '- '+strings[sReputation];
            document.getElementById('ark3_txt').innerHTML   = '- '+strings[sMajeste];
            document.getElementById('ark1').value       = ark1;
            document.getElementById('ark2').value       = ark2;
            document.getElementById('ark3').value       = ark3;
        }
        if(racetmp == 2){
            document.getElementById('ark1_txt').innerHTML   = '- '+strings[sSangVie];
            document.getElementById('ark2_txt').innerHTML   = '- '+strings[sAgilite];
            document.getElementById('ark3a_txt').innerHTML   = '- '+strings[sArdSang];
            document.getElementById('ark1').value       = ark1;
            document.getElementById('ark2').value       = ark2;
            if(ark3 == 1){ document.getElementById('ark3a').checked = true; }
        }
        if(racetmp == 3){
            document.getElementById('ark1_txt').innerHTML   = '- '+strings[sForce];
            document.getElementById('ark2_txt').innerHTML   = '- '+strings[sResistance];
            document.getElementById('ark3a_txt').innerHTML  = '- '+strings[sOmbreBete];
            document.getElementById('ark1').value       = ark1;
            document.getElementById('ark2').value       = ark2;
            if(ark3 == 1){ document.getElementById('ark3a').checked = true; }
        }
        if(racetmp == 4){
            document.getElementById('ark1_txt').innerHTML   = '- '+strings[sSilence];
            document.getElementById('ark2_txt').innerHTML   = '- '+strings[sAbsForce];
            document.getElementById('ark3_txt').innerHTML   = '- '+strings[sChance];
            document.getElementById('ark1').value       = ark1;
            document.getElementById('ark2').value       = ark2;
            document.getElementById('ark3').value       = ark3;
        }
        if(racetmp == 5){
            document.getElementById('ark1_txt').innerHTML   = '- '+strings[sPerception];
            document.getElementById('ark2_txt').innerHTML   = '- '+strings[sSouffle];
            document.getElementById('ark3a_txt').innerHTML  = '- '+strings[sHorreur];
            document.getElementById('ark1').value       = ark1;
            document.getElementById('ark2').value       = ark2;
            if(ark3 == 1){ document.getElementById('ark3a').checked = true; }
        }
    },true);

    document.getElementById('opt_saveAll').addEventListener("click",function(event){
        generateJson();
        alert("configuration sauvergardée sur serveur");
    },true);

    document.getElementById('opt_loadAll').addEventListener("click",function(event){
        chargerConf();
        alert("configuration chargée depuis serveur");
    },true);
}

function MajAttak(){
    GM_xmlhttpRequest({
        method: "GET",
        url: location.origin+"/?a=ambush&opt=atk",
        headers: {
            "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
            "Accept": "text/xml",           // If not specified, browser defaults will be used.
            "Cookie" : document.cookie
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
            var div = getChildAttr(content, "DIV", Array("style"), Array("margin-top: 10px;"));
            var span = getChild(div, "SPAN");
            var data = span.childNodes[2].nodeValue;
            var tab = data.split(" ");
            var b = getChild(span, "B");

            //Set Values
            GM_setValue(location.origin + getNameJoueur() + "nbAttaquesMax", parseInt(tab[2]));
            GM_setValue(location.origin + getNameJoueur() + "nbAttaquesRetantes", parseInt(b.childNodes[0].nodeValue));

            var span= document.getElementById("menuFight").getElementsByTagName("span");
            span[span.length-1].innerHTML = ""+parseInt(b.childNodes[0].nodeValue)+"/"+parseInt(tab[2]);
        }
    });
}

function dspProfile(){
    var me = getNameJoueur();
    var tab = getTab("adversaire_total");
    var myClan = GM_getValue(location.origin + getNameJoueur() + "clan");

    NOM = document.getElementsByClassName("profile-hdr")[0].innerHTML;
    nba = NOM.indexOf("Profil du vampire ", 0);
    nbb = NOM.length;
    NOM = NOM.substring(nba+18, nbb-11);

    //  Verif si la personne n'est pas du clan
    var TABLE= document.getElementsByTagName("TABLE");
    data    = TABLE[3].getElementsByTagName("TR")[3].getElementsByTagName("TD")[1].innerHTML;
    nba = data.indexOf("\">", 0);
    nbb = data.indexOf("</a>", nba);
    clanName= data.substring(nba+2, nbb);

    if ((NOM != me) && (estElementDuTab(tab, NOM)==false) && (myClan != clanName)){
        var FIELDSET    = document.getElementsByTagName("FIELDSET");
        FIELDSET[1].innerHTML = FIELDSET[1].innerHTML
            + '<a href="#" id="addPlayer" style="color: RED; font-weight: bold;">AJOUTER À LA LISTE D\'ATTAQUE</a></br >'
            + '<select class="combobox i_realm" name="opt_preset_add" id="opt_preset_add">'
            +       OptionStuff("ens_init_attack", "ENS_")
            + '</select>'
            + '<select class="combobox i_realm" name="opt_talisman_add" id="opt_talisman_add">'
            +       talismanOptions("talisman_init_attack", "TALISMAN_")
            + '</select>'
            + '<br />ARK1 <input size="1" class="inputbox" name="ARK1" type="text" id="ARK1_Add" value="'+GM_getValue(location.origin + getNameJoueur() + "ark_1", 0)+'" />'
            + ' ARK2 <input size="1" class="inputbox" name="ARK2" type="text" id="ARK2_Add" value="'+GM_getValue(location.origin + getNameJoueur() + "ark_2", 0)+'" />'
            + ' ARK3 <input size="1" class="inputbox" name="ARK3" type="text" id="ARK3_Add" value="'+GM_getValue(location.origin + getNameJoueur() + "ark_3", 0)+'" />';

        // recup des valeur et envoie a la fonction savePlayer
        document.getElementById('addPlayer').addEventListener("click",function(event){
            var ark1Add = document.getElementById("ARK1_Add").value;
            var ark2Add = document.getElementById("ARK2_Add").value;
            var ark3Add = document.getElementById("ARK3_Add").value;
            var presetAdd = document.getElementById("opt_preset_add").value;
            var talismanAdd = document.getElementById("opt_talisman_add").value;
            savePlayer(NOM, ark1Add, ark2Add, ark3Add, presetAdd, talismanAdd);
        }, true);
    }
}

function savePlayer(NOM, ark1Add, ark2Add, ark3Add, presetAdd, talismanAdd){
    var sep = '|*|';
    var tmp = '';
    var tmp2 = '';
    // Preset
    var tmp3 = '';
    var tmp4 = '';
    // Talismans
    var tmp5 = '';
    var tmp6 = '';
    // Arcanes
    var tmp7 = '';
    var tmp8 = '';
    var tmp9 = '';
    var tmp10 = '';
    var tmp11 = '';
    var tmp12 = '';

    tmp = tmp + GM_getValue(location.origin + getNameJoueur() + "adversaire","");
    tmp2 = tmp2 + GM_getValue(location.origin + getNameJoueur() + "adversaire_total","");
    GM_setValue(location.origin + getNameJoueur() + "adversaire", tmp + NOM + sep);
    GM_setValue(location.origin + getNameJoueur() + "adversaire_total", tmp2 + NOM + sep);

    tmp3 = tmp3 + GM_getValue(location.origin + getNameJoueur() + "PreSetAdversaire","");
    tmp4 = tmp4 + GM_getValue(location.origin + getNameJoueur() + "PreSetAdversaire_total","");
    GM_setValue(location.origin + getNameJoueur() + "PreSetAdversaire", tmp3 + presetAdd + sep);
    GM_setValue(location.origin + getNameJoueur() + "PreSetAdversaire_total", tmp4 + presetAdd + sep);

    tmp5 = tmp5 + GM_getValue(location.origin + getNameJoueur() + "Talisman","");
    tmp6 = tmp6 + GM_getValue(location.origin + getNameJoueur() + "Talisman_total","");
    GM_setValue(location.origin + getNameJoueur() + "Talisman", tmp5 + talismanAdd + sep);
    GM_setValue(location.origin + getNameJoueur() + "Talisman_total", tmp6 + talismanAdd + sep);

    // Arcanes
    tmp7 = tmp7 + GM_getValue(location.origin + getNameJoueur() + "arcanesC0","");
    tmp8 = tmp8 + GM_getValue(location.origin + getNameJoueur() + "arcanesC0_total","");
    GM_setValue(location.origin + getNameJoueur() + "arcanesC0", tmp7 + ark1Add + sep);
    GM_setValue(location.origin + getNameJoueur() + "arcanesC0_total", tmp8 + ark1Add + sep);

    tmp9 = tmp9 + GM_getValue(location.origin + getNameJoueur() + "arcanesC1","");
    tmp10 = tmp10 + GM_getValue(location.origin + getNameJoueur() + "arcanesC1_total","");
    GM_setValue(location.origin + getNameJoueur() + "arcanesC1", tmp9 + ark2Add + sep);
    GM_setValue(location.origin + getNameJoueur() + "arcanesC1_total", tmp10 + ark2Add + sep);

    tmp11 = tmp11 + GM_getValue(location.origin + getNameJoueur() + "arcanesC2","");
    tmp12 = tmp12 + GM_getValue(location.origin + getNameJoueur() + "arcanesC2_total","");
    GM_setValue(location.origin + getNameJoueur() + "arcanesC2", tmp11 + ark3Add + sep);
    GM_setValue(location.origin + getNameJoueur() + "arcanesC2_total", tmp12 + ark3Add + sep);

    alert(NOM + " " + strings[splayerAdded]);
}

function isBotRunningString(){
    var text = '<span style="color: red;">inactif</span>';
    if(isFightBOTRunning()==true){ text = '<span style="color: #0F0;">actif</span>'; }
    return text;
}

function dspMenuNewFight(){
    var css=GM_getValue(location.hostname + "menuFightCss","mfhide");
    var menuFightOld = '<ul style="list-style-type: none; margin: 0; text-align: center; padding: 0;">'
        + '<li class="menu"><a href="#" class="menulink" id="StartFightBot">'+strings[sStartBot]+'</a></li>'
        + '<li class="menu"><a href="" class="menulink" id="StopFightBot">'+strings[sStopBot]+'</a></li>'
        + '<li class="menu"><a href="#" class="menulink" id="OptionsFightBot">'+strings[sOptionsBot]+'</a></li>'
        + '</ul>';

    var menuFight = '<div style="padding: 5px;">'
        + '<a href="#" id="OptionsFightBot"><img src="http://torrentflux.teamvip.eu/DATA/oOBWOo/imgquest/options.png" title="'+strings[sOptionsBot]+'"></a>'
        + '<a style="margin-left: 5px;" href="" id="StopFightBot"><img src="http://torrentflux.teamvip.eu/DATA/oOBWOo/imgquest/stop.png" title="'+strings[sStopBot]+'"></a>'
        + '<a style="margin-left: 5px;" href="#" id="StartFightBot"><img src="http://torrentflux.teamvip.eu/DATA/oOBWOo/imgquest/demarrer.png" title="'+strings[sStartBot]+'"></a>'
        + '</div>';

    var menu = '<div id="menuFight" class="mfvisible"  >'
        + '<div id="menucap"class="action-caption" >BW Fight Bot</div>'
        + menuFight
        + '<div class="action-caption" style=" opacity: 0.95;">Statut</div>'
        + '<div  class="overlibText" padding:5px; text-align: center; ">'
        + 'Le BOT est ' + isBotRunningString() + '<br />'
        + '<a href="#" id="RefreshAttak"><img title="Actualiser" src="http://torrentflux.teamvip.eu/DATA/oOBWOo/actualise.png" style="width: 12px; height: 12px;" /></a>&nbsp;&nbsp;Attaques restantes <span> '+ GM_getValue(location.origin + getNameJoueur() + "nbAttaquesRetantes") + '/' + GM_getValue(location.origin + getNameJoueur() + "nbAttaquesMax")+'</pan>'
        + '</div>'
        + '</div>';

    if(document.getElementById("menuFight")){
        document.getElementById("menuFight").innerHTML = "";
    }

    var include = document.getElementsByClassName("menu")[0];
    include.innerHTML  = menu + include.innerHTML;

    // Actions
    document.getElementById('RefreshAttak').addEventListener("click",function(event){
        MajAttak();
    }, true);

    document.getElementById('StartFightBot').addEventListener("click",function(event){
        document.getElementById('StartFightBot').className="btn-stop";
        document.getElementById('StopFightBot').className="btn-play";
        Demarrer();
    }, true);

    document.getElementById('StopFightBot').addEventListener("click",function(event){
        document.getElementById('StartFightBot').className="btn-play";
        document.getElementById('StopFightBot').className="btn-stop";
        Arreter();
    }, true);

    document.getElementById('OptionsFightBot').addEventListener("click",function(event){
        Options();
    }, true);

    document.getElementById("menucap").addEventListener("click",function(event){
        if(document.getElementById('menuFight').className=="mfvisible"){
            document.getElementById('menuFight').className="mfhide";
            GM_setValue(location.hostname + "menuFightCss","mfhide");
        }

        else{
            document.getElementById('menuFight').className="mfvisible";
            GM_setValue(location.hostname + "menuFightCss","mfvisible");
        }

    }, true);
    document.getElementById('menuFight').className=css;
    if(isFightBOTRunning()){
        document.getElementById('StartFightBot').className="btn-stop";
        document.getElementById('StopFightBot').className="btn-play";
    }
    else{
        document.getElementById('StartFightBot').className="btn-play";
        document.getElementById('StopFightBot').className="btn-stop";
    }
}

function whereAmI(){
    if(estSurArcaneAttaque()){
        GM_setValue(location.origin + getNameJoueur() + "nbAttaquesMax", getNbAttaquesMax());
        GM_setValue(location.origin + getNameJoueur() + "nbAttaquesRetantes", getNbAttaquesRestantes());
    }

    if (document.getElementsByClassName("profile-hdr")[0] != undefined) { dspProfile(); }

    if(location.search.substring(0,11)=="?a=equip"){
        // enregistrement des pré-équipements
        ensSave();
    }

    if(location.search.substring(0,11)=="?a=talizman"){
        // enregistrement des pré-équipements
        talismanSave();
    }

    if (document.getElementsByClassName("clanOwner")[0] != undefined && document.getElementsByClassName("clan-desc")[0] != undefined){
        GM_setValue(location.origin + getNameJoueur() + "clan", getClan());
    }
}

/////////////////// DEBUG ///////////////////;
function test2(){
    //  chargerConf();//remplit les variables globales adversaire,etcc..
    paspremium=document.getElementsByClassName("premiumExpired")!=undefined;

}
function test(){//genere un fichier a placer dans le dossier du bot fight
    // generateJson();
    alert(estSurProfil());
}

// ------------------------------------------------------------------------------------------------
// ======================================== Commandes =============================================
// ------------------------------------------------------------------------------------------------
GM_registerMenuCommand("DFight1",  test);
GM_registerMenuCommand("DFight2",  test2);

// ------------------------------------------------------------------------------------------------
// ======================================== MAIN ==================================================
// ------------------------------------------------------------------------------------------------

if(GM_getValue(location.origin + getNameJoueur() + "nbAttaquesMax") == null || GM_getValue(location.origin + getNameJoueur() + "nbAttaquesMax") == undefined){ window.location.href = '/?a=ambush&opt=atk'; }

if(GM_getValue(location.origin + getNameJoueur() + "adversaire","")!=""){
    adversaire = getTab("adversaire");
    PreSetAdversaire=getTab("PreSetAdversaire");
    Talisman=getTab("Talisman");
    arcanesC0=getTab("arcanesC0");
    arcanesC1=getTab("arcanesC1");
    arcanesC2=getTab("arcanesC2");

}else{
    stopFightBOT();
    adversaire = '';
}

if(isFightBOTRunning()){
    runAttackBot();
}

whereAmI();
dspMenuNewFight();
