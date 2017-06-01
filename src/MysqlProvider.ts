import {IProvider, RequestContext, Schema, ListOptions, DefaultServiceNames, Inject, System} from "vulcain-corejs";
import {IConnectionConfig, IConnection, createConnection} from "mysql";

export class MysqlProvider implements IProvider<any> {

    public state: {
        keyPropertyNameBySchemas: Map<string, string>;
        uri: string;
        dispose?: () => void;
        _mysql?;
    };

    get address() {
        return this.state.uri;
    }

    constructor(@Inject(DefaultServiceNames.RequestContext, true) private ctx: RequestContext,
                uri: string,
                private options: IConnectionConfig) {
        this.options = this.options || {user: 'root', password: ''};

        if (!uri) {
            throw new Error("Uri is required for mysql provider.");
        }

        this.state = {uri: uri, keyPropertyNameBySchemas: new Map<string, string>()};

    }

    initializeTenantAsync(context: RequestContext, tenant: string): Promise<() => Promise<any>> {
        // TODO : Insert tenant in connexion string

        return new Promise((resolve, reject) => {
            // Don't use 'this' here to avoid memory leaks
            // Open connexion
            let connection: IConnection = createConnection(this.options);

            const state = this.state;
            const options = this.options;
            connection.connect((error) => {
                if (error) {
                    reject(error);
                    System.log.error(this.ctx, error, 'MSQL:  Error when opening database ${System.removePasswordFromUrl(this.state.uri)} for tenant ${tenant}');
                    return;
                }

                state._mysql = connection;

                resolve(() => {
                    connection.end();
                    state._mysql = null;
                    state.dispose = null;
                });
            });

        });
    }

    findOneAsync(schema: Schema, query: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    getAllAsync(schema: Schema, options: ListOptions): Promise<any[]> {
        throw new Error("Method not implemented.");
    }

    getAsync(schema: Schema, id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    createAsync(schema: Schema, entity: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    updateAsync(schema: Schema, entity: any, old?: any): Promise<any> {
        throw new Error("Method not implemented.");
    }

    deleteAsync(schema: Schema, old: any): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}
