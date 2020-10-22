#!/usr/bin/env node

'use strict';


const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const execSync = child_process.execSync;


const ARCH_TYPES = ['i386', 'x86_64', 'armv7', 'arm64'];


function list(dir) {
	// List WebRTC architectures
	console.log('List WebRTC architectures...');
	console.log(execSync(`file WebRTC`, {cwd: dir}).toString().trim());
}


module.exports = function(ctx) {

	console.log('[after_prepare hook] Project root: ' + ctx.opts.projectRoot);

	const IOSRTC_PLUGIN_PATH = path.join(ctx.opts.projectRoot, 'plugins/cordova-plugin-iosrtc');
	const LIB_PATH = path.join(IOSRTC_PLUGIN_PATH, 'lib');
	const WEBRTC_BIN_PATH = path.join(LIB_PATH, 'WebRTC.framework');
	const dir = WEBRTC_BIN_PATH;

	console.log('List WebRTC files...');
	console.log(execSync('ls -ahl | grep WebRTC', {cwd: dir}).toString().trim());

	execSync(`lipo -output "WebRTC-tmp" -remove "i386" "WebRTC"`, {cwd: dir});
	execSync(`rm "WebRTC"`, {cwd: dir});
	execSync(`mv "WebRTC-tmp" "WebRTC"`, {cwd: dir});

	execSync(`lipo -output "WebRTC-tmp" -remove "x86_64" "WebRTC"`, {cwd: dir});
	execSync(`rm "WebRTC"`, {cwd: dir});
	execSync(`mv "WebRTC-tmp" "WebRTC"`, {cwd: dir});

	console.log(execSync(`lipo -info "WebRTC"`, {cwd: dir}).toString().trim());

	console.log('List WebRTC files...');
	console.log(execSync('ls -ahl | grep WebRTC', {cwd: dir}).toString().trim());

	list(dir);

};
