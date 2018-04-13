//export * from './welcome.controller';
import { WelcomeController } from './welcome.controller';
import { DialogFlowHookController } from './dialog.flow.hook.controller';
import { DialogFlowApiController } from './dialog.flow.api.controller';
import { ESearchController } from './es';



export const APP_CONTROLLERS = [
    WelcomeController, DialogFlowHookController, DialogFlowApiController, ESearchController
];

/*
export const APP_ROUTES = [{
    route: '/welcome', component: WelcomeController, path: './welcome.controller'
}, {
    route: '/test', component: TestController.getInstance(), path: './test.controller'
}
];
*/