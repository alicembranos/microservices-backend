import IAlbum from "./album.interface";
import ITrack from "./track.interface";

export default interface IArtist {
	_id: string;
	image: string;
	followers: number;
	name: string;
	popularity: number;
	genres: string[];
	tracks: ITrack[];
	albums: IAlbum[];
}