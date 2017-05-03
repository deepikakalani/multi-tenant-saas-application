var express = require('express');
var exec = require('child_process').exec;
var multer = require('multer');
var app = express();
var bodyParser = require('body-parser');
var port = "8050";
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


router.get('/', function(req, res) {
      res.json({ message: 'hooray! welcome!' });
 });

router.route('/uml')

        .post(function(req, res){

                var storage = multer
                .diskStorage({
                        destination : function(req, file, cb) {
                                cb(null, '/home/deepika/Projects');
                        },
                        filename : function(req, file, cb) {
                                cb(null, "renamed_seq.txt");
                        }
                });

                var upload = multer({storage : storage}).single('file');
    
                upload(req, res, function(err) {
    
                        if (err) {
                                console.log("Inside error");
                                console.log(err);
                                return;
                        }
    
                        console.log("Hello File is uploaded");

                        command = 'java -jar ./GetCompilationUnit.jar /home/deepika/Projects/cmpe202/umlparser/uml-parser-test-5 umlparser'
                        var child = exec(command , function (error, stdout, stderr){
                                console.log('Output -> ' + stdout);
                                if(error !== null){
                                        console.log("Error -> "+error);
                                }

                                var child = exec(command_png , function (error, stdout, stderr){
                                    console.log('Output -> ' + stdout);
                                    if(error !== null){
                                            console.log("Error -> "+error);
                                    }
                            });

                    });


            });
        });

app.use('/tenant1', router);
app.listen(port, function () {
console.log('Example app listening on port!' + port);
})
