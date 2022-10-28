import IAlbum from "./album.interface";
import { Document } from "mongoose";

export default interface ITrack {
	_id: string;
	title: string;
	duration: number;
	trackNumber: number;
	trackAudio: string;
	album: IAlbum | undefined;
	image?: string;
}
