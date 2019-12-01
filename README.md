# Civ Discord Bot

A discord bot that notifies when it's your turn in a play by cloud Civilization game

## Usage

Do the following.

### Set Up

Install dependencies

```sh
yarn && cd client && yarn
```

Create a PostgreSQL database

[Create a discord bot](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)

For local use, create a `.env` file and populate the following values:

```
DATABASE_URL=
DISCORD_TOKEN=
DISCORD_PREFIX=
```

### Start

Single command, this enables *watching*

```sh
yarn dev
```

### Deploy

Set up heroku and database

```sh
heroku login
heroku create
heroku addons:create heroku-postgresql:hobby-dev
```

Set up environment variables

```sh
heroku config:set DISCORD_TOKEN=XXX
heroku config:set DISCORD_PREFIX='Milk '
```

Do the deployment

```sh
git push heroku master
```

## Credits

[Michael Standen](https://michael.standen.link)

This software is provided under the [MIT License](https://tldrlegal.com/license/mit-license) so it's free to use so long as you give me credit.
