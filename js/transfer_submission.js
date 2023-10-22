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

function isValidUserId(str) {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

function verifyNewOwner() {
	if(submission.new_owner === undefined || submission.new_owner.length == 0) return false;
	if(submission.verify_new_owner === undefined || submission.verify_new_owner.length == 0) return false;
	return submission.new_owner == submission.verify_new_owner;
}

function checkNewOwner() {
	if(verifyNewOwner()) return true;
	validation.writeComment(`The entered new owner usernames do not match or were not provided, please try again.`);
	return false;
}

async function getUserId(username) {
	const request = require('request');

    var requestWithHeaders = request.defaults({
        headers: {'User-Agent': "https://github.com/SmartspacerTest/Test-Actions-Repo"}
    })

	return new Promise((resolve, reject) => {
        requestWithHeaders.get('https://api.github.com/users/' + username, (error, response, body) => {
            if (error) resolve(undefined);
            if (response.statusCode != 200) {
                resolve(undefined)
            }
            resolve(JSON.parse(response.body).id);
        });
    });
}

async function getNewOwner() {
	let newOwner = submission.new_owner;
	let newUserId = await getUserId(newOwner);
	if(newUserId !== undefined) return newUserId.toString();
	validation.writeComment(`Sorry, the provided user to transfer to (${newOwner}) was not found. Please check the username and try again.`);
	return undefined;
}

async function main() {
	if(plugin != undefined && checkNewOwner() && checkOwner(plugin)){
		let newOwner = await getNewOwner();
		if(newOwner === undefined){
			console.log("result=false");
			return;
		}
		plugin.owner = newOwner;
		fs.writeFileSync('plugins.json', JSON.stringify(plugins, null, "\t"));
		validation.writeComment(`Thank you, this plugin has been transferred. You can now make update requests from your new account`);
		console.log("result=true");
	}else{
		console.log("result=false");
	}
}

main();
