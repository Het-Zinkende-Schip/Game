
var stage=1;
var reis=0;
var departurePlaceUri;
var voyageScheepstype;
var voyages;
var scheeptypen;
var havens;
var voyageId;
var voyageUri;
var persoon_uri;
var bemanning;
var haven_uri;
var guessedPlaceUri;

console.log("Game engine loaded");
//gui_init();	// resets spelbord (kaart tekening, dobbelstenen, brandende kaars, puntpasser + 4 instrumentplekken)

toon_startscherm();

document.getElementById(kaars_id).addEventListener("click", function() {
//	document.getElementById("puntpasser").addEventListener("click", function() {
//		document.getElementById("dobbelsteen").addEventListener("click", function() {
			game_play();
//		});
//		toon_puntpasser();
//	});
//	toon_kaars();
});

async function game_play(dialog_uri) {

	switch (stage) {
	  case 1:
		console.log("Stage 1: Kies je vertrekhaven");
		if (reis==1) {
			havens=await get_lijst_vertrekhavens("NL");
		} else {
			havens=await get_lijst_vertrekhavens("all");
		}
		console
		stage++;
		toon_keuze_dialoog_vertrekhaven(havens);
		break;

	 case 2:
		console.log("Stage 2: Leg markers uit");
		haven_uri=dialog_uri;
		const place_name = havens.find(haven => haven.uri === haven_uri).naam;
		stage++;
		toon_uitleg_markers(place_name);
		break;

	 case 3:
		console.log("Stage 3: Minigame vertrekhavens");
		stage++;
		show_minigame_plaats(havens);
		break;
		
	case 4:
		console.log("Stage 4: Minigame resultaat");
		guessedPlaceUri=dialog_uri;
		stage++;
		if (guessedPlaceUri==departurePlaceUri) {
			toon_dialoog_minigame_plaats_goed();
		} else {
			toon_dialoog_minigame_plaats_fout();			
		}
		break;

	case 5:
		console.log("Stage 5: Vertrekhaven gekozen, zoom naar plaats");
		departurePlaceUri=dialog_uri;
		const { lon, lat } = get_lon_lat(havens,departurePlaceUri);
		stage++;
		gui_zoom_to_plaats(lon, lat);
		break;

	case 6:
		console.log("Stage 6: Kies scheepstype (eigenlijk voyage)");
		voyages=get_lijst_reizen(departurePlaceUri);
		scheeptypen=get_unieke_scheepstypen(voyages);
		stage++;
		toon_keuze_dialoog_scheepstype(voyages, scheeptypen);
		break;
		
	case 7: 
		console.log("Stage 7: Minigame scheepstype");
		stage++;
		voyageUri = dialog_uri;
		voyageScheepstype=get_scheeptype(voyageId);
		show_minigame_scheepstype(scheeptypen);
		break;

	case 8:
		console.log("Stage 8: Minigame resultaat");
		const guessedScheepstype=dialog_uri;
		stage++;
		if (guessedScheepstype==voyageScheepstype) {
			toon_dialoog_minigame_scheeptype_goed();
		} else {
			toon_dialoog_minigame_scheeptype_fout();			
		}
//		toon_speelbord
		break;

	  case 9:
		console.log("Stage 9: Kies bemanningslid");
		bemanning= get_lijst_bemanning(voyage_id)
		toon_keuze_bemanningslid(bemanning);
		stage++;
		break;	

	  case 10:
		console.log("Stage 10: Toon levensloop");
		persoon_uri=dialog_uri;
		stage++;
		levensloop=get_levensloop(persoon_uri);
		toon_levensloop_reizen(levensloop);
		break;

	  case 11:
		console.log("Stage 11: Start reis");
		const { departurePlaceUri, arrivalPlaceUri } = get_voyage_places(voyageId);
		stage++;
		start_reis_animatie(voyageId); // TODO: naam in GUI code
		break;

	  case 12:
		console.log("Stage 12: Scheepskist");
		stage++;
		const { object_title, iiif_image_uri, description } = get_random_object();
		toon_scheepskist(object_title, iiif_image_uri, description);
		break;
		
	  case 13:
		console.log("Stage 13: Naar aankomsthaven of gezonken");
		stage++;
		// todo controleer of schip gezonken is
		vervolg_animatie_naar_arrivalplace(); // TODO: naam in GUI code
//		of
//		stage=20;
//		- toon_zinkend_schip > end-of-game (f5)
		break;
		
	  case 14:
		console.log("Stage 14: Bestemming bereikt");
		stage++;
		toon_einde_reis();	// wellicht game
		break;
		
	  case 15:
		console.log("Stage 15: extra cartografisch instrument");
		stage++;
		toon_extra_cartografische_instrument(reis);
		break;
		
	  case 16:
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
	activateModal(
		title = "Kies je vertrekhaven",
		text = "Vanuit welke haven wil je vertrekken?",
		choicesObject = havens.slice(0,6).map(haven => ({ 'html': haven.departurePlace, 'value': haven.departurePlaceUri })),
		mp3 = null,
		userChoice = true,
		canClose = false,
		callback = game_play()
	)
}

function toon_startscherm() {
	// open dialog met intro tekst + plaatje + button "start de reis", opening tune?
	activateModal(
		title = "Welkom bij het Zinkende Schip!",
		text = "Welkom bij <i>Het Zinkende Schip</i>, cartograaf! In dit point-en-click spel monster je als leerling cartograaf aan bij verschillende VOC reizen. Terwijl je aan boord een historisch persoon schaduwt, en op basis van data uit onder andere Maritime Stepping Stones (MaSS), het Huygens instituut en het Nationaal Archief, verdien jij je cartografie-gereedschappen. Wat leer jij onderweg? En lukt het je op te klimmen van leerling naar gezel?",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = true,
		callback = null
	)
}

function toon_kaars() {
	// open dialog met disclaimer, schaduwkant belichting
	activateModal(
		title = "De schaduwkant van het Zinkende Schip!",
		text = "intro....",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = true,
		callback = null
	)
}

function toon_puntpasser() {
	// open dialog met uitleg cartografie
	activateModal(
		title = "Over cartografie",
		text = "intro....",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = true,
		callback = null
	)	
}

function toon_uitleg_markers(place_name) {
	activateModal(
		title = "Weet je waar deze haven van "+place_name+" ligt?",
		text = "klik zo op een marker op de kaart om de locatie van de haven aan te geven.",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = game_play()
	)	
}

function toon_dialoog_minigame_plaats_goed() {
	activateModal(
		title = "Goede plaats gekozen!",
		text = "intro....",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = game_play()
	)
}

function show_minigame_plaats(havens) {
	//	haven_uri is gekozen haven, nog max 5 random havens erbij tonen
	//  add markers, array van lat,lon 

	const placeOptions = havens
	.filter(haven => !haven.placeId) // keep only items without placeId
	.map(haven => ({
		value: haven.placeId,
		longitude: haven.longitude,
		latitude: haven.latitude
	})).slice(0,5);

	activatePlaceChoiceMarkers(placeOptions = [], game_play());
};

function toon_dialoog_minigame_plaats_fout() {
	activateModal(
		title = "Foute plaats gekozen!",
		text = "intro....",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = game_play()
	)
}

function toon_keuze_dialoog_scheepstype(voyages, scheeptypen) {
	//		show_minigame_scheepstype (3 afbeeldingen tonen, Laadvermogen, 	bemanning)

	activateModal(
		title = "Kies je schip",
		text = "Op welk schip wil je varen?",
		choicesObject = scheeptypen.map(scheeptype => (
			{ 'html': scheeptype.naam+'<br><img src="'+scheeptype.iiif_image_uri+'" alt="'+scheeptype.naam+'"/>', 'value': scheeptype.uri })),
		mp3 = null,
		userChoice = true,
		canClose = false,
		callback = game_play()
	)
}

function toon_keuze_bemanningslid(bemanning) {
	activateModal(
		title = "Kies een bemanningslid",
		text = "Welk bemanningslid wil je volgen?",
		choicesObject = bemanning.map(persoon => ({ 'html': persoon.naam, 'value': persoon.persoonscluster_uri })),
		mp3 = null,
		userChoice = true,
		canClose = false,
		callback = game_play()
	)
}	

function toon_levensloop_reizen(levensloop) {
	activateModal(
		title = "Levensloop van bemanningslid {naam}",
		text = "lijst van reizen TODO....",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = true,
		callback = game_play()
	)	
}

function toon_dialoog_minigame_scheeptype_goed() {
	activateModal(
		title = "Goede scheepstype gekozen!",
		text = "intro....",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = game_play()
	)
}

function toon_dialoog_minigame_scheeptype_fout() {
	activateModal(
		title = "Foute scheepstype gekozen!",
		text = "intro....",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = game_play()
	)
}

function toon_scheepskist(object_title, iiif_image_uri, description) {
	activateModal(
		title = "Nieuw item voor in je scheepskist!",
		text = "intro....",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = game_play()
	)	
}

function toon_extra_cartografische_instrument(reis) {
	gui_show_instrument(reis);
	game_play
}

function toon_einde_reis() { // hoe lang erover gedaan, aanzetten tot nog een reis
	activateModal(
		title = "Einde van de reis!",
		text = "Je hebt deze reis succesvol afgerond, het duurde x dagen, op naar de volgende reis voor nog meer ervaring op te doen.",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = true,
		callback = game_play()
	)	
}

function end_of_game() { // dialoog die spel stopt, enige optie is F5 om nieuwe game te starten
	activateModal(
		title = "Einde van het spel!",
		text = "Schip gezonken, einde van het spel. F5 om opnieuw te starten.",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = null
	)
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
