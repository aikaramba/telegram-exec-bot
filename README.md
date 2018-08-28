# Telegram execute bot

## About

Bot listens to messages and executes them as bash commands.

Only admin user messages are executed.

Output stream chunks are sent back as replies.

I've created this bot to make it easy to control my remote RaspberryPi's without
configuring a dedicated SSH server.

## Installing

1) Add you user id and telegram bot API key to config/[environment].js files:

```
{
    "BOT_TOKEN": "YOUR_TELEGRAM_BOT_TOKEN_HERE",
    "ADMIN_ID": "YOUR_TELEGRAM_ADMIN_USER_ID_HERE"
}
```

2) Start the bot

```
npm run prod
# or
npm run dev
```

## Acquiring a bot token

Talk to [BotFather](https://t.me/BotFather) if you need to register a new bot.