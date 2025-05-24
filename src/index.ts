import { configDotenv } from "dotenv";
import express from "express";
import type { NextFunction, Request, Response, Application } from "express";
import * as http from "node:http";
import * as fs from "node:fs";
import jsyaml from "js-yaml";
import cors from "cors";

import path from "node:path";
import swaggerUi from "swagger-ui-express";
import { controllers } from "./routes/Routes";

configDotenv();

const app: Application = express();
const port: string | 3000 = process.env.PORT ?? 3000;
app.use(cors());
app.use(express.json());
const specPath: string = path.join(__dirname, "api/swagger.yaml");
const spec: string = fs.readFileSync(specPath, "utf8");
const swaggerDocs = jsyaml.load(spec) as { paths: { [keys: string]: string } };

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req: Request, res: Response, next: NextFunction): void => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, POST, PATCH, DELETE, GET, OPTIONS"
  );
  next();
});

type SwaggerConfig = {
  operationId: string;
  [key: string]: string;
};

const routes = Object.entries(swaggerDocs.paths).flatMap(([path, methods]) => {
  return Object.entries(methods).map(([method, config]) => {
    const typedConfig = config as unknown as SwaggerConfig;
    return {
      path,
      method,
      operationId: typedConfig.operationId,
      params: typedConfig.parameters,
    };
  });
});

routes.forEach(({ path, method, operationId, params }): void => {
  let handler;
  handler = controllers[operationId as keyof typeof controllers];
  if (handler) {
    if (
      Array.isArray(params) &&
      params.some((param): boolean => param.in === "path")
    ) {
      let routePath = path;
      params.forEach((param): void => {
        if (param.in === "path") {
          routePath = routePath.replace(`{${param.name}}`, `:${param.name}`);
        }
      });
      app[method as keyof Application](routePath, handler);
    } else {
      app[method as keyof Application](path, handler);
    }
  } else {
    console.error(`Controller não encontrado para operationId: ${operationId}`);
  }
});

http.createServer(app).listen(port, (): void => {
  console.info(`🚀 Server is running on http://localhost:${port}`);
  console.info(`🚀 Swagger is available on http://localhost:${port}/docs`);
});
