const fs = require('fs');
const { URL, parse } = require('url');
const homedir = require('os').homedir();

let submission = require(homedir + '/issue-parser-result.json');
let validation = require('./validation.js');
let plugins = require('../plugins.json');
let author = process.env.ISSUE_USER_ID;

function checkOwner(plugin) {
	if(plugin.owner == author) return true;
	validation.writeComment(`Sorry, this plugin was submitted by a different GitHub user. If you wish to transfer a plugin, please use the transfer option first.`);
	return false;
}

function getPlugin() {
	let plugin = plugins.find(plugin => plugin.package_name == submission.package_name);
	if(plugin !== undefined) return plugin;
	validation.writeComment(`Unable to find a plugin for the provided package name ${submission.package_name}. If you want to submit a new plugin, please use the new plugin option.`);
	return undefined;
}

async function main() {
	let plugin = getPlugin();
	if(plugin != undefined && checkOwner(plugin) && validation.checkPackageName(false) && await validation.checkUrl(false) && validation.checkPackages()) {
		validation.writeComment(`✅ Your update passes validation. It will now be manually approved before being allowed on the repository. If you realise you have made a mistake, please close this issue and open a new update submission with the corrected information.`);
		console.log("result=true");
	}else{
		console.log("result=false");
	}
}

main();
