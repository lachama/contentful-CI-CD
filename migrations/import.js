const contentfulImport = require('contentful-import')

const options = {
  contentFile: 'exported-data.json',
  spaceId: '1fg1o2hf3ts7',
  managementToken: 'CFPAT-Uo5SQv-D2X2s8DWicGYCywCs8sTYHlQQvcZHR5ht7s4',
  environmentId: 'nonprod',
}

contentfulImport(options)
  .then(() => {
    console.log('Data imported successfully')
  })
  .catch((err) => {
    console.log('Oh no! Some errors occurred!', err)
  })
