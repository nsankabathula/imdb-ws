import { Controller, Param, Body, Get, Post, Put, Delete, JsonController, Req, Res, QueryParam } from "routing-controllers";
import { Request, Response } from "express";
import { ESCONFIG, IESShard, IESSource, IESHits, IESResponse, IHashFunction, ESearchMap } from './es.model';

const ElasticSearch = require('elasticsearch');


@JsonController()
export class ESearchController {

    esClient: any;
    constructor() {
        this.esClient = new ElasticSearch.Client({
            host: ESCONFIG.host,
            log: ESCONFIG.log
        });


    }


    @Get("/esearch/")
    testSearch( @Body() body: any | undefined, @QueryParam("function") functionName: string) {
        let that = this;
        functionName = (functionName) ? functionName.toLowerCase() : 'default';

        const PING_FUNCTION = function (resolve: Function, reject: Function): void {
            that.esClient.ping
                ({ body: 'Node connecting to elasticsearch....' },
                function (esErr: any, esResponse: any, esStatus: any) {
                    //console.log(esStatus, esResponse, esErr);
                    if (esErr !== undefined && esErr !== null) {
                        reject(esErr);
                    }
                    var hits = esResponse.hits;
                    resolve(esResponse);
                }
                );

        }

        const SEARCH_FUNCTION = function (resolve: Function, reject: Function): void {
            that.esClient.search
                ({
                    index: 'imdb',
                    type: 'titles',
                    body: (body) ? body : {
                        "query": {
                            "match_all": {}
                        }
                    }

                },
                function (err: any, resp: any, status: any) {
                    console.log(status, resp, err);
                    if ((err !== undefined && err !== null) || (status !== 200)) {
                        reject(err);
                    }
                    var searchResponse: IESResponse = <IESResponse>JSON.parse(JSON.stringify(resp));
                    console.log('Hits Total', searchResponse);
                    resolve(ESearchMap.map(searchResponse).hits.response);
                }
                );

        }

        const FUNCTION_MAP: IHashFunction = {
            'ping': PING_FUNCTION,
            'search': SEARCH_FUNCTION,
            'default': PING_FUNCTION

        };

        const executeFunction = (FUNCTION_MAP[functionName]) ? FUNCTION_MAP[functionName] : FUNCTION_MAP['default'];

        return (new Promise(executeFunction));

    }




}