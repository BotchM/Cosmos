var cosmos = require('./cosmos');

//cosmic.pinit()

(async () => {

  console.log('>>> initializing the node')
  await cosmos.initialize()

  //hash = await cosmos.addFile('public/t.txt')

  //await cosmos.rmPins()
  // pinset = await cosmos.showPins()
  // console.log(pinset)

})().catch(err => {
    console.error(err);
});
