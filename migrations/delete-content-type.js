const { runMigration } = require('contentful-migration')

function migrationFunction(migration) {
  migration.deleteContentType('storeInformation');
}

const options = {
  migrationFunction,
  environmentId: 'develop',
  spaceId: '1fg1o2hf3ts7',
  accessToken: 'CFPAT-Uo5SQv-D2X2s8DWicGYCywCs8sTYHlQQvcZHR5ht7s4',
  yes: true
}

runMigration(options)
  .then(() => console.log('Migration Done!'))
  .catch((e) => console.error(e))