const fs = require('fs');
const { URL, parse } = require('url');
const homedir = require('os').homedir();

let submission = require(homedir + '/issue-parser-result.json');
let plugins = require('../plugins.json');
let validation = require('./validation.js')
let author = process.env.USER_ID

function getPlugin() {
	let plugin = plugins.find(plugin => plugin.package_name == submission.package_name);
	if(plugin !== undefined) return plugin;
	validation.writeComment(`Unable to find a plugin for the provided package name ${submission.package_name}. If you want to submit a new plugin, please use the new plugin option.`);
	return undefined;
}

let plugin = getPlugin();

function checkOwner(plugin) {
	if(plugin.owner == author) return true;
	validation.writeComment(`Sorry, this plugin was submitted by a different GitHub user. You need to use the original user to transfer a plugin. If this is not possible, please open a general request and explain your situation and it can be transferred manually after some verification.`);
	return false;
}

if(plugin != undefined && checkOwner(plugin)){
	plugins = plugins.filter(item => item != plugin);
	fs.writeFileSync('plugins.json', JSON.stringify(plugins, null, "\t"));
	validation.writeComment(`Thank you, this plugin has been removed.`);
	console.log("result=true");
}else{
	console.log("result=false");
}
