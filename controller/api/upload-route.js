const fs = require('fs');
const mysql = require('mysql2');
const csv = require('fast-csv');
require('dotenv').config();
const multer = require('multer');
const router = require('express').Router();
 
global.__basedir = __dirname;
 
// -> Multer Upload Storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	   cb(null, __basedir + '/uploads/')
	   console.log('__basedir:', __basedir)
	//    console.log('__basedir + '/uploads/':', __basedir + '/uploads/')
	},
	filename: (req, file, cb) => {
	   cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
	}
});
 
const upload = multer({storage: storage});


router.get('/', (req, res) => {
    // find all events
    try {
      res.status(200).json({ message: 'api route upload file' });
    } catch (err) {
      res.status(500).json(err);
    }
  });

// -> Express Upload RestAPIs
router.post('/uploadfile', upload.single("uploadfile"), (req, res) =>{


	importCsvData2MySQL(__basedir + '/uploads/' + req.file.filename);
	res.json({
				'msg': 'File uploaded/import successfully!', 'file': req.file
			});
});

// -> Import CSV File to MySQL database
function importCsvData2MySQL(filePath){
    let stream = fs.createReadStream(filePath);
    let csvData = [];

    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // Remove Header ROW
            csvData.shift();

            console.log(csvData[0][1])

            for (let index = 0; index < csvData.length; index++) {
                csvData[index][3] = '1' 
            }
 
            // Create a connection to the database
            const connection = mysql.createConnection({
                host: 'localhost',
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            });
            
            
            // Open the MySQL connection
            connection.connect((error) => {
                if (error) {
                    console.error(error);
                } else {
                    let query = 'INSERT INTO guest (firstName, lastName, tableNumber, eventId) VALUES ?';
                    connection.query(query, [csvData], (error, response) => {
                        console.log(error || response);
                    });
                }
            });
			
			// delete file after saving to MySQL database
			// -> you can comment the statement to see the uploaded CSV file.
			fs.unlinkSync(filePath)
        });
 
    stream.pipe(csvStream);
}

// // Create a Server
// let server = app.listen(3030, function () {
 
//   let host = server.address().address
//   let port = server.address().port
 
//   console.log("App listening at http://%s:%s", host, port)
 
// })  

module.exports = router;