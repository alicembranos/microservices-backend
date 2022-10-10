import ITrack from "./track.interface";

export default interface IPlaylist {
	_id: string;
	title: string;
	description: string;
	image: string;
	isPublic: boolean;
	tracks: ITrack[];
	userId: string;
}
