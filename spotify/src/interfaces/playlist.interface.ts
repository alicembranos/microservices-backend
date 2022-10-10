import ITrack from "./track.interface";

export default interface IPlaylist {
	title: string;
	description: string;
	image: string;
	isPublic: boolean;
	tracks: ITrack[];
	userId: string;
	//year get by timestamp createdAt field
}
