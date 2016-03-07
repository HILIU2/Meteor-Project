if(Apps.find({}).count() < 1){

    var fs = Npm.require('fs');

    fs.readFile('../../../../../server/data.json', 'utf8', Meteor.bindEnvironment(function(err, data) {

        if (err) throw err;
            var newAppData = data.split("\n");

        for (var i = 0; i < newAppData.length - 1; i++) {
            var rawAppData = JSON.parse(newAppData[i]);
            var newApp = {};

            newApp.name = rawAppData.title;
            newApp.app_id = rawAppData.app_id;
            newApp.developer = rawAppData.developer;
            newApp.description = rawAppData.intro;
            newApp.avgRating = parseInt(rawAppData.score) / 2;
            newApp.iconUrl = rawAppData.thumbnail_url;
            newApp.reccomendedApps = rawAppData.top_5_app;
            newApp.numberOfRecommendations = 0;

            Apps.insert(newApp);
        }
        
        // Project Assignment code goes here
        var cursor = Apps.find({});
        var array = new Array();

        cursor.forEach(function(app){
            top5 = app.reccomendedApps;
            if(top5 != null)
                for(var i = 0; i < 5; i++){
                    array.push(top5[i]);
            }
        });

        array.sort();

        var sumArray = new Array();
        for(i = 0; i < array.length; ++i){
            if(!sumArray[array[i]]) {
                sumArray[array[i]] = 0;
            }
            ++ sumArray[array[i]];
        }

        for(var key in sumArray){
            Apps.update({app_id: key}, {$set: {numberOfRecommendations :sumArray[key]}});
        }
        // console.log(sumArray);

        }, function(err){
            throw err;
        }));
}