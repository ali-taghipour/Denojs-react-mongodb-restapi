import { Application } from "https://deno.land/x/oak/mod.ts";
import { connect } from "./helpers/db_client.ts";

import todosRoutes from './routes/todos.ts';

const app = new Application();
connect();

app.use(async (ctx, next) => {
  console.log('Middleware!');
  await next();
});

app.use(async (ctx,next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  await next();
})

app.use(todosRoutes.routes());
app.use(todosRoutes.allowedMethods());

await app.listen({ port: 5000 });

/** for run app deno run --allow-net --allow-read --allow-write --unstable --allow-env --allow-plugin app.ts */