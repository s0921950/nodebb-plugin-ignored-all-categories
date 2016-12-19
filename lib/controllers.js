'use strict';

var Controllers = {};
Controllers.renderAdminPage = function (req, res, next) {
	res.render('admin/plugins/ignored-all-categories', {});
};

module.exports = Controllers;