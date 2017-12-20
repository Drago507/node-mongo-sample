var ObjectID = require('mongodb').ObjectID;

module.exports = {
    addMessage(ctx, db) {
        saveUserNewName(ctx, db);
        saveMessage(ctx, db);
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
            ]
        ).toArray((err, results) => {
            if (!err) {
                let resultText = "";
                let userPromises = [];
                results.forEach(function (result) {
                    userPromises.push(getUserByUserId(result._id,db));
                });
                Promise.all(userPromises).then((users) => {
                    results.forEach(function (result) {
                        let user = users.find(usr=> usr.userId);
                        resultText = resultText + user.firstName + " " + user.lastName + " : " + result.count;
                    });
                    ctx.reply(resultText);
                });

            }

        });
    }
};

function saveUserNewName(ctx, db) {
    db.collection('names').findOne({"userId": ctx.message.from.id}).then((item) => {
        if (item) {
            db.collection('names').updateOne(
                {"userId": ctx.message.from.id},
                {
                    "firstName": ctx.message.from.first_name,
                    "lastName": ctx.message.from.last_name,
                    "username": ctx.message.from.username
                },
                (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
        } else {
            db.collection('names').insertOne(
                {
                    "userId": ctx.message.from.id,
                    "firstName": ctx.message.from.first_name,
                    "lastName": ctx.message.from.last_name,
                    "username": ctx.message.from.username
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
        }
    })

}

function saveMessage(ctx, db) {
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
}

function getUserByUserId(userId, db) {

    return new Promise((resolve, reject) => {
        db.collection('names').findOne({"userId": userId}).then((item) => {
           resolve(item);
        });
    })

}