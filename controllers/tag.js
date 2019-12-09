var tagmodel = require('../models/tag');

module.exports.getTagTable = async function (req, res, next) {
    let query = {};
    let params = {};

    let sortingType;
    if (req.body.order[0].dir === 'asc')
        sortingType = 1;
    else
        sortingType = -1;

    if (req.body.search.value) {
        query["$or"] = [{
                "tagname": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "createdby": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "createddate": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            }
        ]
    } else {
        if (req.body.order[0].column === '0')
            params = {
                skip: parseInt(req.body.start),
                limit: parseInt(req.body.length),
                sort: {
                    tagname: sortingType
                }
            };
    }

    query["$and"] = [{
        "deleted": "0"
    }]

    tagmodel.find(query, {}, params, function (err, data) {
        if (err)
            console.log(err);
        else {
            tagmodel.countDocuments(query, function (err, filteredCount) {
                if (err)
                    console.log(err);
                else {
                    tagmodel.countDocuments(function (err, totalCount) {
                        if (err)
                            console.log(err);
                        else
                            res.send({
                                "recordsTotal": totalCount,
                                "recordsFiltered": filteredCount,
                                data
                            });
                    })
                }
            });
        }
    });
}

module.exports.addTag = async function (req, res, next) {
    let newTag = new tagmodel({
        tagname: req.body.value,
        createdby: req.session.name,
        createddate: req.body.datestr,
        deleted: '0'
    })
    newTag.save()
        .then(data => {
            res.send("true")
        })
        .catch(err => {
            res.send("false");
        })
}

module.exports.deletetag = async function (req, res, next) {
    tagmodel.updateOne({
            tagname: req.body.tagname,
            createdby: req.body.createdby,
            createddate: req.body.createddate
        }, {
            $set: {
                "deleted": "1"
            }
        })
        .then(data => {
            res.send("true")
        })
        .catch(err => {
            res.send("false")
        })
}

module.exports.checkDuplicate = async function (req, res, next) {
    tagmodel.find({
        deleted: '0'
    }).exec(function (error, result) {
        if (error)
            throw error;
        else {
            var temp = [];
            var returnflag = "false";
            temp = result;
            for (i in result)
                if (req.body.tagname == temp[i].tagname)
                    returnflag = "true";
            res.send(returnflag);
        }
    })
}

module.exports.edittag = async function (req, res, next) {
    tagmodel.updateOne({
        "tagname": req.body.oldtagname
    }, {
        $set: {
            "tagname": req.body.newtagname
        }
    }, function (error, result) {
        if (error)
            res.send("false")
        else {
            console.log("Updated tag ->edittag");
            res.send("true");
        }
    })
}