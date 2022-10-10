import { Model } from "mongoose";
import { selectFieldsToPopulate } from "../utils/index";

//Dealing with data base operations
class Spotify {

	async createDocument<T>(model: Model<T>, data: T) {
		return await model.create(data);
	}

	async getAllDocuments<T>(model: Model<T>) {
		const populateField = selectFieldsToPopulate(model);
		return await model.find().populate(populateField).lean().exec();
	}

	async getDocumentById<T>(model: Model<T>, id: string) {
		const populateField = selectFieldsToPopulate(model);
		return await model.findById(id).populate(populateField).lean().exec();
	}

	/** 
	 * !this function will be only used for filter by genre?
	 */
	async getDocumentByFilter<T>(model: Model<T>, data: Partial<T>) {
		const populateField = selectFieldsToPopulate(model);
		return await model
			.find({ ...data })
			.populate(populateField)
			.lean()
			.exec();
	}

	async updateDocument<T>(model: Model<T>, id: string, data: Partial<T>) {
		const _id = id;
		const populateField = selectFieldsToPopulate(model);
		return await model
			.findOneAndUpdate({ _id }, { ...data }, { new: true })
			.populate(populateField)
			.lean()
			.exec();
	}

	async deleteDocument<T>(model: Model<T>, id: string) {
		return await model.findByIdAndDelete(id);
	}
}

export default Spotify;