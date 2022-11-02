"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const seed_data_1 = require("./seed-data");
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const genres = (0, seed_data_1.getSeedsGenres)();
        const artists = (0, seed_data_1.getSeedsArtists)();
        const albums = (0, seed_data_1.getSeedsAlbums)();
        const tracks = (0, seed_data_1.getSeedsTracks)();
        // await db.Genre.deleteMany({});
        // await db.Genre.create([...genres]);
        // await db.Artist.deleteMany({});
        // await db.Artist.create([...artists]);
        // await db.Album.deleteMany({});
        // await db.Album.create([...albums]);
        // await db.Track.deleteMany({});
        // await db.Track.create([...tracks]);
    });
}
exports.seedDatabase = seedDatabase;
function getRandomItem(arr = []) {
    return arr[Math.floor(Math.random() * arr.length)];
}
