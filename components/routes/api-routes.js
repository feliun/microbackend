const { join } = require('path');

module.exports = () => {
  const start = ({ app }, cb) => {
    app.get('/', (req, res) => {
      res.sendFile(join(process.cwd(), 'public', 'views', 'index.html'));
    });

    cb();
  };

  return { start };
};
