const fs = require('fs');
const { URL, parse } = require('url');
const homedir = require('os').homedir();

let submission = require(homedir + '/issue-parser-result.json');
let plugins = require('../plugins.json');
let validation = require('./validation.js')
let author = process.env.ISSUE_USER_ID;
let labeler = process.env.LABEL_USER_ID;

if(author === undefined || author.length == 0){
	console.log("Author is not defined");
	process.exit(1);
}

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
	if(validation.checkAdmin(labeler) && plugin != undefined && checkOwner(plugin) && await validation.checkUrl(false) && validation.checkPackages(false)) {
		if(submission.name !== undefined && submission.name.length > 0){
			plugin.name = validation.trimWithEllipsis(submission.name, 50);
		}
		if(submission.description !== undefined && submission.description.length > 0){
			plugin.description = validation.trimWithEllipsis(submission.description, 200);
		}
		if(submission.author !== undefined && submission.author.length > 0){
			plugin.author = submission.author;
		}
		if(submission.url !== undefined && submission.url.length > 0){
			plugin.url = submission.url;
		}
		if(submission.packages !== undefined && submission.packages.length > 0){
			plugin.packages = submission.packages;
		}
		plugins = plugins.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
		fs.writeFileSync('plugins.json', JSON.stringify(plugins, null, "\t"));
		validation.writeComment(`Thank you, your plugin has been updated`);
		console.log("result=true");
	}else{
		console.log("result=false");
	}
}

main();
