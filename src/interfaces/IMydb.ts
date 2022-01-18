export interface IMydb {
    myExec(sql: string, callback: (result) => void): void;
    myInsert(sql: string): void;
    myExecPromise(sql: string): Promise<unknown>;
    myInsertPromise(sql: string): Promise<Array<unknown>>;
}