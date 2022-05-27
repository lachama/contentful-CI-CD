#!/usr/bin/env node

(async () => {
  try {
      const { promisify } = require("util");
      const { readdir } = require("fs");
      const readdirAsync = promisify(readdir);
      const path = require("path");
      const { createClient } = require("contentful-management");
      const { default: runMigration } = require("contentful-migration/built/bin/cli");

      // utility fns
      const getVersionOfFile = (file) => file.replace(".js", "").replace(/_/g, ".");
      const getFileOfVersion = (version) => version.replace(/\./g, "_") + ".js";

      const options = {
        "SPACE_ID": "1fg1o2hf3ts7", 
        "ENVIRONMENT_INPUT": "develop", 
        "CMA_ACCESS_TOKEN": "CFPAT-Uo5SQv-D2X2s8DWicGYCywCs8sTYHlQQvcZHR5ht7s4"
      }
      //
      // Configuration variables
      //
      const {SPACE_ID, ENVIRONMENT_INPUT, CMA_ACCESS_TOKEN} = options;
      const MIGRATIONS_DIR = "migrations";

      console.log(`MIGRATIONS_DIR`, MIGRATIONS_DIR);

      const client = createClient({
          accessToken: CMA_ACCESS_TOKEN,
      });
      const space = await client.getSpace(SPACE_ID);

      var ENVIRONMENT_ID = ENVIRONMENT_INPUT;

      let environment;
      console.log("Running with the following configuration");
      console.log(`SPACE_ID: ${SPACE_ID}`);


      // ---------------------------------------------------------------------------
      console.log("Read all the available migrations from the file system");
      const availableMigrations = (await readdirAsync(MIGRATIONS_DIR))
          .filter((file) => /^\d+?\.js$/.test(file))
          .map((file) => getVersionOfFile(file));

      console.log("availableMigrations", availableMigrations);

      // ---------------------------------------------------------------------------
      console.log("Figure out latest ran migration of the contentful space");
      const { items: versions } = await environment.getEntries({
          content_type: "versionTracking",
      });

      if (!versions.length || versions.length > 1) {
          throw new Error("There should only be one entry of type 'versionTracking'");
      }

      let storedVersionEntry = versions[0];
      const currentVersionString = storedVersionEntry.fields.version[defaultLocale];

      // ---------------------------------------------------------------------------
      console.log("Evaluate which migrations to run");
      const currentMigrationIndex = availableMigrations.indexOf(currentVersionString);

      if (currentMigrationIndex === -1) {
          throw new Error(
              `Version ${currentVersionString} is not matching with any known migration`
          );
      }
      const migrationsToRun = availableMigrations.slice(currentMigrationIndex + 1);
      const migrationOptions = {
          spaceId: SPACE_ID,
          environmentId: ENVIRONMENT_ID,
          accessToken: CMA_ACCESS_TOKEN,
          yes: true,
      };

      // ---------------------------------------------------------------------------
      console.log("Run migrations and update version entry");
      while ((migrationToRun = migrationsToRun.shift())) {
          const filePath = path.join(
              __dirname,
              "..",
              "migrations",
              getFileOfVersion(migrationToRun)
          );
          console.log(`Running ${filePath}`);
          await runMigration(
              Object.assign(migrationOptions, {
                  filePath,
              })
          );
          console.log(`${migrationToRun} succeeded`);

          storedVersionEntry.fields.version[defaultLocale] = migrationToRun;
          storedVersionEntry = await storedVersionEntry.update();
          storedVersionEntry = await storedVersionEntry.publish();

          console.log(`Updated version entry to ${migrationToRun}`);
      }

      // ---------------------------------------------------------------------------
      console.log("Checking if we need to an alias");
      if (ENVIRONMENT_INPUT == "master" || ENVIRONMENT_INPUT == "staging" || ENVIRONMENT_INPUT == "qa") {
          console.log(`Running on ${ENVIRONMENT_INPUT}.`);
          console.log(`Updating ${ENVIRONMENT_INPUT} alias.`);
          await space
              .getEnvironmentAlias(ENVIRONMENT_INPUT)
              .then((alias) => {
                  alias.environment.sys.id = ENVIRONMENT_ID;
                  return alias.update();
              })
              .then((alias) => console.log(`alias ${alias.sys.id} updated.`))
              .catch(console.error);
          console.log(`${ENVIRONMENT_INPUT} alias updated.`);
      } else {
          console.log("Running on feature branch");
          console.log("No alias changes required");
      }

      console.log("All done!");
     
  } catch (e) {
      console.error(e);
      process.exit(1);
  }
})();

function getStringDate() {
  var d = new Date();
  function pad(n) {
      return n < 10 ? "0" + n : n;
  }
  return (
      d.toISOString().substring(0, 10) +
      "-" +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes())
  );
}
