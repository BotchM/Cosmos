var ipfsClient = require('ipfs-http-client')
var ipfs = ipfsClient();
var fs = require('fs');
const blue = require('./blue');
var http = require('http');

var cosmos = {
  initialize: async () => {
    http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, (resp) => {
      resp.on('data', async (ip) => {
        id = await ipfs.id()
        for (var i = id.addresses.length; i-- > 0; ) {
          if(id.addresses[i].includes(`/ip4/${ip}`)){
            console.log(id.addresses[i])
            await blue.write(ip.toString(), id.addresses[i])
          }
        }

        for(let key of keys = await blue.getKeys()){
          if(key !== ip.toString()){
            value = await blue.read(key)
            await cosmos.swarmConnect(value)
          }
        }
      });
    });
  },
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
    // ipns might return empty
    var res = await cosmos.getIpns()
    res = await cosmos.getHash(res)
    console.log(res)
    if(res || true){
      res += `\n/ipfs/${ipfsClient.Buffer.from(hash)}`
      body = await ipfs.add(ipfsClient.Buffer.from(res))
      console.log(body)
      await cosmos.setIpns(body[0].hash)
      console.log('added')
    }
    console.log('done')
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
  swarmConnect: async(addr) => {
    console.log(await ipfs.swarm.connect(addr))
  }
}

module.exports = cosmos;
