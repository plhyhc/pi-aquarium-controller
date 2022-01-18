import Mydb from './mydb';
import { IDht } from "./interfaces/IDht";
export default class AquariumController {
    mydb: Mydb;
    constructor();
    fetchWaterSensorTemp(id: string): Promise<number>;
    fetchAirTempHumidity(): Promise<IDht>;
    logWaterTemperature(id: string, temperature: number): void;
    formatDateTime(d: Date): string;
    twoDigits(d: number): string;
}
