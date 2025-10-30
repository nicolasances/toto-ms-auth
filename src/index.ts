import { TotoAPIController } from "toto-api-controller";
import { ControllerConfig } from "./config";
import { GetTotoToken } from "./dlg/GetTotoToken";
import { VerifyToken } from "./dlg/VerifyToken";

const api = new TotoAPIController("tome-ms-auth", new ControllerConfig());

api.path('GET', "/token", new GetTotoToken());
api.path('POST', "/verify", new VerifyToken()); 

api.init().then(() => {
    api.listen()
});