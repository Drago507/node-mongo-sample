var ObjectID = require('mongodb').ObjectID;

module.exports = {
    addMessage(ctx, db) {
        const message = {
            message_id: ctx.message.message_id,
            fromId: ctx.message.from.id,
            date: ctx.message.date,
            chatId: ctx.message.chat.id,
            chatType: ctx.message.chat.type,
            userLeftChat: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        db.collection('messages').insertOne(message, (err, result) => {

        });
    },
    getTop(ctx, db) {
        db.collection('messages').aggregate([
                {$match: {'chatId': ctx.message.chat.id}},
                {
                    $group: {
                        _id: "$fromId",
                        count: {$sum: 1}
                    }
                }
            ], {}, function (results) {
                console.log(results)
            }
        )
    }
};