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

- `token`: You can create a Slack token for test on [this page](https://api.slack.com/docs/oauth-test-tokens).
- `slackClient`: You can get key and secret for Slack app on [your Slack apps page](https://api.slack.com/apps)).

## Run

Compile the sources, then start the example of your choice:

```
npm run build
```

then

```
node examples/node6/hello-bot/index.js
```

or

```
node examples/node6/hello-pool/index.js
```
