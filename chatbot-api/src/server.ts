import Fastify from 'fastify';
import { productRoutes } from './routes/products';

const app = Fastify({ logger: true });

app.register(productRoutes);

app.listen({ port: 3001 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log('🚀 API rodando em http://localhost:3001');
});
