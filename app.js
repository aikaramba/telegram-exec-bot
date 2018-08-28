/** Lib init */
const Telegraf = require('telegraf');
const { fork } = require('child_process');
const config = require('config');

/** Config init */
const EXECUTE_MODULE_FILEPATH = './lib/execute.js';
const bot = new Telegraf(config.BOT_TOKEN);
const ADMIN_ID = config.ADMIN_ID;

/** Globals */
let childProcess = null;

/** Admin user check middleware */
bot.use((ctx, next) => {
    const isAdmin = ctx.update.message.from.id.toString() === ADMIN_ID.toString();
    ctx.update.message['isAdmin'] = isAdmin;
    return next(ctx);
})

/** Main logic */
bot.hears(/.+/, (ctx) => {
    const { reply } = ctx;
    const { text, from, isAdmin } = ctx.update.message;

    /** Admin check */
    if (isAdmin) {
        if(childProcess === null) {
            /** If process is not running */
            childProcess = fork(EXECUTE_MODULE_FILEPATH, [text], { silent: true });
            childProcess.stdout.on('data', (data) => reply(data.toString()));
            childProcess.stderr.on('data', (data) => reply(data.toString()));
            childProcess.on('exit', (code, signal) => {
                childProcess = null;
                ctx.reply('Process has been killed');
            });
        } else {
            /** If process is running */
            if(text === '/kill') {
                childProcess.kill();
            } else {
                ctx.reply('Another process is running...\n Wait for it to complete, or kill it using the /kill command');
            }
           
        }
    }
});

/** Bot error handling */
bot.catch((err) => {
  console.error('Bot has encountered an error:', err)
});

/** Start listening to updates */
bot.startPolling();

/** Cleanup */
process.on('exit', () => {
    if (childProcess) childProcess.kill();
});
