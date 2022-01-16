import * as mysql from 'mysql';
declare class Mydb {
    myCon: mysql.Pool;
    constructor();
    myExec(sql: string, callback: (result: any) => void): void;
    myInsert(sql: string): void;
    myExecPromise(sql: string): Promise<unknown>;
    myInsertPromise(sql: string): Promise<Array<unknown>>;
}
export default Mydb;
