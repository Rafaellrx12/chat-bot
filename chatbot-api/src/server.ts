import Fastify from 'fastify';
import { productRoutes } from './routes/products';

const app = Fastify({ logger: true });

app.register(productRoutes);

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log('🚀 Servidor rodando em http://localhost:3000');
});
