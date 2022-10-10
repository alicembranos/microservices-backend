import IAlbum from "./album.interface";
import ITrack from "./track.interface";
import IGenre from "./genre.interface";

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

// enum Genres {
// 	latinhiphop = "latin hip hop",
// 	reggaeton = "reggaeton",
// 	traplatino = "trap latino",
// 	conscioushiphop = "conscious hip hop",
// 	hiphop = "hip hop",
// 	rap = "rap",
// 	westcoastrap = "west coast rap",
// 	reggaetonflow = "reggaeton flow",
// 	trapboricua = "trap boricua",
// 	latinrock = "latin rock",
// 	spanishindiepop = "spanish indie pop",
// 	spanishmodernrock = "spanish modern rock",
// 	spanishnoisepop = "spanish noise pop",
// 	urbanoespanol = "urbano espanol",
// 	hyperpopenespanol = "hyperpop en espanol",
// 	rapregio = "rap regio",
// 	vaportwitch = "vapor twitch",
// 	argentinehiphop = "argentine hip hop",
// 	rbargentino = "r&b argentino",
// 	trapargentino = "trap argentino",
// 	colombianpop = "colombian pop",
// 	reggaetoncolombiano = "reggaeton colombiano",
// 	pop = "pop",
// 	rapespanol = "rap espanol",
// 	traptriste = "trap triste",
// 	spanishpop = "spanish pop",
// 	latinarenapop = "latin arena pop",
// 	spanishrock = "spanish rock",
// 	cantautor = "cantautor",
// 	rockalternativoespanol = "rock alternativo espanol",
// 	latinpop = "latin pop",
// 	britishsoul = "british soul",
// 	popsoul = "pop soul",
// 	ukpop = "uk pop",
// 	rbenespanol = "r&b en espanol",
// 	spanishpoprock = "spanish pop rock",
// 	canadianhiphop = "canadian hip hop",
// 	canadianpop = "canadian pop",
// 	torontorap = "toronto rap",
// 	latintalentshow = "latin talent show",
// 	chicagorap = "chicago rap",
// 	classicrock = "classic rock",
// 	heartlandrock = "heartland rock",
// 	mellowgold = "mellow gold",
// 	permanentwave = "permanent wave",
// 	rock = "rock",
// 	singersongwriter = "singer-songwriter",
// 	popflamenco = "pop flamenco",
// 	dancepop = "dance pop",
// 	neoperreo = "neoperreo",
// 	rapcatala = "rap catala",
// 	raplatina = "rap latina",
// 	trapcatala = "trap catala",
// 	rapundergroundespanol = "rap underground espanol",
// 	spanishhiphop = "spanish hip hop",
// 	latinalternative = "latin alternative",
// 	rockenespanol = "rock en espanol",
// 	puertoricanpop = "puerto rican pop",
// }