const { runMigration } = require('contentful-migration')

function migrationFunction(migration) {
  const store = migration.createContentType('storeInformation')
  .name("Store Information")
  .description("Store Information Data");

  store.createField('name')
  .name("Name")
  .type("Symbol")
  .required(false);

  store.createField('storeID')
    .name('Store ID')
    .type('Number')
    .required(false);
  
    store.createField('address')
    .name('Address')
    .type('Symbol')
    .required(false);

  store.createField('phoneNumber')
    .name('Phone Number')
    .type('Number')
    .required(false);
}

const options = {
  migrationFunction,
  environmentId: 'develop',
  spaceId: '1fg1o2hf3ts7',
  accessToken: 'CFPAT-Uo5SQv-D2X2s8DWicGYCywCs8sTYHlQQvcZHR5ht7s4'
}

runMigration(options)
  .then(() => console.log('Store Information Content Type Created!'))
  .catch((e) => console.error(e))