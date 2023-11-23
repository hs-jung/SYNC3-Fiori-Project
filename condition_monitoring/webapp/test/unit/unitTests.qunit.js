/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"condition_monitoring/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
