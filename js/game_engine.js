
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
		stage++;
		toon_keuze_dialoog_vertrekhaven(havens);
		break;

	 case 2:
		console.log("Stage 2: Leg markers uit > "+dialog_uri);

		haven_uri=dialog_uri;

		//const place_name = havens.find(haven => haven.placeId).departurePlace;
		const place_name = "test";
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
		if (guessedPlaceUri==haven_uri) {
			toon_dialoog_minigame_plaats_goed();
		} else {
			toon_dialoog_minigame_plaats_fout();			
		}
		break;

	case 5:
		console.log("Stage 5: Vertrekhaven gekozen, zoom naar plaats"+dialog_uri);
		//departurePlaceUri=dialog_uri;
		const { lon, lat } = get_lon_lat(havens,haven_uri);
		console.log(lon, lat);
		stage++;
		//gui_zoom_to_plaats(lon, lat);
		//break;
		stage++;

	case 6:
		console.log("Stage 6: Kies scheepstype (eigenlijk voyage)");
		voyages=await get_lijst_reizen(haven_uri);
		console.log(voyages);
		scheeptypen=get_unieke_scheepstypen(voyages);
		console.log(scheeptypen);
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
		choicesObject = havens.slice(0,6).map(haven => ({ 'html': haven.departurePlace, 'value': haven.placeId })),
		mp3 = null,
		userChoice = true,
		canClose = false,
		callback = game_play
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
		title = "Schaduwkant",
		text = "In de periode dat de Verenigde Oostindische Compagnie (VOC) van 1602 t/m 1795 actief was, had het bedrijf een handelsmonopolie voor het gebied ten oosten van Kaap de Goede Hoop tot de Straat Magalhaen. Dit betekende dat de organisatie een leger mocht hebben, en diplomatieke contacten met lokale en regionale bestuurders onderhield. <br> In het streven naar het maken van zoveel mogelijk winst, zette de VOC deze middelen veelvuldig in, met alle gevolgen van dien. Er waren dwangconstructies waarbij lokale bevolking bijv. een bepaald quota koffie per periode moest leveren, die met (extreem) geweld gehandhaafd werden. Ook werd er, indien deze praktijk al in de regio aanwezig was, gebruik gemaakt van tot slaaf gemaakten ('lijfeigenen' genoemd). Graag verwijzen we naar een aantal bronnen waar u meer kunt lezen over deze verschillende facetten van deze historische organisatie. <br> <a href>https://www.vocsite.nl/geschiedenis/slavernij/</href> <br><a href>https://www.zeeuwsarchief.nl/zoekgids/onderzoek-naar-de-voc/</href>",
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
		text = "De wetenschap en techniek om geografische informatie te visualiseren met behulp van kaarten wordt cartografie genoemd. De maker van zo'n kaart heet een cartograaf. Er is niet één 'perfecte' of 'juiste' kaart van een gebied; kaarten worden altijd gemaakt met een bepaalde doelgroep in gedachten, en de interpretatie van de data die ze overbrengen is dus altijd in een mate gekleurd. Dit zien we bijvoorbeeld terugkomen in elementen als de keuze wat centraal afgebeeld is op de kaart, welke projectie gebruikt is, wat wel en niet geduid is, etc. Wil je meer te weten komen over dit vakgebied? Bekijk dan het werk van dr. Marco van Egmond <a href>https://uu.academia.edu/MarcovanEgmond</href> of lees dit artikel <a href>https://www.sg.uu.nl/artikelen/2021/02/de-fantasieen-fouten-en-vaardigheden-van-vroegere-kaartenmakers</href>",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = true,
		callback = null
	)	
}

function toon_uitleg_markers(place_name) {
	console.info("toon uitleg markers voor plaats: "+place_name);
	console.info(activateModal);
	activateModal(
		title = "Weet je waar deze haven van "+place_name+" ligt?",
		text = "klik zo op een marker op de kaart om de locatie van de haven aan te geven.",
		choicesObject = [{
        'html': 'verder',
        'value': ''
      }],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = game_play
	);
	console.info(document.getElementById("myModal").style.display);
	setTimeout(() => {
	console.info("Forcing modal display after timeout");
	document.getElementById("myModal").style.display = "block";   
  }, 500);
//	modal.style.setProperty('display', 'block', 'important');
}

function toon_dialoog_minigame_plaats_goed() {
	activateModal(
		title = "Goede plaats gekozen!",
		text = "Ja, dat klopt! ",
		choicesObject = [ {'html': 'verder', 'value': '' } ],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = game_play
	)
}

function show_minigame_plaats(havens) {
	//	haven_uri is gekozen haven, nog max 5 random havens erbij tonen
	//  add markers, array van lat,lon 
console.table(havens);	
	const placeOptions = havens
//	.filter(haven => !haven.placeId) // keep only items without placeId
	.map(haven => ({
		value: haven.placeId,
		location: [haven.longitude, haven.latitude]
	})).slice(0,5);

	console.table(placeOptions);	

	activatePlaceChoiceMarkers(placeOptions , game_play);
};

function toon_dialoog_minigame_plaats_fout() {
	activateModal(
		title = "Foute plaats gekozen!",
		text = "Helaas, dat klopt niet. {Plaats} ligt hier # navigeer naar plaats",
		choicesObject = [ {'html': 'verder', 'value': '' } ],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = game_play
	)
}

function toon_keuze_dialoog_scheepstype(voyages, scheeptypen) {
	//		show_minigame_scheepstype (3 afbeeldingen tonen, Laadvermogen, 	bemanning)
console.log(scheeptypen);
	activateModal(
		title = "Kies je schip",
		text = "Er zijn verschillende schepen vanuit deze haven vertrokken, bij welk schip monster jij aan?",
		choicesObject = scheeptypen.map(scheeptype => (
			{ 'html': scheeptype.scheeptype+'<br><img src="/images/scheepstypen/'+scheeptype.scheepstype+'.jpg"/>', 'value': scheeptype.uri })),
		mp3 = null,
		userChoice = true,
		canClose = false,
		callback = game_play
	)
}

function toon_keuze_bemanningslid(bemanning) {
	activateModal(
		title = "Kies een bemanningslid",
		text = "Welk bemanningslid wil je schaduwen?",
		choicesObject = bemanning.map(persoon => ({ 'html': persoon.naam, 'value': persoon.persoonscluster_uri })),
		mp3 = null,
		userChoice = true,
		canClose = false,
		callback = game_play
	)
}	

function toon_levensloop_reizen(levensloop) {
	activateModal(
		title = "Levensloop van bemanningslid {naam}",
		text = "Je treft {naam} op deze reis aan boord van {schip}, maar dankzij de beschikbaar gemaakte datasets weten we een aantal elementen van zijn verdere carrière:", 
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = true,
		callback = game_play
	)	
}

function toon_dialoog_minigame_scheeptype_goed() {
	activateModal(
		title = "Goede scheepstype gekozen!",
		text = "Ja, dat klopt!",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = game_play
	)
}

function toon_dialoog_minigame_scheeptype_fout() {
	activateModal(
		title = "Foute scheepstype gekozen!",
		text = "Helaas, dat klopt niet. Jij koos een +type_fout+. De correcte afbeelding is {afbeelding}.",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = game_play
	)
}

function toon_scheepskist(object_title, iiif_image_uri, description) {
	activateModal(
		title = "Nieuw item voor in je scheepskist!",
		text = "Er waren allerlei objecten aan boord, bijvoorbeeld: ...",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = game_play
	)	
}

function toon_extra_cartografische_instrument(reis) {
	gui_show_instrument(reis);
	game_play
}

function toon_einde_reis() { // hoe lang erover gedaan, aanzetten tot nog een reis
	activateModal(
		title = "Einde van de reis!",
		text = "Je bent na {x} dagen veilig aangekomen, gefeliciteerd. Met de ervaring die je deze reis opgedaan hebt, verdien je een volgende gereedschap voor je cartografische gereedschapskist. Wat wordt jouw volgende reis?", 
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = true,
		callback = game_play
	)	
}

function end_of_game() { // dialoog die spel stopt, enige optie is F5 om nieuwe game te starten
	activateModal(
		title = "Einde van het spel!",
		text = "Oh nee, het schip is gezonken. Game over. Druk op F5 om het spel opnieuw te starten.",
		choicesObject = [],
		mp3 = null,
		userChoice = false,
		canClose = false,
		callback = null
	)
}

// helpers

function get_lon_lat(havens,departurePlaceUri) {
	console.table(havens);
	console.log("get_lon_lat for URI: "+departurePlaceUri);	
  // Find the haven with the matching URI
  const found = havens.find(haven => haven.placeId === departurePlaceUri);

  // If found, return its lon and lat
  if (found) {
	console.log("Found haven:", found);
    return ({ lon: found.lon, lat: found.lat });
  }
	console.log("Found not haven:");

  // If not found, return null (or you could throw an error)
  return null;
}

function get_unieke_scheepstypen(voyages) {
  const uniqueMap = new Map();
console.log(voyages);
  for (const v of voyages) {
    // Only add if we haven’t seen this scheepstype before
    if (!uniqueMap.has(v.scheepstype)) {
      uniqueMap.set(v.scheepstype, { uri: v.voyageId,  scheepstype: v.scheepstype, image_url: v.image_url });
    }
  }

  // Convert the Map values back into an array
  return Array.from(uniqueMap.values());
}

// gui

function gui_zoom_to_plaats(lon, lat) {
	// verplaats de kaart naar naar coördinaat
}
