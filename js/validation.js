const fs = require('fs');
const { URL, parse } = require('url');
const homedir = require('os').homedir();

let plugins = require('../plugins.json');
let submission = require(homedir + '/issue-parser-result.json');

module.exports = {
	checkAdmin,
	checkAuthor,
	checkDescription,
	checkName,
	checkPackageName,
	checkUrl,
	checkPackages,
	trimWithEllipsis,
	writeComment
}

function trimWithEllipsis(string, length) {
  return string.length > length ? string.substring(0, length) + "…" : string;
}

function validateAdmin(userId){
	return userId === '3430869';
}

function checkAuthor() {
	if(submission.author !== undefined && submission.author.trim().length > 0) return true;
	writeComment(`Sorry, your submission was not valid: please provide an author`);
	return false;
}

function checkName() {
	if(submission.name !== undefined && submission.name.trim().length > 0) return true;
	writeComment(`Sorry, your submission was not valid: please provide a name`);
	return false;
}

function checkDescription() {
	if(submission.description !== undefined && submission.description.trim().length > 0) return true;
	writeComment(`Sorry, your submission was not valid: please provide a description`);
	return false;
}

function checkAdmin(userId){
	if(validateAdmin(userId)) return true;
	writeComment(`Sorry, you are not authorised to approve submissions. Please open a new subission and wait for approval.`);
	return false;
}

function validatePackageNameFormat(packageName) {
	return new RegExp('^([A-Za-z]{1}[A-Za-z\\d_]*\\.)+[A-Za-z][A-Za-z\\d_]*$', "g").test(packageName);
}

function validatePackageName(packageName, isNew) {
	if(packageName.trim() == "") return false;
	if(isNew && plugins.filter(plugin => plugin.package_name == packageName).length != 0) return false;
	let valid = validatePackageNameFormat(packageName);
	return valid;
}

function getUrlContentType(url) {
	const request = require('request');
	return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) resolve(undefined);
            if (response.statusCode != 200) {
                resolve(undefined)
            }
            resolve(response.headers['content-type']);
        });
    });
}

async function validateUrl(url) {
	if(!url.startsWith("https://")) return false;
	let contentType = await getUrlContentType(url);
    if(contentType === undefined) return false;
    if(url.endsWith(".json")){
        return contentType.startsWith("text/plain") || contentType.startsWith("application/json");
    }else{
        return contentType.startsWith("text/html");
    }
}

function validatePackages(packages) {
	if(packages.indexOf(",") != -1) {
		let splitPackages = packages.split(",");
		return splitPackages.some(package => validatePackageNameFormat(package));
	}else{
		return validatePackageNameFormat(packages);
	}
}

function writeComment(comment) {
	fs.writeFileSync("comment.txt", comment);
}

function checkPackageName(isNew) {
	let package_name = submission.package_name;
	if(validatePackageName(package_name, isNew)) return true;
	writeComment(`Sorry, the package name ${package_name} is already taken or is not valid. If you are trying to update your plugin, please use the update option instead.`);
	return false;
}

function getUrlContentType(url) {
	let request = require("request");
	return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) resolve(undefined);
            if (response.statusCode != 200) {
                resolve(undefined)
            }
            resolve(response.headers['content-type']);
        });
    });
}

async function verifyUrlContentType(url) {
	let contentType = await getUrlContentType(url);
	console.log(contentType);
}

async function checkUrl(required) {
	let url = submission.url
	if((url === undefined || url.trim().length == 0) && !required) return true;
	if(await validateUrl(url)) return true;
	writeComment(`Sorry, the provided plugin URL ${url} is not valid. Make sure it's a HTTPS URL (HTTP is not accepted), and either serves raw JSON or is a normal page (eg. Google Play). If you think this is a mistake, open a general issue to report the bug.`);
	return false;
}

function checkPackages() {
	let packages = submission.packages;
	if((packages === undefined || packages.trim().length == 0)) return true;
	if(validatePackages(packages)) return true;
	writeComment(`Sorry, the provided packages list is not valid. Check it's in the comma separated format, and all the package names are valid.`)
}
