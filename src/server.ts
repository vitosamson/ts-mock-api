import * as express from 'express';
import { range } from 'lodash';
import factories from './factoryStore';

export default function server(port = 8900) {
  const app = express();

  for (const [name, { factory, isExported }] of factories.entries()) {
    if (!isExported) continue;

    console.log(`creating route /${name}`);
    app.use(`/${name}`, (req, res) => {
      res.json(range(5).map(() => factory()));
    });

    console.log(`creating route /${name}/:id`);
    app.use(`/${name}`, (req, res) => {
      res.json(factory());
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`listening at http://0.0.0.0:${port}`);
  });
}
