import db from "../models/index";
import {getSeedsArtists, getSeedsAlbums, getSeedsTracks } from "./seed-data";

async function seedDatabase() {
	const artists = getSeedsArtists();
	const albums = getSeedsAlbums();
	const tracks = getSeedsTracks();

	await db.Artist.deleteMany({});
	await db.Artist.create([...artists]);
	await db.Album.deleteMany({});
	await db.Album.create([...albums]);
	await db.Track.deleteMany({});
	await db.Track.create([...tracks]);
}

function getRandomItem(arr = []) {
	return arr[Math.floor(Math.random() * arr.length)];
}

export { seedDatabase };
