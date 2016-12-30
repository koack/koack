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

And update the required fields. You can create a Slack token on [your Slack apps page](https://api.slack.com/apps)).

## Run

Start watching the source and enjoy the examples

```
npm run watch
```
