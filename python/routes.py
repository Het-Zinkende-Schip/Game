import pandas as pd
import json
import searoute as sr

def concat_coords(segments):
    coords = []
    for i, seg in enumerate(segments):
        segc = seg["geometry"]["coordinates"]
        if i: 
            segc = segc[1:]  # drop duplicate vertex
        coords.extend(segc)
    return coords

def in_europe(lat, lon):
    return (lat >= 30) and (-25 <= lon <= 45)

def in_asia_io(lat, lon):
    return (lon >= 45) or (lon >= 20 and lat <= 0)  # east or south of Africa

cape_w = [-16.0, -35.8]
cape_e = [20.0,  -35.8]

def route_with_cape(o_lon, o_lat, d_lon, d_lat):
    # decide whether to force Cape
    force_cape = (in_europe(o_lat, o_lon) and in_asia_io(d_lat, d_lon)) or \
                (in_europe(d_lat, d_lon) and in_asia_io(o_lat, o_lon))
    legs = []

    if force_cape:
        if in_europe(o_lat, o_lon):
            legs.append(sr.searoute([o_lon, o_lat], cape_w, geometry=True))
            legs.append(sr.searoute(cape_w, cape_e, geometry=True))
            legs.append(sr.searoute(cape_e, [d_lon, d_lat], geometry=True))
        else:
            legs.append(sr.searoute([o_lon, o_lat], cape_e, geometry=True))
            legs.append(sr.searoute(cape_e, cape_w, geometry=True))
            legs.append(sr.searoute(cape_w, [d_lon, d_lat], geometry=True))
    else:
        legs.append(sr.searoute([o_lon, o_lat], [d_lon, d_lat], geometry=True))
    
    return concat_coords(legs)

# Batch over your table
trips = pd.read_csv("data/reizen.csv", sep=",")
features = []
for _, r in trips.iterrows():
    coords = route_with_cape(r.dlon, r.dlat, r.alon, r.alat)
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

with open("routes.geojson", "w", encoding="utf-8") as f:
    json.dump(geojson_obj, f, ensure_ascii=False, indent=2)
