# Game

# TO DO

- query die alle routes geeft uit de dataset (Marieke)
- CSV met plaatjes bij ship-id's



REVISED PITCH n.a.v. overleg gisteravond [schetsjes volgen nog maar ben bijna bij m'n afspraak :)]

## BLURB
De Heren XVII hebben op de Generale Vergadering besloten tot de bouw van een nieuw schip. Zeereizen waren levensgevaarlijk; vele bemanningsleden, maar ook vele schepen 'bleven op zee'. Een ervaren kapitein kan het verschil maken tussen leven of dood. Kan jij in deze historische 'pick your own adventure'-game genoeg ervaring opdoen om het nieuwe schip te leiden? Wat wordt jouw levensverhaal? Maak keuzes of laat via de dobbelstenen het lot bepalen op welke reizen jij aanmonstert, bouw ervaring op door de lengte en tijd die je reist, en ontdek onderweg via museumstukken, archieven en andere bronnen meer over de schepen, de mensen die aanmonsterden en de plekken die onderweg aangedaan werden. Maar pas op: niemand is onsterfelijk, en Davy Jones is altijd op zoek naar meer zieltjes....

## GAME MECHANICS
De speler heeft vijf levens. In een leven speelt de speler één keer door de centrale gameloop, waarin keuzes gemaakt moeten worden over voor welke Kamer je werkt, welke route je neemt en/of voor welke kapitein je wilt werken (wat bepaalt bij welk schip je aanmonstert). Deze opties waaruit gekozen kan worden op deze keuzemomenten worden gegenereerd uit de gecombineerde datasets. De speler kan dobbelen voor de uitkomst, of actief kiezen.

De speler heeft vier tochten de kans om 'goede keuzes' te maken, en voldoende ervaring op te doen om het nieuwe schip te leiden {= XP threshold}. Het vijfde leven is dan de maiden voyage van het nieuwe schip, waar de speler keuzes maakt {en niet kan dobbelen} met de hoop op een behouden vaart.

Tijdens de vier levens / vaarten kan de speler kiezen om meer XP te verdienen door bijvoorbeeld in een plaats van boord te gaan, en die locatie te verkennen (re: Nicolas wens om meer over bepaalde plekken te weten te komen). Dit zijn een soort 'vignetten', een kaart van een locatie met twee of drie aanklikbare plekken waar je meer over te weten kunt komen. Zodra die alledrie aangeklikt zijn eindig dit leven, en start de speler weer in de Republiek.

Er zijn dus twee uitkomsten:

De speler heeft te weinig XP verzameld. Een rivaal krijgt de positie waar jij zo op hoopte. Het is te gênant om hier te blijven. Je besluit een baan als [baan] te accepteren in [plaats], en monstert aan op de [schip]. {>> Hier komt nog een keer dezelfde gameloop kijken: heb je goed gegokt en is deze historische tocht behouden aangekomen, of kom je onderweg om?}
De speler heeft voldoende XP verzameld. Met een hoop bombarie en eerbetoon vertrekt de [naam schip] uit [plaats], met jou op het achterdek {check?}. Welke route zet je uit? {>> De speler mag kiezen uit lijsten met eindbestemmingen, en op basis van historische routes twee punten onderweg die meestal aangedaan werden. Er treed nu een ander spelmechaniek in werking: nadat de drie punten (twee onderweg + bestemming) gekozen zijn, moet de speler dobbelen tegen een vooropgezet getal. Rolt de speler gelijk aan of over dit getal? Dan gaat dat deel van de reis succesvol. Rolt de speler onder dit getal? dan gaat er onderweg iets mis. Het systeem genereert hier random een ramp uit een lijst met opties, en daar eindigt voor de speler het spel.} Als de PC meer XP verzameld heeft dan minimaal nodig was, zijn daarmee een bonus te verdienen: bijvoorbeeld dat de speler +2 bij elke rol mag optellen, of dat de speler mag dobbelen met 'advantage'. Hij maakt door meer ervaring dus meer kans op een succesvolle laatste vaart.

## WORKLOAD

### Input
[ ] Mk lijst van alle routes die gevaren zijn (beginpunt; eindpunt; coördinaten; xxx) > _Voor plotten routes op de centrale speelkaart._
  [ ] Mk lijst met vertrekplaatsen.
  [ ] Mk lijst met tussenstops.
  [ ] Mk lijst met aankomstplaatsen.
[ ] Mk lijst van alle VOC kamers (incl. coördinaten, wikidatalink, etc.)`
[ ] Mk lijst met scheepstypen en -namen.
  [ ] Vul aan met plaatjes.
[ ] Mk lijst van categorie"en van beroepen.
[ ] Mk lijst met links naar beeldmateriaal van plaatsen van VOC kamers.
[ ] Mk lijst met links naar beeldmateriaal van aanmonsteringsplaatsen die regelmatig op de routes voorkwamen (bijv. Cylon, Madagaskar, Kaap de Goede Hoop; idealieter historische kaarten, schilderijen, tekeningen...)
[ ] Mk lijst 'Murphy's Law' / 'Dumb ways to die'. = Mk setje met persoonsreconstructies / leuke aanknopingspunten. > _Basis voor badges? Iets doen met de 250 mensen die de doodsstraf gehad hebben?_
[ ] Zoek hoge resolutie reprocutie van Blaeu kaart van de VOC met CC-licentie om als centrale plattegrond te dienen.

### Front-end
- [ ] Element: kaart
- [ ] Element: badges
- [ ] Element: iconen voor schepen, locaties/places of interests, Kamers, schipbreuk, stergeval...
- [ ] Element: beroepsiconen
- [ ] Element: (geanimeerde) dobbelstenen
- [ ] Elementen: pop-up voor plaatje+tekst
- [ ] Ontwerp pagina
- [ ] Element: route schip animeren?
- [ ] Element: (geanimeerde) kaars

### Back-end
- [ ] xxx


- Een centrale pagina waar de speler naartoe kan navigeren. Eén afbeelding van een zeekaart met diverse objecten erom heen. In een overlay window links de XP en levens-trackers. In een overlay window rechts het keuzemenu en de dice tray.
- Ten minste één, idealiter twee locaties (op twee verschillende routes?) waar de speler van boord kan gaan. Elk opent een nieuwe pagina, met een historische kaart van de plaats waarop twee of drie points of interest aanklikbaar zijn. Zodra de speler alle PoI's heeft aangeklikt, sluit de pagina en wordt de speler teruggestuurd naar de centrale pagina (en begint dus aan een nieuwe reis
vanuit de Republiek).

## EXTRA WORKLOAD MAAR WEL HEEL LEUK

- (n.a.v. idee Nicolas) Badges voor de verschillende eindes. Nicolas stelde 'gezonken', 'nooit terug gegaan' of 'ziekte' voor, maar misschien ook dingen als 'I went to sea and all I got is this lousy badge', 'my first drowning', 'Rounded the Cape', etc. kunnen bedenken, een beetje (ietwat zwarte) humor?
- Elke reis wordt in een vignet (pop-up venster) één object/onderwerp uitgelicht, bijv. een object dat aan boord gebruikt had kunnen worden, of een link naar het online doorbladerbare scheepsjournaal van die reis.
- Wanneer een speler voor een bepaalde kaptein gekozen heeft, wordt een kort vignet van de carrière van deze kaptein getoond.
- De verschillende objecten die rondom de scheepskaart liggen kunnen aangeklikt worden, en dan opent een pop-up met informatie over het object en gebruik, of een link naar de collectie waar het uit afkomstig is.
- Davy Jones attacks: als de speler dobbelt om keuzes te maken, en in de vier reizen die hij maakt drie keer een één rolt, verschijnt Javy Jones en sleurt zijn ziel mee naar de locker; het spel eindigt ter plekke, game over.


## FANCY SCHMANCY (maar waarschijnlijk out of scope)

- Geanimeerde dobbelstenen.
- Een flikkerende kaars in beeld op de scheepskaart, al dan niet met daadwerkelijk schaduweffect.
- Derde locatie om van boord te gaan (op andere route).
- Meer Points of Interest op locaties om van boord te gaan.
