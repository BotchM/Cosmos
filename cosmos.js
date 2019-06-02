var ipfsClient = require('ipfs-http-client')
var ipfs = ipfsClient()
var fs = require('fs');

var cosmos = {
  pinit: async (hash) => {
    if(hash){
      await ipfs.pin.add(hash)
      return
    }
    pinset = await cosmos.showPins()
    for(let hash of pinset){
      await ipfs.pin.add(hash)
    }
  },
  showPins: async () => {
    pinset = await ipfs.pin.ls()
    var hashes = []
    for (let pin of pinset) {
      if(pin.type === 'recursive' ){
        await cosmos.pinit(pin.hash)
        hashes.push(pin.hash)
      }
    }
    return hashes
  },
  removePin: async (pin) => {
    await ipfs.pin.rm(pin)
  },
  addFile: async (path) => {
    hash = await ipfs.addFromFs(path, { recursive: true })
    console.log('Orig hash is: ' + hash[0].hash)
    return await cosmos.addHash(hash[0].hash)
  },
  addHash: async (hash) => {
    await cosmos.pinit(hash)

    var res = await cosmos.getIpns()
    res = await cosmos.getHash(res)
    if(res && !res.includes(hash)){
      res += `\n/ipfs/${ipfsClient.Buffer.from(hash)}`
      body = await ipfs.add(ipfsClient.Buffer.from(res))
      await cosmos.setIpns(body[0].hash)
    }
  },
  getHash: async (hash) => {
    path = await ipfs.get(hash)
    return path[0].content.toString('UTF8')
  },
  setIpns: async (hash) => {
    res = await ipfs.name.publish(hash)
    console.log(res)
  },
  getIpns: async () => {
    const addr = '/ipns/QmP98mu6uzBN3k5PN5LmVy7G6z71s14NCELxRprZUsW1ZQ'
    return await ipfs.name.resolve(addr)
  },
  rmPins: async () => {
    body = await ipfs.add(ipfsClient.Buffer.from(''))
    await cosmos.setIpns(body[0].hash)
    pinset = await cosmos.showPins()
    for(let hash of pinset){
      await ipfs.pin.rm(hash)
    }
  },
}

module.exports = cosmos;
