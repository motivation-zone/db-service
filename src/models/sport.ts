export interface ISportModel {
    id?: number;
    name?: string;
}

/**
 * @api
 * @type model
 * @name SportModel
 * @object {{
 *  "type": "object",
 *  "required": [
 *      "id",
 *      "name"
 *  ],
 *  "properties": [
 *      {
 *          "name": "id",
 *          "type": "number"
 *      }, {
 *          "name": "name",
 *          "type": "string"
 *      }
 *  ]
 * }}
 */
export default class SportModel implements ISportModel {
    public id?: number;
    public name?: string;

    constructor(data: ISportModel) {
        const {id, name} = data;

        this.id = id && Number(id);
        this.name = name;
    }
}
