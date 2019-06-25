var ipfsClient = require('ipfs-http-client')
var ipfs = ipfsClient();
var fs = require('fs');
const blue = require('./blue');
const Poller = require('./poller');
const ip = require('public-ip');

/**
 * Description:
 * This class handles all the ipfs methods required to store data
 * in any format(coming soon)
 * 
 * This feature is not enabled or utlized atm, will be once 
 * replication of data is stable
 * func initialize: initialize the node and connect it with all the other nodes
 * func pinit: pin a specific hash or all hashes from all the pins
 * func showPins: show all the hashes currently pinned
 * func removePin: remove a specific hash from the pinset
 * func addFile: add a file from the filesystem into ipfs
 * func addHash:
 * func setIpns:
 * func addHash:
 * func getIpns:
 * func rmPins:
 * func swarmConnect:
 */

var cosmos = {
  initialize: async () => {
    let poller = new Poller(1000); 
    id = await ipfs.id()
    ipv4 = await ip.v4()
    console.log(ipv4)

    console.log(await blue.initialize());

    /**
     * Delegate one node randomly to restart
     */
    poller.onPoll(async () => {
      for (var i = id.addresses.length; i-- > 0; ) {
        if(id.addresses[i].includes(`/ip4/${ipv4}`)){
          console.log()
          await blue.write(ipv4, id.addresses[i])
        }
      }
      
      let keys = await blue.getKeys()
      console.log('\n')
      console.log('Total nodes: ', keys.length)

      for (let key of keys = await blue.getKeys()) {
        if (key !== ipv4) {
          value = await blue.read(key)
          await cosmos.swarmConnect(value, key)
        }
      }

      // check all nodes connect if not delete the one that isnt connecting
      if (keys.length > keys.length) {
        console.log('New node joined!')
        for (let key of keys = await blue.getKeys()) {
          if (key !== ipv4) {
            value = await blue.read(key)
            await cosmos.swarmConnect(value, key)
          }
        }
      }
      poller.poll(); 
    });

    poller.poll();
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
  swarmConnect: async(addr, key) => {
    try {
      await ipfs.swarm.connect(addr).then(obj => console.log(key, obj.Strings))
    } catch (e) {
      console.log(e.message)
      if (e.statusCode === 500 && (await blue.getKeys()).length > 2) {
        blue.deleteField(key)
        console.log(`${key} deleted`)
      }
    }
  }
}

module.exports = cosmos;
