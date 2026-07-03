import { buildServer } from "./server.js";

const port = Number(process.env.CLASSIFIER_PORT ?? 8787);
const host = process.env.CLASSIFIER_HOST ?? "0.0.0.0";

const app = buildServer();

app.listen({ port, host }).catch((error) => {
  app.log.error(error);
  process.exit(1);
});
