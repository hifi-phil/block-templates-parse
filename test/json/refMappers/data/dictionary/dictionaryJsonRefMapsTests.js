var S = require('string');
var assert = require("assert");
var should = require('should');
var jsonHelper = require('../../../../../modules/json/jsonService');

var config = {};
config.refMapper = require('../../../../../modules/json/refMappers/json/refsAsDictionary');
config.deepclone = true;

describe('json service', function () {
	describe('refmaps', function () {
		describe('dictionary schema', function () {

			it('json dictionary - given multiple json states then consolidate', function (done) {

				config.external = {
					"/child": {},
					"/child_new-state": {},
				}

				var data = {
					"child1": {
						"$ref": "/child"
					},
					"child2": {
						"$ref": "/child_new-state"
					},
				}

				var results = jsonHelper.resolveComponentJson(data, config);

				var debug = JSON.stringify(results.refMap, null, 4);

				var expected = {
					"child": {
						"instances": [
							{
								"path": "/child1",
								"state": "child"
							},
							{
								"path": "/child2",
								"state": "child_new-state"
							}
						]
					}
				};

				var child = results.refMap['child'].instances;

				assert.equal('/child1', child[0].path);
				assert.equal('child', child[0].state);
				assert.equal('/child2', child[1].path);
				assert.equal('child_new-state', child[1].state);

				done();

			})

			it('json dictionary - given an array of childs then path correctly', function (done) {

				config.external = {
					"/child": {},
					"/child_new-state": {},
				}

				var data = {
					"child": [
						{ "$ref": "/child" },
						{ "$ref": "/child_new-state" }
					]
				}

				var results = jsonHelper.resolveComponentJson(data, config);

				var debug = JSON.stringify(results.refMap, null, 4);

				var expected = {
					"child": {
						"paths": [
							{
								"path": "/child[0]",
								"state": "child"
							},
							{
								"path": "/child1[1]",
								"state": "child_new-state"
							}
						]
					}
				}

				var child = results.refMap['child'].instances;

				assert.equal('/child[0]', child[0].path);
				assert.equal('/child[1]', child[1].path);

				done();

			})

			it('given a an array and a sub object in the array object', function (done) {

				config.external = {
					"/sub": {},
					"/child": {
						"vm": { "$ref": "/sub" }
					},
					"/child_new-state": {
						"vm": { "$ref": "/sub" }
					}
				}

				var data = {
					"child1": [
						{ "$ref": "/child" },
						{ "$ref": "/child_new-state" }
					]
				}

				var results = jsonHelper.resolveComponentJson(data, config);

				var debug = JSON.stringify(results.refMap, null, 4);

				var expected = {
					"child": {
						"paths": [
							{
								"path": "/child1[0]",
								"state": "child"
							},
							{
								"path": "/child1[1]",
								"state": "child_new-state"
							}
						]
					},
					"sub": {
						"paths": [
							{
								"path": "/child1[0]/vm",
								"state": "sub"
							},
							{
								"path": "/child1[1]/vm",
								"state": "sub"
							}
						]
					}
				}

				var sub = results.refMap['sub'].instances;

				assert.equal('/child1[0]/vm', sub[0].path);
				assert.equal('/child1[1]/vm', sub[1].path);

				done();

			})

			it('given an internal array and a sub object in the array then path is correct', function (done) {

				config.external = {
					"/child": {},
					"/child_new-state": {}
				}

				var data = {
					"child": [
						{
							"vm": { "$ref": "/child" }
						},
						{
							"vm": { "$ref": "/child_new-state" }
						},
					]
				}

				var results = jsonHelper.resolveComponentJson(data, config);

				var debug = JSON.stringify(results.refMap, null, 4);

				var exptected = {
					"child": {
						"instances": [
							{
								"path": "/child[0]/vm",
								"state": "child"
							},
							{
								"path": "/child[1]/vm",
								"state": "child_new-state"
							}
						]
					}
				}

				var sub = results.refMap['child'].instances;

				assert.equal('/child[0]/vm', sub[0].path);
				assert.equal('/child[1]/vm', sub[1].path);

				done();

			})

			it('given an internal object and a sub ref in the object then path is correct', function (done) {

				config.external = {
					"/child": {},
					"/child_new-state": {}
				}

				var data = {
					"child": {
						"grandchild": {
							"child1": { "$ref": "/child" },
							"child2": { "$ref": "/child_new-state" }
						}
					}
				}

				var results = jsonHelper.resolveComponentJson(data, config);

				var debug = JSON.stringify(results.refMap, null, 4);

				var exptected = {
					"child": {
						"instances": [
							{
								"path": "/child/grandchild/child1",
								"state": "child"
							},
							{
								"path": "/child/grandchild/child2",
								"state": "child_new-state"
							}
						]
					}
				}

				var child = results.refMap['child'].instances;

				assert.equal('/child/grandchild/child1', child[0].path);
				assert.equal('/child/grandchild/child2', child[1].path);

				done();

			})

		});
	});
});