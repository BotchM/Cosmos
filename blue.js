const { bluzelle } = require('bluzelle');
const uuidv4       = require('uuid/v4');

/*
-----BEGIN EC PRIVATE KEY-----
MHQCAQEEIFRwVj7ZrqnSNNJeMsz4qAKDIZyBgKH3fUhkdjQzpb+1oAcGBSuBBAAK
oUQDQgAEDgftWwbXDSj3IgPYh4p1S/NQSUhVmBjnkejAOxKgxB30UyDIC5uzCOfr
qCdilzBWtO0sS7unKggtitftXhEijA==
-----END EC PRIVATE KEY-----
*/

const api = bluzelle({
    entry: 'ws://testnet.bluzelle.com:51010',

    // This UUID identifies your database and may be changed.
    uuid: '5ff8319a-f404-40ca-b49a-2a63aa91d2f2',

    // This is the private key used for signing off database operations
    private_pem: 'MHQCAQEEIFRwVj7ZrqnSNNJeMsz4qAKDIZyBgKH3fUhkdjQzpb+1oAcGBSuBBAAKoUQDQgAEDgftWwbXDSj3IgPYh4p1S/NQSUhVmBjnkejAOxKgxB30UyDIC5uzCOfrqCdilzBWtO0sS7unKggtitftXhEijA=='
});

const main = async () => {
    try {
      await initialize()
      await getKeys()

      api.close();
    } catch (e) {
        console.log('something wrong')
    }   
};

const initialize = async() => {
  if (await api.hasDB() === false) {
    await api.createDB();
    await api.create("1", "	QmZ2LpEihpXx8KucSF8y5SD9mazaPXQ8QouuzBt3Gt1T4S");
    await api.create("2", "	QmZ2LpEihpXx8KucSF8y5SD9mazaPXQ8QouuzBt3Gt1T4S");
    await api.create("3", "	QmZ2LpEihpXx8KucSF8y5SD9mazaPXQ8QouuzBt3Gt1T4S");
    await api.create("4", "	QmZ2LpEihpXx8KucSF8y5SD9mazaPXQ8QouuzBt3Gt1T4S");
    await api.create("5", "	QmZ2LpEihpXx8KucSF8y5SD9mazaPXQ8QouuzBt3Gt1T4S");
    await api.create("6", "	QmZ2LpEihpXx8KucSF8y5SD9mazaPXQ8QouuzBt3Gt1T4S");
    await api.create("7", "	QmZ2LpEihpXx8KucSF8y5SD9mazaPXQ8QouuzBt3Gt1T4S");
    await api.create("8", "	QmZ2LpEihpXx8KucSF8y5SD9mazaPXQ8QouuzBt3Gt1T4S");
    await api.create("8", "	QmZ2LpEihpXx8KucSF8y5SD9mazaPXQ8QouuzBt3Gt1T4S");
  }
}

const read = async (key) => {
    try {
        return await api.read(key);
    } catch (e) {
        //value = await db.get(key);
        value = 'haha';
        await api.update(key, value);
        return value;
    }
}

const write = async (key, value) => {
    try {
        await api.create(key, value);
        await api.update(key, value);
    } catch (e) {
        console.log(e)
    }
}

const stats = async() => {
    const stats = {
        uuid: uuidv4(),
        writers: await api.getWriters(),
        pk: await api.publicKey(),
        has: await api.hasDB(),
        size: await api.size(),
        keys: await api.keys(),
    };
    console.log(JSON.stringify(stats, null, 4));
}

const getKeys = async() => {
  console.log(await api.keys())
}

const setWriters = async() => {
  await api.addWriters('MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAE4V08tYSrs5O10YhGmNVpxCofn8q5liNDfj1I3IOkByrb0SHMNMr5FgBhsWYLI+ncRP6AAs1aH7E9PFPygjeOvw==');
}

const getWriters = async() => {
  console.log(await api.getWriters())
}

main().catch(e => { 
    api.close();
    throw e;
});