import * as config from "./config.json";
import sensor = require('node-dht-sensor');
import ds18b20 = require('ds18b20');
import Mydb from './mydb';
import { IDht } from "./interfaces/IDht";


export default class AquariumController {
    mydb: Mydb;
    constructor() {
        this.mydb = new Mydb();
        // ds18b20.sensors((err, ids) => {
        //     console.log([err, ids]);
        //   });
        
        this.fetchWaterSensorTemp(config.waterTemperature[0].id).then((waterTemp: number) => {
            console.log('water temp: ', waterTemp)
        }).catch((error: any) => {
            console.error(error);
        });

        this.fetchAirTempHumidity().then((dht: IDht) => {
            console.log(`air temp: ${dht.temperature}, humidity: ${dht.humidity}`);
        }).catch((error: any) => {
            console.error(error);
        });
    }

    fetchWaterSensorTemp(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            if (id) {
                ds18b20.temperature(id, (err, value) => {
                    if (err) {
                        reject(err);
                    }
                    const temp: number = (value * (9/5)) + 32;
                    resolve(temp);
                  });
            } else {
                reject('no id provided');
            }
        });
    }

    fetchAirTempHumidity(): Promise<IDht> {
        return new Promise((resolve, reject) => {
            sensor.read(config.dht.type, config.dht.gpioPin, (err, tempReading, humidity) => {
                setTimeout(() => {
                    sensor.read(config.dht.type, config.dht.gpioPin, (err, tempReading, humidity) => {
                        const temperature = (tempReading * (9/5)) + 32;
                        if(!err) {
                            const dht: IDht = {
                                temperature: temperature,
                                humidity: humidity
                            };
                            resolve(dht);
                        } else {
                            reject(err);
                        }
                    });
                }, 1000);
            });
        });
    }

    logWaterTemperature(id: string, temperature: number): void {
        const logDateTime = this.formatDateTime(new Date());
        const sql: string = `INSERT INTO temperature (device_id, log_time, temperature) VALUES ('${id}', '${logDateTime}', '${temperature}') `;
        this.mydb.myInsert(sql);
    }

    formatDateTime(d: Date): string {
        return d.getFullYear() + "-" + this.twoDigits(1 + d.getMonth()) + "-" + this.twoDigits(d.getDate()) + " " + this.twoDigits(d.getHours()) + ":" + this.twoDigits(d.getMinutes()) + ":" + this.twoDigits(d.getSeconds());
    }

    twoDigits(d: number): string {
        if(0 <= d && d < 10) return "0" + d.toString();
        if(-10 < d && d < 0) return "-0" + (-1 * d).toString();
        return d.toString();
      }
}