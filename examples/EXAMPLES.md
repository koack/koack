# EXAMPLES

Here are a few basic examples:

- `hello-bot`: a simple standalone bot
- `hello-pool`: a simple bot pool

## Install

Clone the `koack` repository:

```
mkdir koack-test
cd koack-test
yarn install
```

Link the koack package:

```
yarn link
yarn link koack
```

Copy the config file to make the example works

```
cp examples/src/config.example.js examples/src/config.js
```

Update the required fields.

- `token`: You can create a Slack app token for testing by clicking *Bots* menu entry on [this page](https://birdybot.slack.com/apps/manage/custom-integrations).
- `slackClient`:
  - If you don't have a Slack app for testing yet, create one on [the dedicated Slack app page](https://api.slack.com/apps)).
  - Copy the ID and secret (in "Basic informations")
  - Set a redirect url to `http://localhost:3000/callback` (in "Oauth and permissions")
  - Add a bot user (in "Bot Users")

## Run

Compile the sources, then start the example of your choice:

```
npm run build
```

## For the simple bot

```
node examples/node6/hello-bot/index.js
```

And go in your Slack, you'll see your bot in action

### For the pool bot

```
node examples/node6/hello-pool/index.js
```

Then add the bot by going on [http://localhost:3000/success](http://localhost:3000/success) and go in your Slack channels to see it in action
