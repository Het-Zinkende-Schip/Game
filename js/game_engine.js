
var stage=1;
var reis=0;
var departurePlaceUri;
var voyageScheepstype;

gui_init();	// initialiseer spelbord (kaart tekening, dobbelstenen, brandende kaars, puntpasser + 4 instrumentplekken)

toon_startscherm();

let kaars_id="kaars";				// identifier van de div in gui
let puntpasser_id="puntpasser";		// identifier van de div in gui
let dobbelsteen_id="dobbelsteen";	// identifier van de div in gui
	
document.getElementById(kaars_id).addEventListener("click", function() {
  toon_kaars();
});
document.getElementById(puntpasser_id).addEventListener("click", function() {
  toon_puntpasser();
});
document.getElementById(dobbelsteen_id).addEventListener("click", function() {
  game_play();
});

function game_play(dialog_uri) {

	switch (stage) {
	  case 1:
		console.log("Stage 1: Kies vertrekhaven");

//		plaats_uri=keuze_vertrekhaven (6 willekeurige havens tonen, dobbelsteen bepaald vertrekhaven)
		if (reis==1) {
			havens=get_lijst_vertrekhavens("NL");
		} else {
			havens=get_lijst_vertrekhavens("all");
		}
		stage++;
		toon_keuze_dialoog_vertrekhaven(havens);
		break;
		
	 case 2:
		console.log("Stage 2: Vertrekhaven gekozen");
		const departurePlaceUri=dialog_uri;
		const { lon, lat } = get_lon_lat(havens,departurePlaceUri);
		stage++;
		gui_zoom_to_plaats(lon, lat);
		break;
		
	 case 3:
		console.log("Stage 3: Minigame vertrekhavens");
//		show_minigame_plaats (kan punten opleveringen voor score, 3 google maps met coordinaten, welke is de vertrekplaats)
//		toon_dialoeg_goed / toon_dialoog_fout
		stage++;
		show_minigame_plaats(havens);
		break;
		
	case 4:
		console.log("Stage 4: Minigame resultaat");
		const guessedPlaceUri=dialog_uri;
		stage++;
		if (guessedPlaceUri==departurePlaceUri) {
			toon_dialoog_minigame_plaats_goed();
		} else {
			toon_dialoog_minigame_plaats_fout();			
		}
//		toon_speelbord
		break;
	case 5:
		console.log("Stage 5: Kies scheepstype (eigenlijk voyage)");

		voyages=get_lijst_reizen(departurePlaceUri);
		scheeptypen=unieke_scheepstypen(voyages);
//		schip_uri=keuze_scheepsnaam (plaats_uri + schip_uri > voyageId) - kan ook gezonken zijn 
		stage++;
		toon_keuze_dialoog_vertrekhaven(voyages, scheeptypen);
		break;
		
	case 6: 
		console.log("Stage 6: Minigame scheepstype");
	
		const voyageUri = dialog_uri;
		voyageScheepstype=get_scheeptype(voyageId);
		
//		show_minigame_scheepstype (3 afbeeldingen tonen, Laadvermogen, 	bemanning)

		show_minigame_scheepstype(scheeptypen);
		
	case 7:
		console.log("Stage 6: Minigame resultaat");
	
		const guessedScheepstype=dialog_uri;
		stage++;
//		toon_dialoog_goed / toon_dialoog_fout
		if (guessedScheepstype==voyageScheepstype) {
			toon_dialoog_minigame_scheeptype_goed();
		} else {
			toon_dialoog_minigame_scheeptype_fout();			
		}

//		toon_speelbord
		break;
	  case 8:
		console.log("Stage 8: Kies bemanningslid");
//		persoon_uri=keuze_persoon (is aan gekomen / is overleden)

	  case 9:
		console.log("Stage 8: Toon levensloop");
//		toon_levensloop_reizen(persoon_uri) -  button "ga aan boord"

	  case 10:
		console.log("Stage 10: Start reis");
//		toon_reis_animatie(voyageId) - tot halverwege

	  case 11:
		console.log("Stage 11: Scheepskist");
		stage++;
//		toon_scheepskist ( image game )
		toon_scheepskist();
		break;
		
	  case 12:
		console.log("Stage 12: Naar aankomsthaven of gezonken");
		stage++;
//		- vervolg_animatie_naar_arrivalplace
//		of
		stage=20;
//		- toon_zinkend_schip > end-of-game (f5)
		break;
		
	  case 13:
		console.log("Stage 13: Bestemming bereikt");
		stage++;
		toon_einde_reis();	// wellicht game
		break;
		
	  case 14:
		console.log("Stage 14: extra cartografisch instrument");
		stage++;
		toon_extra_cartografische_instrument(reis);
		break;
		
	  case 15:
		console.log("Stage 15: reset loop");
		reis++;
		stage=1;
		break;

	  case 20:
		console.log("Stage 20: End-of-game");	
		end_of_game();
		break;
		
	  default:
		console.log("Unknown stage");
	}
}


function toon_keuze_dialoog_vertrekhaven(havens) {
	// open dialoog, resultaat is place_uri
}

function toon_startscherm() {
	// open dialog met intro tekst + plaatje + button "start de reis", opening tune?
}

function toon_kaars() {
	// open dialog met disclaimer, schaduwkant belichting
}

function toon_puntpasser() {
	// open dialog met uitleg cartografie
}

function toon_dialoog_minigame_plaats_goed() {
}

function toon_dialoog_minigame_plaats_fout() {
	
}

function toon_keuze_dialoog_vertrekhaven(voyages) {
	
}

function toon_dialoog_minigame_scheeptype_goed() {
}

function toon_dialoog_minigame_scheeptype_fout() {
	
}

function toon_scheepskist() {
	
}

function toon_extra_cartografische_instrument(reis) {

}

function toon_einde_reis() { // hoe lang erover gedaan, aanzetten tot nog een reis
	
}

function end_of_game() { // dialoog die spel stopt, enige optie is F5 om nieuwe game te starten

}


// helpers

function get_lon_lat(havens,departurePlaceUri) {
  // Find the haven with the matching URI
  const found = havens.find(haven => haven.uri === departurePlaceUri);

  // If found, return its lon and lat
  if (found) {
    return { lon: found.lon, lat: found.lat };
  }

  // If not found, return null (or you could throw an error)
  return null;
}

function get_unieke_scheepstypen(voyages) {
  const uniqueMap = new Map();

  for (const v of voyages) {
    // Only add if we haven’t seen this scheepstype before
    if (!uniqueMap.has(v.scheepstype)) {
      uniqueMap.set(v.scheepstype, { scheepstype: v.scheepstype, image_url: v.image_url });
    }
  }

  // Convert the Map values back into an array
  return Array.from(uniqueMap.values());
}

// gui

function gui_zoom_to_plaats(lon, lat) {
	// verplaats de kaart naar naar coördinaat
}
