const fs = require('fs');
const mkdirp = require('mkdirp');
const contentfulExport = require('contentful-export');
const Table = require('cli-table3');
const startCase = require('lodash.startcase');
const yargs = require('yargs');

const timeStamp = (date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .replace(/[:]/g, '.');
};

const exportByContentType = async (argv) => {
  try {
    const options = {
      spaceId: "1fg1o2hf3ts7",
      managementToken: "CFPAT-Uo5SQv-D2X2s8DWicGYCywCs8sTYHlQQvcZHR5ht7s4",
      environmentId: "develop",
      skipContent: true,
      saveFile: false,
      skipRoles: true,
      skipWebhooks: true
    };

    const result = await contentfulExport(options);
    console.log(`\nFiltering exported data by ${argv.contentTypes}...`);
    const { contentTypes = [], entries = [], editorInterfaces = [] } = result;

    const filteredContentTypes = contentTypes.filter((ct) => argv.contentTypes.includes(ct.sys.id));

    const filteredEditorInterfaces = editorInterfaces.filter((ei) =>
      argv.contentTypes.includes(ei.sys.contentType.sys.id)
    );

    const filteredEntries = entries.filter((e) =>
      argv.contentTypes.includes(e.sys.contentType.sys.id)
    );

    const finalResult = {
      contentTypes: filteredContentTypes,
      editorInterfaces: filteredEditorInterfaces,
      entries: filteredEntries,
    };

    const resultTypes = Object.keys(finalResult);
    const resultTable = new Table();

    resultTable.push([{ colSpan: 2, content: 'Filtered entities' }]);

    resultTypes.forEach((type) => {
      resultTable.push([startCase(type), finalResult[type].length]);
    });

    console.log(resultTable.toString());

    const date = new Date();

    const exportPath = `exported-data.json`;

    fs.writeFileSync(exportPath, JSON.stringify(finalResult, null, 2));
    console.log(`\nNew export file saved as ${exportPath}.`);
  } catch (err) {
    console.error(err);
  }
};

const { argv } = yargs
  .option('content-types', {
    description: 'List of content types to filter by.',
    type: 'array',
    default: ["post", "version_tracking"],
  })
  .array('content-types')
  .require('content-types', 'Please provide at least one content type to filter by')
  .option('environment-id', {
    describe: 'ID of Environment with source data',
    type: 'string',
    default: 'develop',
  })
  .option('space-id', {
    describe: 'ID of Space with source data',
    type: 'string',
    default: '1fg1o2hf3ts7',
  })
  .option('management-token', {
    alias: 'mt',
    describe: 'Contentful management API token',
    type: 'string',
  })
  .option('skip-content', {
    describe: 'Skip exporting entries',
    type: 'boolean',
    default: false,
  })
  .help()
  .alias('help', 'h');

exportByContentType(argv);