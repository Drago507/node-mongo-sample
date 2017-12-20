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
        db.collection('messages')
            .find(
                {'chatId': ctx.message.chat.id}
                , (err, items) => {
                    if (err) {
                        // Die silently
                    } else {
                        items.aggregate(
                            [
                                {
                                    $group: {
                                        fromId: "$fromId",
                                        count: {$count: "$message_id"}
                                    }
                                }
                            ]
                        ).then((result) => {
                            console.log(result);
                        }).catch(() => console.log("error"));
                    }
                });
    }
};