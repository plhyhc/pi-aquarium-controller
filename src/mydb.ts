import * as config from "./config.json";
import * as mysql from 'mysql';

class Mydb {
    myCon: mysql.Pool;
    constructor() {
        this.myCon = mysql.createPool({
            connectionLimit : 200,
            queueLimit: 0,
            waitForConnections: true,
            host: 'localhost',
            database: config.mysql.database,
            user: config.mysql.username,
            password: config.mysql.password
        })
    }

    myExec(sql: string, callback: (result) => void): void {
        this.myCon.getConnection((err, connection: mysql.PoolConnection) => {
            // Use the connection
            if (err) {
                console.error(err);
            }
            connection.query(sql, (err, rows) => {
                
                if (err) {
                    console.log(err);
                }
                callback(rows);
                connection.release();
            });
        });
    }

    myInsert(sql: string): void {
        this.myCon.getConnection((err, connection: mysql.PoolConnection) => {
            // Use the connection
            if (err) {
                console.error(err);
            }
            connection.query(sql, (err, rows) => {
                connection.release();
                if (err) {
                    console.log(err);
                }
            });
        });
    }

    async myExecPromise(sql: string): Promise<unknown> {
        return new Promise((resolve, reject) => {

            this.myCon.getConnection((err, connection: mysql.PoolConnection) => {
                // Use the connection
                if (err) {
                    console.error(err);
                    reject(err);
                }
                connection.query(sql, (err, rows) => {
                    
                    if (err) {
                        reject(err);
                    }
                    resolve(rows)
                    connection.release();
                });
                
            });
        });
        
    }

    myInsertPromise(sql: string): Promise<Array<unknown>> {
        return new Promise((resolve, reject) => {

            this.myCon.getConnection((err, connection) => {
                // Use the connection
                if (err) {
                    console.error(err);
                    reject(err);
                }
                connection.query(sql, (err, rows) => {
                    
                    if (err) {
                        reject(err);
                    }
                    resolve(rows);
                    connection.release();
                });
            });
        });
    }
}

export default Mydb;