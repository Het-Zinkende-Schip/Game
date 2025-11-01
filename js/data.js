const sparqlEndpointVOC='https://qlever.coret.org/voc';
const sparqlEndpointMASS='https://qlever.coret.org/mass';
const sparqlEndpointWikidata='https://query.wikidata.org/sparql';


function get_lijst_vertrekhavens(bekerking) {
	// beperking="NL", geen beperking="ook buiten NL"
	// returns array of (max 25) places: place_uri, place_name, long, lat
	
	const sparql = `
		# http://yasgui.org/short/MHcZmpPbBX

		PREFIX hzs: <http://data.hetzinkendeschip.nl#>
		PREFIX schema: <https://schema.org/>
		PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

		SELECT ?departurePlace ?placeId ?latitude ?longitude
		WHERE {
		VALUES ?onlyNL { true }   # zet op false om de hele wereld te tonen

		?voyage hzs:departurePlace ?departurePlace .
		?placeId a schema:Place ;
					schema:geo ?geo ;
					schema:name ?departurePlace .
		?geo schema:latitude ?latitude ;
				schema:longitude ?longitude .

		FILTER(STRSTARTS(STR(?placeId), "http://data.hetzinkendeschip.nl/id/place/"))

		# filter als onlyNL true is
		FILTER(
			!?onlyNL ||
			(xsd:decimal(?latitude) >= 50.7 && xsd:decimal(?latitude) <= 53.7 &&
			xsd:decimal(?longitude) >= 3.3 && xsd:decimal(?longitude) <= 7.3)
		)
		}
		ORDER BY ?departurePlace
	`;

	const resultaten = await do_sparql(sparql,sparqlEndpointVOC);
	return resultaten;	
}

function get_lijst_reizen(vertrekplaats_uri) {
	// let op: ook reizen waar het schip is gezonken
	// returns array of (max 25) voyages starting in vertrekplaats: voyageID, scheepsnaam, scheeptype, image_url, laadvermogen, bemanning_grootte, duur_in_dagen, arrivalDate
	
	const sparql = `
		# http://yasgui.org/short/tc3E8bUt4L
		PREFIX hzs: <http://data.hetzinkendeschip.nl#>
		PREFIX schema: <https://schema.org/>
		PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

		#	// returns array of (max 25) voyages starting in vertrekplaats: voyageID, scheepsnaam, scheeptype, image_url, laadvermogen, bemanning_grootte, duur_in_dagen, arrivalDate


		SELECT ?voyageID ?departurePlace ?scheepsnaam ?scheepstype ?laadvermogen 
				?departureDate ?arrivalDate ?image_url ?bemanning_grootte ?duur_in_dagen
		WHERE {
		
			VALUES ?departurePlace { "Texel" }

			?voyageID hzs:departurePlace ?departurePlace .
			OPTIONAL { ?voyageID hzs:shipName ?scheepsnaam . }
			OPTIONAL { ?voyageID hzs:typeOfShip ?scheepstype . }
			OPTIONAL { ?voyageID hzs:shipTonnage ?laadvermogen . }

			OPTIONAL { ?voyageID hzs:departureDate ?departureDate. }
			OPTIONAL { ?voyageID hzs:arrivalDate ?arrivalDate. }

			BIND("https://www.hetzinkendeschip.nl/images/image.jpg" AS ?image_url)
			BIND("bemanning_grootte" AS ?bemanning_grootte)

			BIND(IF(BOUND(?arrivalDate), STR(?arrivalDate), "") AS ?arrivalStr)
			BIND(IF(BOUND(?departureDate), STR(?departureDate), "") AS ?departureStr)

			BIND(xsd:integer(SUBSTR(?arrivalStr, 1, 4)) AS ?jaarA)
			BIND(xsd:integer(SUBSTR(?departureStr, 1, 4)) AS ?jaarD)
			BIND(xsd:integer(SUBSTR(?arrivalStr, 6, 2)) AS ?maandA)
			BIND(xsd:integer(SUBSTR(?departureStr, 6, 2)) AS ?maandD)
			BIND(xsd:integer(SUBSTR(?arrivalStr, 9, 2)) AS ?dagA)
			BIND(xsd:integer(SUBSTR(?departureStr, 9, 2)) AS ?dagD)

			# dingen kunnene null zijn
			BIND(COALESCE(?jaarA, 0) AS ?jaarA0)
			BIND(COALESCE(?jaarD, 0) AS ?jaarD0)
			BIND(COALESCE(?maandA, 0) AS ?maandA0)
			BIND(COALESCE(?maandD, 0) AS ?maandD0)
			BIND(COALESCE(?dagA, 0) AS ?dagA0)
			BIND(COALESCE(?dagD, 0) AS ?dagD0)
		
			BIND(
				IF(
				BOUND(?arrivalDate) && BOUND(?departureDate),
				((?jaarA0 - ?jaarD0) * 365) +
				((?maandA0 - ?maandD0) * 30) +
				(?dagA0 - ?dagD0),
				""
				)
				AS ?duur_in_dagen
			)

		}
		ORDER BY ?voyageID
	`;

	const resultaten = await do_sparql(sparql,sparqlEndpointVOC);
	return resultaten;	
}

function get_lijst_bemanning(voyage_id) {
	// returns array of max (25) personsclusters (where #personobservations > 3) on voyage_id: persoonscluster_uri, naam

	const sparql = `
	`;

	const resultaten = await do_sparql(sparql,sparqlEndpointVOC);
	return resultaten;	
}

function get_levensloop(persoonscluster_uri) {
	// returns array of voyages of person: naam, functie, vertrek_datum, vertrek_plaats, aankomst_datum, aankomst_plaats, redenEindecontract
	const sparql = `
	`;

	const resultaten = await do_sparql(sparql,sparqlEndpointVOC);
	return resultaten;	
}

function get_random object() {
	// returns object_title, iiif_image_uri, description
}

// Algemene functie om een SPARQL-query uit te voeren en resultaten als JavaScript-objecten terug te geven
async function do_sparql(sparql, endpoint) {
  const url = endpoint + "?query=" + encodeURIComponent(sparql);
  const headers = { 
    "Accept": "application/sparql-results+json",
    "User-Agent": "Het Zinkende Schip/0.1 (https://github.com/Het-Zinkende-Schip/)"
  };

  // Verstuur de query naar het SPARQL-endpoint
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`SPARQL-query mislukt: ${response.status} ${response.statusText}`);
  }

  // Ontvang de resultaten in JSON-formaat
  const data = await response.json();

  // Zet de bindings om in een eenvoudige JS-array van objecten
  const results = data.results.bindings.map(binding => {
    const row = {};
    for (const [key, value] of Object.entries(binding)) {
      row[key] = value.value;
    }
    return row;
  });

  return results;
}
