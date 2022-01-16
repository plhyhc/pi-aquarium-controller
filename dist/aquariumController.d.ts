import { IDht } from "./interfaces/IDht";
export default class AquariumController {
    constructor();
    fetchWaterSensorTemp(id: string): Promise<number>;
    fetchAirTempHumidity(): Promise<IDht>;
}
