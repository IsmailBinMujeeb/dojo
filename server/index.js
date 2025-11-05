import app from './server.js';
import server from './sockets/server.js';
import db from './config/db.js';

(async function () {
  const PORT = app.get('port');
  await db();
  server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
})();
