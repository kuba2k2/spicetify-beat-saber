# spicetify-beat-saber
Beat Saber map availability plugin for Spicetify

## Description

This is a custom app for the Spotify desktop client (using Spicetify to install plugins). It provides a helpful utility for modded Beat Saber players to show BeatSaver custom map availability next to Spotify tracks.

![Screenshot](.github/screenshot.png)

**The app works on legacy Spotify versions only (1.1.56)**. Additionally, my custom [fork of Spicetify](https://github.com/kuba2k2/spicetify-legacy) is needed.

### Features
- searching tracks on BeatSaver
- map details (difficulty levels, notes per second, author, rating)
- audio preview
- bookmarking maps on BeastSaber [*]
- downloading maps directly to the Beat Saber directory [*]
- custom search query

[*] requires [spicetify-beat-saber-backend](https://github.com/kuba2k2/spicetify-beat-saber-backend) installed

### Backend usage
[spicetify-beat-saber-backend](https://github.com/kuba2k2/spicetify-beat-saber-backend) is required to bookmark maps on BeastSaber (due to CORS issues) and to download maps to Beat Saber directory. After installing, the backend can be configured in the popup menu in bottom-right corner of the Spotify client.

Refer to the backend's README for instructions on how to configure everything.

## Installation
1. Install [spicetify-legacy](https://github.com/kuba2k2/spicetify-legacy) following the instructions in the README.
2. Download the `.spa` file and `beatsaber.shim.js` from the Releases page of this repo.
3. Rename the downloaded `.spa` file to `beatsaber.spa`.
4. Copy `beatsaber.shim.js` to `~/.spicetify/Extensions` and `beatsaber.spa` file to `~/.spicetify/CustomApps` (the `~` means your home folder - c:\Users\username on Windows).
5. `spicetify config extensions beatsaber.shim.js`
6. `spicetify config custom_apps beatsaber.spa`
7. `spicetify backup` (if you hadn't done this before)
8. `spicetify apply`
9. The app should now be available in your Spotify client.

## License
MIT
