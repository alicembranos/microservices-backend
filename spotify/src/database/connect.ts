import mongoose, { Mongoose } from "mongoose";
import config from "../config/config";

const MONGO_ATLAS_URI = config.db.url || "";

function connect(): Promise<Mongoose> {
	return mongoose.connect(MONGO_ATLAS_URI);
}

export default connect;
