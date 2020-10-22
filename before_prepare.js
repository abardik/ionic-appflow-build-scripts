#!/usr/bin/env node

'use strict';


const path = require('path');
const child_process = require('child_process');
const execSync = child_process.execSync;


module.exports = function(ctx) {
	
	console.log('[before_prepare hook]');

	console.log(execSync('gem install cocoapods -v 1.8.0').toString().trim());
	console.log(execSync('pod setup').toString().trim());

};
