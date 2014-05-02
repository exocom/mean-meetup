exports.get = function (req, res) {
    var fs = require('fs'),
        path = require('path');

    var file, filePath;

    // We need to break down the path into folders and files
    if (req.params[0]) {
        filePath = req.params.path + req.params[0];
        pathParts = filePath.split('/');
        file = pathParts[pathParts.length - 1];
    } else {
        filePath = file = req.params.path;
    }


    // Do a check to see if the url was a folder or file The regEx checks for a extension min of 3 chars
    if (/\.[a-z]{3,}/ig.test(file)) {
        // This is a file request :)
        // Now lets check the images folder to see if the file exists
        filePath = path.join(__dirname, ('../images/' + filePath));
        fs.exists(filePath, function (exists) {
            if (exists) {
                // The file exits let's return it directly (I prefer to return the image and not put it in json)
                res.sendfile(filePath);
            } else {
                res.status(404).send('Not found'); // You really should send a json response here
            }
        });
    } else {
        // They requested a folder, you can do whatever here, ie return a json array of objects of all the images in the folder or do nothing.
        // Sending Not Found since we only return single images
        res.status(404).send('Not found'); // You really should send a json response here
    }
};

exports.delete = function (req, res) {
    var fs = require('fs'),
        path = require('path');

    var file, filePath;

    // We need to break down the path into folders and files
    if (req.params[0]) {
        filePath = req.params.path + req.params[0];
        pathParts = filePath.split('/');
        file = pathParts[pathParts.length - 1];
    } else {
        filePath = file = req.params.path;
    }

    if (/\.[a-z]{3,}/ig.test(file)) {
        // This is a file request :)
        // Now lets check the images folder to see if the file exists
        filePath = path.join(__dirname, ('../images/' + filePath));
        fs.exists(filePath, function (exists) {
            if (exists) {
                fs.unlink(filePath);

                res.status(200).send('Okay'); // You really should send a json response here
            } else {
                res.status(404).send('Not found'); // You really should send a json response here
            }
        });
    } else {
        // They requested a folder, you can do whatever here, ie return a json array of objects of all the images in the folder or do nothing.
        // Sending Not Found since we only return single images
        res.status(404).send('Not found');
    }
};


exports.put = function (req, res, next) {
    var fs = require('fs'),
        path = require('path'),
        BusBoy = require('busboy');

    var file, filePath;
    var busboy = new BusBoy({ headers: req.headers });

    // We need to break down the path into folders and files
    if (req.params[0]) {
        filePath = req.params.path + req.params[0];
        pathParts = filePath.split('/');
        file = pathParts[pathParts.length - 1];
    } else {
        filePath = file = req.params.path;
    }

    if (/\.[a-z]{3,}/ig.test(file)) {
        // This is a file request :)

        var folders = filePath.split('/');
        folders.pop(); // remove the file from the array
        folders = '/api/images/' + folders.join('/'); // join back together

        // Now lets check the images folder to see if the file exists
        filePath = path.join(__dirname, ('../images/' + filePath));

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding);
            file.on('data', function(data) {
                console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
            });
            file.on('end', function() {
                console.log('File [' + fieldname + '] Finished');
            });
        });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            // Save the file to disk
            file.pipe(fs.createWriteStream(filePath));
        });
        busboy.on('finish', function() {
            res.json({
                name: file,
                path: folders
            });
        });
        return req.pipe(busboy);
    } else {
        // They requested a folder, you can do whatever here, ie return a json array of objects of all the images in the folder or do nothing.
        // Sending Not Found since we only return single images
        res.status(404).send('Not found');
    }
}