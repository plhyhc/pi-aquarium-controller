"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config.json");
const sensor = require("node-dht-sensor");
const ds18b20 = require("ds18b20");
const mydb_1 = require("./mydb");
class AquariumController {
    constructor() {
        this.mydb = new mydb_1.default();
        this.fetchWaterSensorTemp(config.waterTemperature[0].id).then((waterTemp) => {
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
                ds18b20.temperature(id, (err, value) => {
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
                }, 1000);
            });
        });
    }
    logWaterTemperature(id, temperature) {
        const logDateTime = this.formatDateTime(new Date());
        const sql = `INSERT INTO temperature (device_id, log_time, temperature) VALUES ('${id}', '${logDateTime}', '${temperature}') `;
        this.mydb.myInsert(sql);
    }
    formatDateTime(d) {
        return d.getFullYear() + "-" + this.twoDigits(1 + d.getMonth()) + "-" + this.twoDigits(d.getDate()) + " " + this.twoDigits(d.getHours()) + ":" + this.twoDigits(d.getMinutes()) + ":" + this.twoDigits(d.getSeconds());
    }
    twoDigits(d) {
        if (0 <= d && d < 10)
            return "0" + d.toString();
        if (-10 < d && d < 0)
            return "-0" + (-1 * d).toString();
        return d.toString();
    }
}
exports.default = AquariumController;
//# sourceMappingURL=aquariumController.js.map