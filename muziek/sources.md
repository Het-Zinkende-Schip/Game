# Sources

## Sparql query to find composers

Composers
SELECT ?composer ?composerLabel ?birthDate ?deathDate WHERE {
?composer wdt:P31 wd:Q5;             # instance of human
            wdt:P106 wd:Q36834;        # occupation: composer
            wdt:P27 wd:Q55;            # country of citizenship: Netherlands
            wdt:P569 ?birthDate.       # date of birth
OPTIONAL { ?composer wdt:P570 ?deathDate. }

FILTER(?birthDate >= "1700-01-01T00:00:00Z"^^xsd:dateTime &&
        ?birthDate <  "1800-01-01T00:00:00Z"^^xsd:dateTime)

SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
ORDER BY ?birthDate


## Sources used

## Kevin MacLeod - J. S. Bach_ Toccata and Fugue in D Minor

- https://freemusicarchive.org/music/Kevin_MacLeod/Classical_Sampler/Toccata_and_Fugue_in_D_Minor

## Trio Clavecin No 1
- arr. Hans Jorgen Messerschmidt
- Friedrich Schwindl (1737-1786)
- Public domain: https://www.free-scores.com/sheetmusic?p=aa4lloK7Vn
