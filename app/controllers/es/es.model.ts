export const ESCONFIG =
    {
        "host": [
            {
                "host": "localhost",
                "auth": "elastic:s0P^P@3R^-JhjOH%?BcI",
                "protocol": "http",
                "port": 9229
            }
        ],
        "log": "error"
    }

export interface IHashFunction {
    [functionName: string]: any
}

export interface IESShard {
    total: number;
    successful: number;
    skipped: number;
    failed: number

}
export interface IESSource {
    _source: any

}
export interface IMessage {
    type: string;
    body: Array<any> | string | any;
}
export interface IESHits {
    total: number;
    max_score: number;
    hits: Array<IESSource>;
    response: IMessage
}
export interface IESResponse {
    took: number;
    timed_out: boolean;
    _shards: IESShard,
    hits: IESHits

}

export class ESearchMap {
    public static map(src: IESResponse): IESResponse {


        src.hits.response = {
            type: 'JSON',
            body: ESearchMap.clone(

                src.hits.hits.map((hit: IESSource) => {
                    return hit._source;
                }))
        };

        return src;
    }

    public static clone(src: any): any {
        return JSON.parse(JSON.stringify(src));
    }
}