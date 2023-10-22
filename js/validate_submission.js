const fs = require('fs');
const { URL, parse } = require('url');
const homedir = require('os').homedir();

let submission = require(homedir + '/issue-parser-result.json');
let validation = require('./validation.js');

async function main() {
	if(validation.checkPackageName(true) && validation.checkAuthor() && validation.checkName() && validation.checkDescription() && await validation.checkUrl(true) && validation.checkPackages()) {
		validation.writeComment(`✅ Your submission passes validation. It will now be manually approved before being allowed on the repository. If you realise you have made a mistake, please close this issue and open a new submission with the corrected information.`);
		console.log("result=true");
	}else{
		console.log("result=false");
	}
}

main();
