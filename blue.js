const { bluzelle } = require('bluzelle');
const uuidv4       = require('uuid/v4')();

/*
-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIFRwVj7ZrqnSNNJeMsz4qAKDIZyBgKH3fUhkdjQzpb+1oAcGBSuBBAAK
oUQDQgAEDgftWwbXDSj3IgPYh4p1S/NQSUhVmBjnkejAOxKgxB30UyDIC5uzCOfr
qCdilzBWtO0sS7unKggtitftXhEijA==
-----END EC PRIVATE KEY-----

45.63.14.97
1Wf@WQJ?Jy(qPGNq
ssh -L 5001:localhost:5001 root@45.63.14.97
ssh -L 5001:45.63.14.97:5001 root@45.63.14.97 -N -v -v
ssh -f root@45.63.14.97 -L 5001:[::1]:5001 -N

#proxy
ssh -L [localport]:[remotehost]:[remoteport] [username]@[server]
ssh -L 5001:45
*/


const api = bluzelle({
    entry: 'ws://testnet.bluzelle.com:51010',

    // This UUID identifies your database and may be changed.
    uuid: '9c39d81b-128d-4230-b235-6805d36f5f03',

    // This is the private key used for signing off database operations
    private_pem: 'MHQCAQEEIFRwVj7ZrqnSNNJeMsz4qAKDIZyBgKH3fUhkdjQzpb+1oAcGBSuBBAAKoUQDQgAEDgftWwbXDSj3IgPYh4p1S/NQSUhVmBjnkejAOxKgxB30UyDIC5uzCOfrqCdilzBWtO0sS7unKggtitftXhEijA=='
});


var blue = {
  initialize: async() => {
    if (await api.hasDB() === false) {
      console.log('initialized')
      console.log(uuidv4)
      await api.createDB();
    }
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
          uuid: uuidv4(),
          writers: await api.getWriters(),
          pk: await api.publicKey(),
          has: await api.hasDB(),
          size: await api.size(),
          keys: await api.keys(),
      };
      console.log(JSON.stringify(stats, null, 4));
  },
  getKeys: async() => {
    console.log(await api.keys())
  },
  setWriters: async() => {
    await api.addWriters('MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE4V08tYSrs5O10YhGmNVpxCofn8q5liNDfj1I3IOkByrb0SHMNMr5FgBhsWYLI+ncRP6AAs1aH7E9PFPygjeOvw==');
  },
  getWriters: async() => {
    console.log(await api.getWriters())
  }
}


module.exports = blue;
