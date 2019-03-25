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

export interface IApiParam {
    name: string;
    type: string;
    def?: string;
}

interface IApiDescription {
   method: 'post' | 'get' | 'delete';
   url: string;
   returns?: string | IApiParam[];
   body?: string | IApiParam[];
   query?: IApiParam[];
   params?: IApiParam[];
}

export interface IApiInterface {
    prefix: string;
    methods: IApiDescription[];
}