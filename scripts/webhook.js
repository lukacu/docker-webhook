const { execFile } = require("child_process");
const fs = require("fs");
const http = require("http");
const { Webhooks, createNodeMiddleware } = require("@octokit/webhooks");

const PORT = 9001;
const BRANCH = process.env.GITHUB_BRANCH;
const SECRET = process.env.GITHUB_SECRET;

function runUpdate() {
  if (!fs.existsSync("/scripts/update.sh")) {
    console.log("Update script not found: /scripts/update.sh");
    return;
  }

  execFile("/scripts/update.sh", (error, stdout, stderr) => {
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    if (error) {
      console.error("Update script failed:");
      console.error(error);
    }
  });
}

if (SECRET) {
  const webhooks = new Webhooks({
    secret: SECRET,
  });

  webhooks.on("ping", () => {
    runUpdate();
  });

  webhooks.on("push", ({ payload }) => {
    const pushedBranch = payload.ref?.replace("refs/heads/", "");

    if (!BRANCH || pushedBranch === BRANCH) {
      runUpdate();
    } else {
      console.log(`Ignoring push to branch: ${pushedBranch}`);
    }
  });

  webhooks.onError((error) => {
    console.error("Webhook error:");
    console.error(error);
  });

  http
    .createServer(createNodeMiddleware(webhooks, { path: "/" }))
    .listen(PORT, () => {
      console.log(`Webhook server listening on port ${PORT}`);
    });
} else {
  console.log(
    "WARNING: no GITHUB_SECRET given, running in dev mode, any call to webhook url will trigger update script"
  );

  http
    .createServer((req, res) => {
      runUpdate();
      res.statusCode = 200;
      res.end("OK");
    })
    .listen(PORT, () => {
      console.log(`Dev webhook server listening on port ${PORT}`);
    });
}
