#!/usr/bin/env node

'use strict';


const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const execSync = child_process.execSync;


const ARCH_TYPES = ['i386', 'x86_64', 'armv7', 'arm64'];


function extract(dir) {
	// extract all archs, you might want to delete it later.
	console.log('Extracting...');
	ARCH_TYPES.forEach(elm => {
		execSync(`lipo -extract ${elm} WebRTC -o WebRTC-${elm}`, {cwd: dir});
	});
	execSync('cp WebRTC WebRTC-all', {cwd: dir}); // make a backup
}

function simulator(dir) {
	// re-package simulator related archs only. ( i386, x86_64 )
	console.log('Compiling simulator...');
	execSync(`lipo -o WebRTC -create WebRTC-x86_64 WebRTC-i386`, {cwd: dir});
}

function device(dir) {
	// re-package device related archs only. ( armv7, arm64 )
	console.log('Compiling device...');
	execSync(`lipo -o WebRTC -create WebRTC-armv7 WebRTC-arm64`, {cwd: dir});
}

function list(dir) {
	// List WebRTC architectures
	console.log('List WebRTC architectures...');
	console.log(execSync(`file WebRTC`, {cwd: dir}).toString().trim());
}

function clean(dir) {
	// Delete WebRTC-* architectures
	console.log('Clean WebRTC architectures...');
	console.log(execSync(`rm -f WebRTC-*`, {cwd: dir}).toString().trim());
}


module.exports = function(ctx) {
	
	console.log('[after_prepare hook] Project root: ' + ctx.opts.projectRoot);

	const IOSRTC_PLUGIN_PATH = path.join(ctx.opts.projectRoot, 'plugins/cordova-plugin-iosrtc');
	const LIB_PATH = path.join(IOSRTC_PLUGIN_PATH, 'lib');
	const WEBRTC_BIN_PATH = path.join(LIB_PATH, 'WebRTC.framework');
	const dir = WEBRTC_BIN_PATH;

	console.log('List WebRTC files...');
	console.log(execSync('ls -ahl | grep WebRTC', {cwd: dir}).toString().trim());

	extract(dir);
	//simulator(dir);
	device(dir);
	clean(dir);
	list(dir);

	console.log('List WebRTC files...');
	console.log(execSync('ls -ahl | grep WebRTC', {cwd: dir}).toString().trim());

};
