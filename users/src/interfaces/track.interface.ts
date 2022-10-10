import IAlbum from "./album.interface";

export default interface ITrack {
	_id: string;
	title: string;
	duration: number;
	trackNumber: number;
	trackAudio: string;
	album: IAlbum;

}
