var cosmos = require('./cosmos');

(async () => {
  console.log('>>> initializing the node')
  await cosmos.initialize()

})().catch(err => {
    console.error(err);
});
