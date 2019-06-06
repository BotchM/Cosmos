const { bluzelle } = require('bluzelle');
const uuidv4       = require('uuid/v4')();

/*
45.63.14.97
1Wf@WQJ?Jy(qPGNq
ssh -L 5001:localhost:5001 root@45.63.14.97
ssh -L 5001:45.63.14.97:5001 root@45.63.14.97 -N -v -v
ssh -f root@45.63.14.97 -L 5001:[::1]:5001 -N

#proxy
ssh -L [localport]:[remotehost]:[remoteport] [username]@[server]
ssh -L 5001:45
*/

/**
 * Description:
 * This is the main interface into the bluzelle 
 * decentralized kV
 * 
 * func initialize: only used by the parent node (me)
 * func read: given a key return the value from bluzelle
 * func write: give a key, value pair write to bluzelle
 * func stats: get stats about your node
 * func getKeys: get all the keys stored in the bluzelle db
 * func setWriters: set a writer to the db (not implemented, but should be)
 * func get Writers: gets all the writer authorized to access the current db
 */

const api = bluzelle({
    entry: 'ws://testnet.bluzelle.com:51010',
    uuid: 'c74b4854-eb86-4629-8891-ab7e5e4c79e6',
    private_pem: 'MHQCAQEEIFRwVj7ZrqnSNNJeMsz4qAKDIZyBgKH3fUhkdjQzpb+1oAcGBSuBBAAKoUQDQgAEDgftWwbXDSj3IgPYh4p1S/NQSUhVmBjnkejAOxKgxB30UyDIC5uzCOfrqCdilzBWtO0sS7unKggtitftXhEijA=='
});

var blue = {
  initialize: async() => {
    if (await api.hasDB() == false) {
      await api.createDB();
      console.log('blue initialized!')
      return uuidv4
    }
    console.log('blue already initialized!')
  },
  read: async (key) => {
      try {
          return await api.quickread(key);
      } catch (e) {
          //value = await db.get(key);
          value = 'haha';
          await api.update(key, value);
          return value;
      }
  },
  write: async (key, value) => {
      try {
          await api.create(key, value);
          await api.update(key, value);
      } catch (e) {
        console.log(e.message)
        if(e.message === 'RECORD_EXISTS'){
          return await blue.read(key)
        }
      }
  },
  stats: async() => {
      const stats = {
          uuid: uuidv4,
          writers: await api.getWriters(),
          pk: await api.publicKey(),
          has: await api.hasDB(),
          size: await api.size(),
          keys: await api.keys(),
      };
      console.log(JSON.stringify(stats, null, 4));
  },
  getKeys: async() => {
    //console.log(await api.keys())
    return await api.keys()
  },
  setWriters: async() => {
    await api.addWriters('MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE4V08tYSrs5O10YhGmNVpxCofn8q5liNDfj1I3IOkByrb0SHMNMr5FgBhsWYLI+ncRP6AAs1aH7E9PFPygjeOvw==');
  },
  getWriters: async() => {
    console.log(await api.getWriters())
  },
  deleteField: async(key) => {
    await api.delete(key);
  }
}


module.exports = blue;
