"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config.json");
const mysql = require("mysql");
class Mydb {
    constructor() {
        this.myCon = mysql.createPool({
            connectionLimit: 200,
            queueLimit: 0,
            waitForConnections: true,
            host: 'localhost',
            database: config.mysql.database,
            user: config.mysql.username,
            password: config.mysql.password
        });
    }
    myExec(sql, callback) {
        this.myCon.getConnection((err, connection) => {
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
    myInsert(sql) {
        this.myCon.getConnection((err, connection) => {
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
    async myExecPromise(sql) {
        return new Promise((resolve, reject) => {
            this.myCon.getConnection((err, connection) => {
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
    myInsertPromise(sql) {
        return new Promise((resolve, reject) => {
            this.myCon.getConnection((err, connection) => {
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
exports.default = Mydb;
//# sourceMappingURL=mydb.js.map