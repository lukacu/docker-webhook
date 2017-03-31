Github webhook Docker image
===========================

This image can be used as a base image for websites, documentation or any other kind of content that is built from a Github repository. Automatic builds can be triggered using Github [webhooks](https://en.wikipedia.org/wiki/Webhook).

The image uses nginx web server and [github-webhook-handler](https://github.com/rvagg/github-webhook-handler) node.js module to handle webhooks. It can be mostly configured using several environmental variables.

 * `ROOT_PATH` - the path of the root directory that is served by the webserver, defaults to `/srv/www/build`.
 * `WEBHOOK_PATH` - the path part of the webhook, defaults to `webhook` which means that the webhook URL is `http(s)://<server>/webhook`.
 * `GITHUB_USERNAME` - user or organization name.
 * `GITHUB_REPOSITORY` - repository name.
 * `GITHUB_BRANCH` - branch of the Github repositry, defaults to `master`.
 * `GITHUB_SECRET` - secret payload that should be presented by the remote party to trigger webhook.

The building process relies on two scripts. Script `/scripts/init.sh` is run every time the container is started. Script `/scripts/update.sh` is run every time the the webhook is triggered. Both scripts are run as `www-data` user.

