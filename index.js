const express = require('express')
const mongoose = require('mongoose')
const hbs = require('hbs')
const fs = require('fs')
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto'); /// to generate file names
const multer = require('multer'); // 
const GridFsStorage = require('multer-gridfs-storage');  // used to create crud 
const Grid = require('gridfs-stream');    /// badal crud 3ala schema
const methodOverride = require('method-override'); // 
const router = express.Router()



// Require Router Handlers
const investor = require('./app/routes/api/Investor')
const Staffi = require('./app/routes/api/Staff')
// const Cases = require('./app/routes/api/Cases')
const Notification = require('./app/routes/api/Notifications')
const questions = require('./app/routes/api/Questions')
const Commentj = require('./app/routes/api/Comments')
// const fun = require('./app/routes/api/Cases_func')
const Perform = require('./app/routes/api/Performance')
const Admin = require('./app/routes/api/Admin')
const routes = require('./app/routes.js')

// const routes = require('./app/routes.js')
// const AdminController= require('./app/Controllers/AdminController')
//AdminController.AdminChangePricingStrategy("revenues159", 10)
//console.log(Cases_func.revenue159)

global.heroku = "https://angrynerds1.herokuapp.com"

const app = express()
app.set('view engine', 'hbs')

// DB Config
const db = require('./config/keys').mongoURI

// Connect to mongo
mongoose
    .connect("mongodb+srv://ramyGabra:Nike-1234@angrynerds-ymdpc.mongodb.net/test?retryWrites=true")
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err))

// Init middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))



// Entry point
app.get('/', (req,res) => res.send(`<h1>Hello World!</h1>`))
app.get('/Ramy', (req,res) => res.send('<h1>Ramy test page</h1>'))
app.get('/test', (req,res) => res.sendFile(__dirname + '/views/test.html' ))  


app.get('/payment',(req,res)=>{
    //res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./views/payment.html',null,function(error,data){
        if(error){
            res.writeHead(404)
            return
        }
        else{

            res.write(data)
            return

        }
            

    })
})

// //////////TESTING/////////////


// Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');          // change with react later

// Mongo URI
const mongoURI = 'mongodb+srv://ramyGabra:Nike-1234@angrynerds-ymdpc.mongodb.net/test?retryWrites=true';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;     ////  variable for grid fs stream

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);   /// when database coonection is open we need to fet gfs tp gtid
  gfs.collection('uploads');   // picturs will be in uploads   'uploads da el collection name'
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////uploading/////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);   /// save da fel schema beta3 el user 
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage });    // uploading to database        

// app.get('')

// @route POST /upload       
// @desc  Uploads file to DB                                             // need to edit this to post the profile of user schema
app.post('/upload/:id', upload.single('file'), async (req, res) => {    // file is the name of the file field from the HTML doc 
   try {
    const id = req.params.id  // id of picture
    const investor = await Investor.findByIdAndUpdate(id, { 'photoID': id,  })    //   putting the photo id in schema
  
    if(!investor){
        res.status(200).json({data: 'Fail' })    
    }
    else{
        res.json({ msg: 'Form updated successfully', data: investor })
   
    }}
    catch (error) {
         console.log(error)
        
    }
//    const newInvestor = await Investor.findById(id)
    //const inv = JSON.stringify(investor.photoID)
    // const json = JSON.stringify(investor);

     //res.status(200).json({data: 'Success' })


    // res.json({ file: req.file.filename });     /// id el pic el hayroo7 el schema " make it a global variable ?"  findbyidandupdate
    //res.json( {id: investor._id} );     /// id el pic el hayroo7 el schema " make it a global variable ?"  findbyidandupdate

    //console.log("Imhere")

//   res.redirect('/');                            // redirects to home page , change it to whatever 
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////uploading END/////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// @route GET /files
// @desc  Display all files in JSON                     // displays all Uploded pics as querys from mongo db atlas
app.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
      // Check if files
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
  
      // Files exist
      return res.json(files);
    });
  });
  
  // @route GET /files/:filename
  // @desc  Display single file object                        /// display query results from mongodb atlas
  app.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
      // File exists
      return res.json(file);
    });
  });
  
  // @route GET /image/:filename                                ///// to be able to retrive image using filename  "take file name from investor,"
  // @desc Display Image                     to se uploaded pic   /// http://localhost:3000/image/9f2afd767a8c1dd18de66671eeb5ea33.jpg  :)
  app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {      
      // Check if file
      if (!file || file.length === 0) {
        return res.status(404).json({
          err: 'No file exists'
        });
      }
  
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Read output to browser
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  });
  





// ///////////END OF TESTING/////////////


// Direct to Route Handlers
app.use('/api/Staff', Staffi)
// app.use('/api/Cases', Cases)
app.use('/api/Investor', investor)
app.use('/api/Notifications', Notification)
app.use('/api/Questions', questions)
app.use('/api/Comments',Commentj)
app.use('/api/Admin',Admin)
 app.use('/', routes)

app.use((req,res) => res.status(404).send(`<h1>Can not find what you're looking for</h1>`))



const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server on ${port}`))
