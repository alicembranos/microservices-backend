import IArtist from "./artist.interface";
import ITrack from "./track.interface";

export default interface IAlbum {
	_id: string;
	image: string;
	title: string;
	releaseDate: Date;
	totalTracks: number;
	tracks: ITrack[];
	artist: IArtist;
}
