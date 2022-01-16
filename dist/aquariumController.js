"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config.json");
const sensor = require("node-dht-sensor");
const ds18b20 = require("ds18b20");
class AquariumController {
    constructor() {
        this.fetchWaterSensorTemp('28-3c01f096bcde').then((waterTemp) => {
            console.log('water temp: ', waterTemp);
        }).catch((error) => {
            console.error(error);
        });
        this.fetchAirTempHumidity().then((dht) => {
            console.log(`air temp: ${dht.temperature}, humidity: ${dht.humidity}`);
        }).catch((error) => {
            console.error(error);
        });
    }
    fetchWaterSensorTemp(id) {
        return new Promise((resolve, reject) => {
            if (id) {
                ds18b20.temperature('28-3c01f096bcde', (err, value) => {
                    if (err) {
                        reject(err);
                    }
                    const temp = (value * (9 / 5)) + 32;
                    resolve(temp);
                });
            }
            else {
                reject('no id provided');
            }
        });
    }
    fetchAirTempHumidity() {
        return new Promise((resolve, reject) => {
            sensor.read(config.dht.type, config.dht.gpioPin, (err, tempReading, humidity) => {
                setTimeout(() => {
                    sensor.read(config.dht.type, config.dht.gpioPin, (err, tempReading, humidity) => {
                        const temperature = (tempReading * (9 / 5)) + 32;
                        if (!err) {
                            const dht = {
                                temperature: temperature,
                                humidity: humidity
                            };
                            resolve(dht);
                        }
                        else {
                            reject(err);
                        }
                    });
                }, 500);
            });
        });
    }
}
exports.default = AquariumController;
//# sourceMappingURL=aquariumController.js.map