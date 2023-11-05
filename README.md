# Smartspacer Plugin Repository

![Smartspacer Logo](https://i.imgur.com/CfHF7Dkl.png)

This repo is the central location for finding Smartspacer Plugins, and is used by the app to know where to look to download them.

## Submitting a Plugin

To submit a plugin, first make a `plugin.json` file somewhere public, ideally on GitHub or another similar site. It should have the following contents:

```
{
	"description": "Your plugin's description, this can be as long as you like, contain Markdown and links, and will be displayed by the app on the details page",
	"download_url": "https://example.com/path-to-your-apk-direct-download.apk",
	"version_code": 1,
	"changelog": "Optional release notes for this version",
	"required_package": "any.apps.that.must.be.installed",
	"screenshots": ["https://example.com/path-to-screenshot.jpg", "https://example.com/path-to-another-screenshot.jpg"]
}
```
This JSON file is your responsibility, you can update it whenever you like with plugin updates, screenshots, etc. Simply update the version code to a higher number to trigger an "update". 

Next, create an issue in this repository. Use the "New Plugin" option, and fill out all the required fields. 

Once the issue has been created, an automated GitHub Action will check over your input, make sure the JSON is valid, and reply with confirmation. Your plugin will then be manually approved, before being allowed onto the Repository.

### Plugins Hosted on Google Play or another Store

If your plugin is hosted on Google Play, or another store where the user is able to have updates installed by a store app, you do not need to use the `plugin.json` system. Simply provide a web link which will open to the details page of your app in the store app (this must also be accessible on the web - `market://` links are not valid) in the submission form instead of the JSON link.

## Updating Plugins

You do not need to create a new issue to update plugins, simply update your JSON file.

## Changing Name, Short Description, Author

You can create a new issue to update the basic information about your plugin, which is stored in this repository. Once again, it will be approved before being allowed onto the repository. Only the same GitHub user who submitted the plugin can create this issue, or it will be rejected.

## Transferring Ownership

If you wish to transfer "ownership" of a plugin to a different GitHub user, you can use the transfer option when creating an issue. You will need to use the old user, one last time, or it will be rejected.

## Deleting a Plugin

You can use the delete option when creating an issue to delete your plugin. This action must be taken by the same GitHub user who submitted it.

## Other Requests

Use the "General Request" option when creating an issue for anything else related to the plugin repository, but please do not submit plugin requests here. They will be closed, and repeat offenders may be banned.
