var sensor = require('node-dht-sensor');
var ds18b20 = require('ds18b20');

ds18b20.sensors((err, ids) => {
  console.log([err, ids]);
});
// 28-3c01f096bcde

ds18b20.temperature('28-3c01f096bcde', (err, value) => {
  const temp = (value * (9/5)) + 32;
  console.log('Current temperature is', temp);
});

sensor.read(22, 5, (err, tempReading, humid) => {
	const temp = (tempReading * (9/5)) + 32;
	if(!err) {
		console.log(`temp: ${temp}, humidity: ${humid}`);
	} else {
		console.log(err);
	}
});
