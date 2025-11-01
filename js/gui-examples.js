  if (e.key === 'p') activateModal(
    title = "Kies je scheep",
    text = "Welke is de juiste soort?",
    choicesObject = [
      {
        'html': 'Een grote:<br/> <img src="icons/ship.png" width="300">',
        'value': 'DaShit1'
      },
      {
        'html': 'Een kleine:<br/> <img src="icons/ship.png" width="200">',
        'value': 'DaShit2'
      }
    ],
    mp3 = null,
    userChoice = true,
    canClose = false,
    callback = function(value) {

    }
  )

zoomToPlace(lng = 10, lat = 10)

hideAllInstruments()
showInstrument(4)

  const examplePlaceOptions = [
    {
      location: [0,0],
      value: "place1"
    },
        {
      location: [10,10],
      value: "place2"
    },
    {
      location: [20,20],
      value: "place3"
    }
  ]


  let activeMarkers = [];

  function activatePlaceChoiceMarkers(placeOptions = [], callback = v => console.log('User chose:', v)) {
    // remove any existing markers first
    activeMarkers.forEach(m => m.remove());
    activeMarkers = [];

    placeOptions.forEach(opt => {
      const el = document.createElement('img');
      el.src = 'icons/anker-icon.png';
      el.style.width = '4em';
      el.className = 'place-marker';
 
      el.addEventListener('click', () => {
        callback(opt.value);
        // remove all markers after a selection
        activeMarkers.forEach(m => m.remove());
        activeMarkers = [];
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(opt.location)
        .addTo(map);      
      activeMarkers.push(marker);
    }
    
    );


    for(i=0;i<placeOptions.length;i++) {
      new maplibregl.Marker({element: el})
      .setLngLat([4.9, 52.37])
      .addTo(map);
    }
  }

  hideAllInstruments()
  showInstrument(4)
  activatePlaceChoiceMarkers(examplePlaceOptions)

  let kaars_id="candle-wrapper";


// je kan muziek afspelen met playMP3; wij hebben een paar: deathTune herhaald niet de  andere wel.
document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === '1') playMP3(suspenseLoop);
    if (e.key.toLowerCase() === '2') playMP3(deathTune);
    if (e.key.toLowerCase() === '3') playMP3(strudel1);
    if (e.key.toLowerCase() === '4') playMP3(strudel2);
    if (e.key.toLowerCase() === '5') playMP3(schwindl);
    if (e.key.toLowerCase() === '0') hushMP3();
  });
