export const limitQueryParams: IApiParam[] = [{
    name: 'limit',
    type: 'number'
}, {
    name: 'skip',
    type: 'number'
}, {
    name: 'order',
    type: 'ASC | DESC',
    def: 'ASC'
}];

interface IApiParam {
    name: string;
    type: string;
    def?: string;
}

interface IApiDescription {
   method: 'post' | 'get' | 'delete';
   url: string;
   body?: string | IApiParam[];
   query?: IApiParam[];
}

export interface IApiInterface {
    prefix: string;
    methods: IApiDescription[];
}