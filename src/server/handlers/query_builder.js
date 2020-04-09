/**
 * build query from json object
 *
 * Expected data structure:
 *
 * where Name is name of label (column in DB)
 *      contain is a flag if it is must be found in textfield or not
 *
 *
 * {
 *     NAME:[{contain: Bool, value: String}]
 * }
 *
 * For:
 *  {
        "name":[{"contain":false, "value": "2"}, {"contain":true, "value": "team"}],
        "year":[{"contain":true, "value": "2020"}]
    }
 *
 *
 * Result will be:
 * {
    "bool": {
      "must": [
        {
          "match": {
            "name": "team "
          }
        },{
            "match": {
            "year": "2020"
        }
      ],
      "must_not" : [{
          "match": {
            "name": "2"
          }
        }]
    }
  }
 */

const morgen = require('morgan');

function buildQuery(object) {
    let query_obj = {}, must = [], must_not = [];

    for (var prop in object) {
        if (Object.prototype.hasOwnProperty.call(object, prop)) {
            //console.log(object[prop]);
            if (Array.isArray(object[prop])) {
                for(var el of object[prop]) {
                    if(el.contain) {
                        must.push({
                            match : {
                                [prop] : el.value
                            }
                        });
                    } else {
                        must_not.push({
                            match : {
                                [prop] : el.value
                            }
                        });
                    }
                }
            } else {
                if(object[prop].contain) {
                    must.push({
                        match : {
                            [prop] : object[prop].value
                        }
                    });
                } else {
                    must_not.push({
                        match : {
                            [prop] : object[prop].value
                        }
                    });
                }
            }
        }
    }

    query_obj = {
        bool : {
            must : must,
            must_not : must_not
        }
    };

    //console.log(query_obj);
    return query_obj;
}

module.exports = buildQuery;