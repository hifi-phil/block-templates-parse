var jsonService = require('./json/jsonService');
var refMapperList = require('./json/refMappers/refsAsList');

var blockFilesService = require('./services/blockFilesService');

/*private*/
const parseJson = function(fileContents, path, errors)
{
	var results = jsonService.testJSON(fileContents);
	if(!results.valid) {
		errors.push({
			source: 'yuzu build - json parse',
			inner: 'JSON Error for '+ path +', '+ results.error
		})
	}
	return results.data;
}

const resolveJson = function(data, externals, blockData, errors)
{
	var resolveResults = jsonService.resolveComponentJson(data, { external: externals.data, addRefProperty: true, addPathProperty: true, deepclone: true });
	if(!resolveResults.valid) {
		var that = this;
		resolveResults.errors.forEach(function(error) {
			errors.push({
				source: 'yuzu build - json resolve for '+ blockData.schema.id,
				inner: error
			})
			that.emit('error', new gutil.PluginError('Resolve Map Ref for '+ blockData.schema.id, error));
		});
	}
	return data;
}

const resolveSchemaAsListRefMap = function(schema, externals) {

	var results = jsonService.resolveComponentJson(schema, { external: externals.data, refMapper: refMapperList, deepclone: true });
	return results.refMap;
}

const getBlockData = function(path) {

	var blockData = blockFilesService.Get(path);
	if(blockData.error) {
		errors.push({
			source: 'yuzu build - build template settings',
			inner: blockData.error
		})
	}
	return blockData;

}

const validateSchema = function(data, externals, blockData, errors) {
	if(!blockData.schema) {
		errors.push({
			source: 'yuzu build - schema not found : '+ path.basename(blockData.path),
		})			
	}
	else{

		var result = jsonService.validateSchema(externals.schema, data, blockData.schema)
		result.errors.forEach(function(error) {
			errors.push({
				source: 'yuzu build - validate schema '+ blockData.schema.id,
				inner: error
			});
		});
	}
}
		
module.exports = { 
	parseJson,
	resolveJson,
	resolveSchemaAsListRefMap,
	getBlockData,
	validateSchema
};