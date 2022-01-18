import * as config from "./config.json";
import sensor = require('node-dht-sensor');
import ds18b20 = require('ds18b20');
import { IDht } from "./interfaces/IDht";

export default class AquariumController {
    constructor() {
        // ds18b20.sensors((err, ids) => {
        //     console.log([err, ids]);
        //   });
        // 28-3c01f096bcde
        
        this.fetchWaterSensorTemp('28-3c01f096bcde').then((waterTemp: number) => {
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
                ds18b20.temperature('28-3c01f096bcde', (err, value) => {
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
                }, 500);
            });
        });
    }
}