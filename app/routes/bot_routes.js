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
                results.forEach(function (result) {
                    db.collection('names').findOne({"userId": result._id},{},function(err,user){
                        console.log("item", user);
                        resultText = resultText + (user.firstName || " " ) + " " + (user.lastName || " " ) + " : " + result.count + "\n";
                    });
                });
                ctx.reply(resultText);
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

    return {
        "userId": 110045967,
        "firstName": "Maryamy",
        "lastName": null,
        "username": "hz_maryam"
    };
    db.collection('names').findOne({"userId": userId}, function (error, item) {
        console.log("item", item);
        if (error) {
            console.log("error retrieving user name data ", userId);
            console.log(error);
        } else {
            console.log("no error", item);
            console.log(item);
        }
    })
}