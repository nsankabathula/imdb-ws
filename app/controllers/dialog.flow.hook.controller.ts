import { Controller, Param, Body, Get, Post, Put, Delete, JsonController, Req, Res } from "routing-controllers";
import { Request, Response } from "express";


@JsonController()
export class DialogFlowHookController {

    @Post("/dialogflow/hook")
    webhook( @Req() req: Request, @Res() res: Response, @Body() body: any) {
        const dialogFlowModelDefault = {
            titleTypes: [],
            datePeriod: null,
            profession: [],
            crewFirstName: null,
            crewLastName: null,
            genres: [],
            title: null,
            seasonSequence: null,
            episodeSequence: null,
            metadata: {
                intentName: null
            }
        }

        let tempResponse = (req && req.body && req.body.result && req.body.result.parameters && req.body.result.parameters) ? Object.assign(dialogFlowModelDefault, req.body.result.parameters) : Object.assign(dialogFlowModelDefault, {});
        //Default response from the webhook to show it's working
        console.log('request', req.body.result.parameters);
        //console.log('tempResponse', tempResponse);


        tempResponse['metadata'] = (req && req.body && req.body && req.body.result && req.body.result.metadata) ? Object.assign(tempResponse.metadata, req.body.result.metadata) : Object.assign(tempResponse.metadata, {});
        let response = JSON.stringify(tempResponse);
        //console.log('response', response);





        res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
        return res.send(JSON.stringify({
            "speech": response, "displayText": response
        }));

    }



}