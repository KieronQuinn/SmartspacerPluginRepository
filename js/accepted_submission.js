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

function writeSubmission() {
	plugins.push({
		"owner": author,
		"author": submission.author,
		"package_name": submission.package_name,
		"name": validation.trimWithEllipsis(submission.name, 50),
		"description": validation.trimWithEllipsis(submission.description, 200),
		"url": submission.url,
		"packages": submission.packages
	})
}

async function main() {
	if(validation.checkAdmin(labeler) && validation.checkAuthor() && validation.checkName() && validation.checkDescription() && validation.checkPackageName() && await validation.checkUrl() && validation.checkPackages()) {
		writeSubmission();
		plugins = plugins.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
		validation.writeComment(`Thank you, your plugin has been added`);
		fs.writeFileSync('plugins.json', JSON.stringify(plugins, null, "\t"));
		console.log("result=true");
	}else{
		console.log("result=false");
	}
}

main();
