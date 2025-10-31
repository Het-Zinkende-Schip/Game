import pandas as pd
import json
import searoute as sr

def searoute_wrapped(origin, destination):
    """Wrapper for sr.searoute with Suez restriction and port snapping."""
    return sr.searoute(
        origin,
        destination,
        include_ports=True,
        port_params={'only_terminals': False},
        restrictions=['suez','northwest']
    )


# Batch over your table
trips = pd.read_csv("data/reizen.csv", sep=",")
features = []
for _, r in trips.iterrows():
    route = searoute_wrapped([r.dlon, r.dlat], [r.alon, r.alat])
    coords = route["geometry"]["coordinates"]          # extract coordinate list
    feat = {
        "type": "Feature",
        "properties": {
            "dplace": r["dplace"],
            "dname": r["dname"],
            "aplace": r["aplace"],
            "aname": r["aname"],
            "dlat": float(r["dlat"]),
            "dlon": float(r["dlon"]),
            "alat": float(r["alat"]),
            "alon": float(r["alon"])
        },
        "geometry": {"type": "LineString", "coordinates": coords}
    }
    features.append(feat)

geojson_obj = {"type": "FeatureCollection", "features": features}

with open("data/routes.geojson", "w", encoding="utf-8") as f:
    json.dump(geojson_obj, f, ensure_ascii=False, indent=2)
