export interface ILogTemperature {
    device_id: string;
    log_time: Date;
    waterTemperature: number;
    airTemperature: number;
    airHumidity: number;
}