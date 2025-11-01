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

