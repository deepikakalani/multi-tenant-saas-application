var multer = require('multer');
var fs = require('fs');
var request = require('request').defaults({ encoding: null });
var mysql = require('mysql');
var tenantname;
var tenant1 = 'Tenant1';
var tenant2 = 'Tenant2';
var tenant3 = 'Tenant3';
var tenant4 = 'Tenant4';

exports.signin = function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('login.ejs', { message: 'Welcome' }); 
};


exports.signedin = function(req, res) {
	
	res.render('application.ejs', { message: 'Welcome' });
	
};

exports.generateuml = function(req, res){
	var originalname;
	var storage = multer
	.diskStorage({
		destination : function(req, file, cb) {
			cb(null, './public/uploads');
		},
		filename : function(req, file, cb) {
			cb(null, file.originalname);
			originalname = file.originalname; 
		}
	});
	var upload = multer({storage : storage}).single('file_upload');
	
	upload(req, res, function(err) {
		
		if (err) {
			return;
		}
		tenantname = req.body.selectpicker;
		var diagram_type = req.body.diagram_type;

		var formData = {file: fs.createReadStream('./public/uploads/' + originalname)};
		var url = 'http://multi-tenant-lb-1317473332.us-west-2.elb.amazonaws.com:8050/' + tenantname.toLowerCase() + '/uml/' + diagram_type;
		console.log(url);
		request.post({url:'http://multi-tenant-lb-1317473332.us-west-2.elb.amazonaws.com:8050/' + tenantname.toLowerCase() + '/uml/' + diagram_type, formData: formData}, function optionalCallback(err, httpResponse, body) {
			  if (err) {
			    return console.error('upload failed:', err);
			  }
			  console.log('Upload successful!  Server responded with:', httpResponse.body);
			  fs.writeFile('./public/uploads/diagram.png', httpResponse.body, function(err){
				    if(err) {
				        return console.log(err);
				    }
				    console.log("The file is received from server as diagram.png!");
				}); 
			  res.render('index.ejs', {tenantname: tenantname });
			});
	});
};

exports.grades = function(req, res){
	var gradereceived;
	var connection = mysql.createConnection({
		  host     : 'mysqlinstance.ctzt5sp9wgsl.us-west-2.rds.amazonaws.com',
		  user     : 'root',
		  password : 'root1234',
		  database : 'grades'
		});
		console.log("connection estabilished");
		if(tenantname === tenant1){
			gradereceived = req.body.optradio;	
			var queryString = 'INSERT INTO grades.'+ tenantname.toLowerCase() + ' (grade) VALUES('+ "'" +gradereceived + "'" + ');';
			connection.query(queryString, function(err, rows){
				if (!err){
					console.log('The solution is: ', rows);
				}
				else{
					console.log('Error while performing Query.' + err);
				}			
			});
		}
		
		else if(tenantname === tenant2){		
			gradereceived = req.body.points;
			var queryString = 'INSERT INTO grades.'+ tenantname.toLowerCase() + ' (points) VALUES('+ "'" +gradereceived + "'" + ');';
			connection.query(queryString, function(err, rows){
				if (!err){
					console.log('The solution is: ', rows);
				}
				else{
					console.log('Error while performing Query.' + err);
				}
			
			});
		}
		
		else if(tenantname === tenant3){
			gradereceived = req.body.points;
			var queryString = 'INSERT INTO grades.'+ tenantname.toLowerCase() + ' (comment) VALUES('+ "'" +gradereceived + "'" + ');';
			connection.query(queryString, function(err, rows){
				if (!err){
					console.log('The solution is: ', rows);
				}
				else{
					console.log('Error while performing Query.' + err);
				}
			});
		}
		
		else if(tenantname === tenant4){
			gradereceived = req.body.points;
			var queryString = 'INSERT INTO grades.'+ tenantname.toLowerCase() + ' (points) VALUES('+ "'" +gradereceived + "'" + ');';
			connection.query(queryString, function(err, rows){
				if (!err){
					console.log('The solution is: ', rows);
				}
				else{
					console.log('Error while performing Query.' + err);
				}
			});
		}
		
		var selectQuery = 'SELECT * from grades.' + tenantname.toLowerCase();
		connection.query(selectQuery, function(err, rows) {
			if (!err)
				console.log('The solution is: ', rows);
			else
				console.log('Error while performing Query.' + err);
		});
		connection.end();
		
		res.render('application.ejs', { message: 'Grade saved successfully. ' });
		
};