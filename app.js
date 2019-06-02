var cosmos = require('./cosmos');

//cosmic.pinit()

(async () => {
  hash = await cosmos.addFile('public/t.txt')

  //await cosmos.rmPins()
  pinset = await cosmos.showPins()
  console.log(pinset)

})().catch(err => {
    console.error(err);
});
