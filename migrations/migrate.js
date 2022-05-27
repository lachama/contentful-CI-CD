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
