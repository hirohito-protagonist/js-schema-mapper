const Benchmark = require('benchmark');
const Items10 = require('./items-10.json');
const Items100 = require('./items-100.json');
const Items1000 = require('./items-1000.json');
const DataSchema = require('./schema.js');
const Mapper = require('./../lib/index');

const data = Mapper.schema(DataSchema);

const suite = new Benchmark.Suite();

// add tests
suite
.add('Mapping 10 objects to schema', () => {
    data.mapFromCollection(Items10);
}, { minSamples: 100 })
.add('Mapping 100 objects to schema', () => {
    data.mapFromCollection(Items100);
}, { minSamples: 100 })
.add('Mapping 1000 objects to schema', () => {
    data.mapFromCollection(Items1000);
}, { minSamples: 100 })
.on('cycle', (event) => {
  console.log(String(event.target));
})
.on('complete', () => {

    suite.forEach((benchmark) => {
        console.info('--------------------------------------------------------------------------------------');
        console.info(`Suite name: ${benchmark.name}`);
        console.info(`The time taken to complete the last cycle (secs) - ${benchmark.times.cycle}`);
        console.info(`The time taken to complete the benchmark (secs)  - ${benchmark.times.elapsed}`);
        console.info(`The time taken to execute the test once (secs)   - ${benchmark.times.period}`);
        console.info(`A timestamp of when the benchmark started (ms)   - ${benchmark.times.timeStamp}`);
        
    });
    console.info('--------------------------------------------------------------------------------------');
})
// run async
.run({ 'async': true });
