"use strict";

var controllers = require('./lib/controllers');
var db = module.parent.require('./database');

var	plugin = {};

plugin.init = function(params, callback) {
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;

	router.get('/admin/plugins/ignored-all-categories', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/ignored-all-categories', controllers.renderAdminPage);

	callback();
};

plugin.userCreate = function(userData) {
	db.getSortedSetRange('categories:cid', 0, -1, function (err, cids) {
		if (err || !Array.isArray(cids) || !cids.length) {
			return callback(err, []);
		}
		cids.forEach(function (cid){
			db.sortedSetAdd('uid:' + userData.uid + ':ignored:cids', Date.now(), cid);
			db.sortedSetAdd('cid:' + cid + ':ignorers', Date.now(), userData.uid);
		});
	});
};

plugin.categoryCreate = function(category) {
	db.getSortedSetRange('users:joindate', 0, -1, function (err, uids) {
		if (err || !Array.isArray(uids) || !uids.length) {
			return callback(err, []);
		}
		uids.forEach(function (uid){
			db.sortedSetAdd('uid:' + uid + ':ignored:cids', Date.now(), category.cid);
			db.sortedSetAdd('cid:' + category.cid + ':ignorers', Date.now(), uid);
		});
	});
}

module.exports = plugin;