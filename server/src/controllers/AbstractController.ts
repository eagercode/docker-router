'use strict';

import {Application} from "express-serve-static-core";

export abstract class AbstractController {

    constructor(app: Application) {
        this.registerRoutes(app);
    }

    abstract registerRoutes(app: Application): void;

}
