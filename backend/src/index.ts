import "dotenv/config";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";
import { createOpenAIPriorityAnalyzer } from "./prioritization.js";

const config = loadConfig();
const analyzer = createOpenAIPriorityAnalyzer(config);
const app = createApp(config, analyzer);

app.listen(config.PORT, "0.0.0.0", () => {
  console.log(`API Vozes do Cerrado disponível na porta ${config.PORT}.`);
});
