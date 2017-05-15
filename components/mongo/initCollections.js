module.exports = () => {

  const collections = {
    test: null
  };

  const start = ({ mongo }, cb) => {
    collections.test = mongo.collection('test');
    collections.test.createIndex({ id: 1 }, { unique: true, sparse: true });

    mongo.collection('test').insert({ id: Math.floor(Math.random() * 1000) })
    .then(() => cb(null, collections))
    .catch(cb);
  };

  return { start };
};
