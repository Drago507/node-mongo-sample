const noteRoutes = require('./note_routes');
const messageController = require('./bot_routes');

module.exports = function (app, bot, db) {
    app.get('/', (req, res) => {
        res.send('Welcome');
    });


    noteRoutes(app, db);
    // Other route groups could go here, in the future

    bot.command('top', (ctx) => messageController.getTop(ctx,db));
    bot.hears('hi', (ctx) => ctx.reply('Hey there!'));
    bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy!'));
    bot.on('message', (ctx) => messageController.addMessage(ctx,db));
};