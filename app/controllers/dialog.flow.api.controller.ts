import { Controller, Param, Body, Get, Post, Put, Delete, JsonController, Req, Res, Header, QueryParam } from "routing-controllers";
import { Response } from "express-serve-static-core";
import * as rp from "request-promise-native"
const ApiAiClient = require('apiai');

interface IMessage {
    type: string;
    body: string;
    sender: string;
    timestamp: Date;
    response: any
}

const dialogFlowClient = new ApiAiClient('bd8bb26e98f44b638b5cf80bc7e7860d');

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

@JsonController()
export class DialogFlowApiController {
    dfRequest: any = {};
    constructor() {


    }

    @Post("/dialogflow/api/old")
    @Header("Access-Control-Allow-Origin", "*")
    @Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    postMessage1( @Body() message: IMessage) {

        //res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
        console.log(message);

        return this.PromiseRequest(message.body).then(
            function (res: any) {
                const result = res["result"];
                console.log(result.metadata);
                const webhookUsed: boolean = (result.metadata && result.metadata.webhookUsed !== undefined && result.metadata.webhookUsed !== 'false') ? true : false;
                message.response = result["fulfillment"]["speech"];
                console.log(webhookUsed, message.response);
                if (webhookUsed)
                    return [JSON.parse(message.response)];
                else
                    return [message.response];
            }
        )

    }
    @Post("/dialogflow/api")
    @Header("Access-Control-Allow-Origin", "*")
    @Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    postMessage( @Body() message: IMessage) {

        //res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
        console.log(message);

        return this.PromiseRequest(message.body).then(
            function (res: any) {
                const result = res["result"];
                console.log(result.metadata);
                const webhookUsed: boolean = (result.metadata && result.metadata.webhookUsed !== undefined && result.metadata.webhookUsed !== 'false') ? true : false;
                message.response = result["fulfillment"]["speech"];
                console.log(webhookUsed, message.response);
                if (webhookUsed) {
                    message.response = JSON.parse(message.response)
                    var queryBody = {};
                    switch (message.response.metadata.intentName) {
                        case 'imdb-intent-title': {
                            queryBody = {
                                "query": {
                                    "bool": {
                                        "must": [
                                            {
                                                "match": {
                                                    "primaryTitle": message.response.title
                                                }
                                            },
                                            {
                                                "match_phrase_prefix": {
                                                    "titleType": (message.response.titleTypes) ? message.response.titleTypes.join(',') : ''
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                            break;
                        }

                        case 'imdb-intent-genre': {
                            queryBody = {
                                "query": {
                                    "bool": {
                                        "must": [
                                            {
                                                "match": {
                                                    "genres": message.response.genres.join(',')
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                            break;
                        }

                        case 'imdb-intent-crew': {
                            queryBody = {
                                "query": {
                                    "nested": {
                                        "path": "crew",
                                        "query": {
                                            "bool": {
                                                "must": [
                                                    { "match": { "crew.primaryName": message.response.crewFirstName } },
                                                    { "match": { "crew.primaryName": message.response.crewLastName } }
                                                ]
                                            }
                                        }
                                    }
                                }
                            };
                            break;
                        }
                        case 'imdb-intent-profession': {
                            queryBody = {
                                "query": {
                                    "nested": {
                                        "path": "crew",
                                        "query": {
                                            "bool": {
                                                "must": [
                                                    { "match": { "crew.primaryName": message.response.crewFirstName } },
                                                    { "match": { "crew.primaryName": message.response.crewLastName } },
                                                    { "match": { "crew.primaryProfession": message.response.profession } }
                                                ]
                                            }
                                        }
                                    }
                                }
                            };
                            break;
                        }

                        default: queryBody = {
                            "query": {
                                "match_all": {}
                            }
                        };
                            break;
                    };
                    console.log('queryBody', JSON.stringify(queryBody));
                    return new Promise(function (resolve, reject): void {
                        const ES_REQUEST_OPTIONS = {
                            uri: 'http://683dd3cd.ngrok.io/esearch/',
                            qs: {
                                'function': 'search'
                            },
                            json: true,
                            method: 'GET',
                            body: queryBody
                        };


                        rp(ES_REQUEST_OPTIONS)
                            .then(function (esResult: any) {
                                resolve(esResult)
                            })
                            .catch(function (esError: any) {
                                reject(esError);
                            });
                    });
                }
                else
                    return { type: 'TEXT', body: message.response };
            }
        )

    }

    @Get("/dialogflow/api/1")
    @Header("Access-Control-Allow-Origin", "*")
    @Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    getMessage( @QueryParam("message") text: string) {
        const message: IMessage = <IMessage>{ body: (text) ? text : 'Find me GOT season 5' }
        //res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
        console.log(message);

        return this.PromiseRequest(message.body).then(
            function (res: any) {
                const result = res["result"];
                console.log(result.metadata);
                const webhookUsed: boolean = (result.metadata && result.metadata.webhookUsed !== undefined && result.metadata.webhookUsed !== 'false') ? true : false;
                message.response = result["fulfillment"]["speech"];
                console.log(webhookUsed, message.response);
                if (webhookUsed) {
                    message.response = JSON.parse(message.response)
                    var queryBody = {};
                    switch (message.response.metadata.intentName) {
                        case 'imdb-intent-title': {
                            queryBody = {
                                "query": {
                                    "match": { "primaryTitle": message.response.title }
                                }
                            }
                            break;
                        }

                        case 'imdb-intent-genre': {
                            queryBody = {
                                "query": {
                                    "match": { "genres": message.response.genres }
                                }
                            }
                            break;
                        }

                        case 'imdb-intent-crew': {
                            queryBody = {
                                "query": {
                                    "nested": {
                                        "path": "crew",
                                        "query": {
                                            "bool": {
                                                "must": [
                                                    { "match": { "crew.primaryName": "dickson" } },
                                                    { "match": { "crew.primaryName": "william" } }
                                                ]
                                            }
                                        }
                                    }
                                }
                            };
                            break;
                        }

                        default: queryBody = {
                            "query": {
                                "match_all": {}
                            }
                        };
                            break;
                    };
                    console.log('queryBody', queryBody);
                    return new Promise(function (resolve, reject): void {
                        const ES_REQUEST_OPTIONS = {
                            uri: 'http://683dd3cd.ngrok.io/esearch/',
                            qs: {
                                'function': 'search'
                            },
                            json: true,
                            method: 'GET',
                            body: queryBody
                        };


                        rp(ES_REQUEST_OPTIONS)
                            .then(function (esResult: any) {
                                resolve(esResult)
                            })
                            .catch(function (esError: any) {
                                reject(esError);
                            });
                    });
                }
                else
                    return [message.response];
            }
        )

    }


    PromiseRequest(message: string) {
        return new Promise(function (resolve, reject) {
            var dfRequest = dialogFlowClient.textRequest(message, { sessionId: Date.now().toString() })
            dfRequest.on(
                'response',
                (response: any) => {
                    resolve(response);
                }
            );
            dfRequest.end();

        });
    }
}