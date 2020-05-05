let express = require("express")
let mongodb= require("mongodb")
let sanitizehtml = require("sanitize-html")
let app = express()
let db 

let port = process.env.PORT
if (port == null || port == "")
{port =3000}
app.use(express.static("public"))
let connectionstring='mongodb+srv://arvindh:mypassword@cluster0-o6miv.mongodb.net/test?retryWrites=true&w=majority'
mongodb.connect(connectionstring, {useNewUrlParser: true , useUnifiedTopology: true },function (err,client){
db = client.db()
app.listen(port)
})
app.use(express.json())
app.use(express.urlencoded({extended : false}))

function passwordProtected (req,res,next){
    //console.log("THIS JUST RAN")
    res.set('WWW-Authenticate','Basic Realm="Simple To Do App"')
    //console.log(req.headers.authorization)
    if (req.headers.authorization == "Basic YXJ2aW5kaDp1bmljb3Ju")
    next()
    else
    res.status(401).send("Authentication Required")
}
app.use(passwordProtected)
app.get('/', function(req,res){
    db.collection('collection1').find().toArray(function (err, items){
        //console.log(items)
        res.send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple To-Do App</title>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
      <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>
        
        <div class="jumbotron p-3 shadow-sm">
          <form id = "create-form" action = "/create" method = "POST" >
            <div class="d-flex align-items-center">
              <input id="create-field" autofocus autocomplete="off" name = "item" class="form-control mr-3" type="text" style="flex: 1;">
              <button class="btn btn-primary">Add New Item</button>
            </div>
          </form>
        </div>
        
        <ul id ="item-list" class="list-group pb-5">

        </ul>
      </div>
      <script>
      let items = ${JSON.stringify(items)}
      </script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
      <script src="/webbrowser.js"></script>    
    </body>
    </html>`)
    })
    
})

app.post('/create',function(req,res){
    let safetext = sanitizehtml(req.body.text, {allowedTags: [] ,allowedAttributes: {} })
    db.collection('collection1').insertOne({ text : safetext }, function(err,info) {
    res.json(info.ops[0])
    })
})

app.post('/update',function(req,res){
    //console.log(req.body.text)
    let safetext = sanitizehtml(req.body.text, {allowedTags: [] ,allowedAttributes: {} })
    db.collection("collection1").findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: safetext}}, function(){
        res.send("success")
    })
})

app.post('/delete',function(req,res){
    //console.log(req.body.text)
    db.collection("collection1").deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function(){
        res.send("success")
    })
})
