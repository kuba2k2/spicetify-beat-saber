# spicetify-beat-saber - extension source

## Models

- `Track` - wrapped Spotify track
- `TrackDB` - part of `Track` that is saved to DB
- `Map`/`MapDetail` - maps available to download; fetched from BeatSaver
- `MapOst` - maps from OST/DLC packs; loaded from bundled static JSON
- `MapLocal` - maps downloaded locally; fetched from backend API

## Pages

- `TrackPage` - `Track`->`Map` mapping dialog. `TrackHeaderOst` is for OST levels, `TrackHeaderCustom` is for everything else.
