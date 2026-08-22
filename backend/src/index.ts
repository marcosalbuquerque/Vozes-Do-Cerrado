import "dotenv/config";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createGeminiPriorityAnalyzer } from "./prioritization.js";

const config = loadConfig();
const analyzer = createGeminiPriorityAnalyzer(config);
const app = createApp(config, analyzer);

if (process.env.NODE_ENV !== "production") {
  app.listen(config.PORT, "0.0.0.0", () => {
    console.log(`API Vozes do Cerrado disponível na porta ${config.PORT}.`);
  });
}

export default app;
