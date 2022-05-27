const { runMigration } = require('contentful-migration')

function migrationFunction(migration) {
  const store = migration.editContentType('storeInformation');

  store.editField('address')
    .name('Store Address')
    .type('Symbol')
    .required(false);

  store.createField('timeZone')
    .name('Store Time Zone')
    .type('Symbol')
    .required(false);

}

const options = {
  migrationFunction,
  environmentId: 'develop',
  spaceId: '1fg1o2hf3ts7',
  accessToken: 'CFPAT-Uo5SQv-D2X2s8DWicGYCywCs8sTYHlQQvcZHR5ht7s4'
}

runMigration(options)
  .then(() => console.log('Migration Done!'))
  .catch((e) => console.error(e))