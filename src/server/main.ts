import fs from "fs";
import YAML from "yaml";
import express from "express";
import ViteExpress from "vite-express";
import axios from "axios";
import config from "../../config.json";

const app = express();

app.use(express.json());

function getAlexaYaml() {
  return YAML.parse(fs.readFileSync(config.homeAssistant.alexaYaml, "utf8"));
}

function saveAlexaYaml(json: object) {
  return fs.writeFileSync(
    config.homeAssistant.alexaYaml,
    YAML.stringify(json),
    "utf8"
  );
}

app.put("/api/entities/:entityId", (req, res) => {
  const { entityId } = req.params;
  const { exposed, alias, description } = req.body;

  const alexaYaml = getAlexaYaml();
  const entityConfig = alexaYaml.smart_home.entity_config;
  let includeEntities = alexaYaml.smart_home.filter.include_entities;

  if (!exposed) {
    delete entityConfig[entityId];
    includeEntities = includeEntities.filter((it) => it !== entityId);
  } else {
    if (!includeEntities.includes(entityId)) {
      includeEntities.push(entityId);
    }

    delete entityConfig[entityId];

    if (alias) {
      entityConfig[entityId] = {
        ...entityConfig[entityId],
        name: alias,
      };
    }

    if (description) {
      entityConfig[entityId] = {
        ...entityConfig[entityId],
        description,
      };
    }
  }

  saveAlexaYaml({
    smart_home: {
      entity_config: entityConfig,
      filter: { include_entities: includeEntities },
    },
  });

  return res.sendStatus(200);
});

app.get("/api/entities", async (_, res) => {
  try {
    const alexaYaml = getAlexaYaml();
    const entityConfig = alexaYaml.smart_home.entity_config;
    const includeEntities = alexaYaml.smart_home.filter.include_entities;

    return res.send(
      await axios
        .get(`${config.homeAssistant.server}/api/states`, {
          headers: { Authorization: `Bearer ${config.homeAssistant.token}` },
        })
        .then((res) =>
          res.data.filter((it) => !it.entity_id.startsWith("zone."))
        )
        .then((entities) =>
          entities.map((entity) => ({
            entityId: entity.entity_id,
            exposed: includeEntities.includes(entity.entity_id),
            name: entity.attributes?.friendly_name,
            alias: entityConfig[entity.entity_id]?.name,
            description: entityConfig[entity.entity_id]?.description,
          }))
        )
    );
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.post("/api/restart", async (_, res) => {
  try {
    await axios.post(
      `${config.homeAssistant.server}/api/services/homeassistant/restart`,
      undefined,
      { headers: { Authorization: `Bearer ${config.homeAssistant.token}` } }
    );
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err);
  }
});

ViteExpress.listen(app, config.port, () => {
  console.log(`Server is listening on port ${config.port}...`);
});
