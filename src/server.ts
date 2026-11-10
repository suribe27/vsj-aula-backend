import { app } from './app';
import { env } from './infrastructure/config/env';

app.listen(env.port, () => {
  console.info(`API escuchando en el puerto ${env.port}`);
});
