import * as config from "./config.json";
import sensor = require('node-dht-sensor');
import ds18b20 = require('ds18b20');
import { IDht } from "./interfaces/IDht";
import { Mongoose, Schema, model } from "mongoose";
import { ILogTemperature } from "./interfaces/ILogTempe3rature";


export default class AquariumController {
    logTemp: any;
    mongoose: Mongoose;
    constructor() {
        this.mongoose = new Mongoose();

        this.mongoose.connect(config.mongo.url);

        this.logTemp = this.mongoose.model<ILogTemperature>('temperature', new Schema({
            device_id: { type: String, required: true },
            log_time: { type: Date, required: true },
            waterTemperature: Number,
            airTemperature: Number,
            airHumidity: Number
          }));
        // ds18b20.sensors((err, ids) => {
        //     console.log([err, ids]);
        //   });
        setTimeout(() => {
            this.runProcess();
        }, 5000);

       
    }

    runProcess(): void {
        const waterTempSensorId = config.waterTemperature[0].id;
        
        this.fetchWaterSensorTemp(waterTempSensorId).then((waterTemp: number) => {
            return waterTemp;
        }).then((waterTemp: number) => {
            this.fetchAirTempHumidity().then((dht: IDht) => {
                console.log('water temp: ', waterTemp);
                console.log(`air temp: ${dht.temperature}, humidity: ${dht.humidity}`);
                this.logWaterTemperature(waterTempSensorId, waterTemp, dht);
            }).catch((error: any) => {
                console.error(error);
            });
        }).catch((error: any) => {
            console.error(error);
        });

        setTimeout(() => {
            this.runProcess();
        }, 5000);

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

    async logWaterTemperature(id: string, waterTemperature: number, dht: IDht): Promise<void> {
        
        const logItem = new this.logTemp({
            device_id: id,
            log_time: new Date(),
            waterTemperature: waterTemperature,
            airTemperature: dht.temperature,
            airHumidity: dht.humidity
        });

        await logItem.save();
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