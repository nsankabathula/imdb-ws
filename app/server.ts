import "reflect-metadata"; // this shim is required
import { createExpressServer, useExpressServer } from "routing-controllers";
import { APP_CONTROLLERS } from './controllers';

const app = createExpressServer({
    cors: true,
    controllers: APP_CONTROLLERS // we specify controllers we want to use
});

// run express application on port 3000
app.listen(3000);