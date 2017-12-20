const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();

const Telegraf = require('telegraf');
const bot = new Telegraf('133754619:AAHlBmiqFdf3yIl-1RNVmomwVBrY3JSlOvw');

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));


bot.start((ctx) => {
    console.log('started:', ctx.from.id);
    return ctx.reply('Welcome!')
});

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err);
    require('./app/routes')(app, bot, database);

    app.listen(port, () => {
        console.log('We are live on ' + port);
    });

    bot.startPolling();

});