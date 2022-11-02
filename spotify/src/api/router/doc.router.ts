import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../../documentation/swagger/swagger.json";

export default (app) => {
	app.get("/doc", swaggerUi.setup(swaggerDocument));
};
