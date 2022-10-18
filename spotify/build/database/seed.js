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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
const index_1 = __importDefault(require("../models/index"));
const seed_data_1 = require("./seed-data");
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const genres = (0, seed_data_1.getSeedsGenres)();
        const artists = (0, seed_data_1.getSeedsArtists)();
        const albums = (0, seed_data_1.getSeedsAlbums)();
        const tracks = (0, seed_data_1.getSeedsTracks)();
        // await db.Genre.deleteMany({});
        // await db.Genre.create([...genres]);
        yield index_1.default.Artist.deleteMany({});
        yield index_1.default.Artist.create([...artists]);
        yield index_1.default.Album.deleteMany({});
        yield index_1.default.Album.create([...albums]);
        yield index_1.default.Track.deleteMany({});
        yield index_1.default.Track.create([...tracks]);
    });
}
exports.seedDatabase = seedDatabase;
function getRandomItem(arr = []) {
    return arr[Math.floor(Math.random() * arr.length)];
}
