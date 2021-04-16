const hCart = (db, cache) => {
  const DB = db;
  const cartCache = cache;

  const update = async (req, res, next) =>{
    const props = req.body;
    cartCache.saveCache(req.userId, props);
    req.hCardProps = await cartCache.getCache(req.userId);
    next();
  };

  const submit = async (req, res, next) =>{
    const props = req.body;
    cartCache.saveCache(req.userId, props);
    await DB.saveDB(req.userId, props);
    req.hCardProps = props;
    next();
  };

  const current = async (req, res, next) => {
    req.hCardProps= await cartCache.getCache(req.userId);
    next();
  }
  return {
    current,
    update,
    submit,
  }
};
module.exports = hCart;