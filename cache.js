// assume the user can be identified by userId,  and the multiple users can use the app simulteniously  
const cache = (db) => {
  const DB = db;
  const cache = {
  };
  const saveCache = (userId, data) => {
    if(cache[userId]){
      const keys = Object.keys(data);
      keys.map((k) => {
        cache[userId][k] = data[k];
      });
    } else {
      cache[userId] = data;
    }
    return cache[userId];
  };

  const getCache = async (userId) => {
    if(!cache[userId]) {
      const rows = await DB.getDB(userId);
      cache[userId] = rows.find((r)=> r);
    }
    return cache[userId];
  };


  const saveCacheToDB = async () => {
    const save2DB = async(userId, props) =>{
      try {  
        const result = await DB.saveDB( userId, props);
        return result;
      } catch (err){
        console.log('err:' + err.message);
      }
    };
    const keys = Object.keys(cache)
    const results = await Promise.all(keys.map(async(e) => {
      return save2DB(e, cache[e]);
    }));
    return results;
  };

  return {
    saveCache,
    getCache,
    saveCacheToDB,
  };
};

module.exports = cache;