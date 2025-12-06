require('dotenv').config();
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const express = require("express"); 
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const {Server} = require("socket.io");
const mongoose = require("mongoose");
const mainRouter = require("./routes/mainRouter");

const { initRepo } = require("./controllers/init");
const { addFiles } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { revertRepo } = require("./controllers/revert");
const { pushFiles } = require("./controllers/push");
const { pullFiles } = require("./controllers/pull");


yargs(hideBin(process.argv))
/*  start command */ 
.command(
    'start',
    'this starts the server',
    () => {},
    startServer
)
/*  init command */ 
.command(
    'init',
    'this initializes git',
    () => {},
    initRepo
  )
/*  add command */ 
.command(
    'add <file>',
    'this adds files to git',
    (yargs) => {
        yargs.positional('file', {
            describe: 'File to add',
            type: 'string',
            demandOption: true,
        })
    },
    (args)=>{
        addFiles(args.file)
    },
    
  )
/*  commit command */ 
.command(
    'commit <message>',
    'this commits files to git',
    (yargs) => {
        yargs.positional('message', {
            describe: 'Commit message',
            type: 'string',
            demandOption: true,
        })
    },
    (args)=>{
        commitRepo(args.message)
    }
  )
/*  revert command */ 
.command(
    'revert <commit>',
    'this reverts files to git',
    (yargs) => {
        yargs.positional('commit', {
            describe: 'Commit to revert',
            type: 'string',
            demandOption: true,
        })
    },
    (args)=>{
        revertRepo(args.commit)
    }
  )
/*  push command */ 
.command(
    'push',
    'this pushes files to git',
    () => {},
    (args)=>{
        pushFiles(args.commit)
    }
  ) 
/*  pull command */ 
.command(
    'pull',
    'this pulls files from git',
    () => {},
    (args)=>{
        pullFiles(args.commit)
    }
  )
  .demandCommand(1, 'You need at least one command')
  .help()
  .argv;
  

async function startServer(){
    const app= express();
    const port= process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());

    app.use(bodyParser.urlencoded({extended:true}))

    const mongoURI=process.env.MONGO_URI;
    mongoose.connect(mongoURI).then(()=>{
        console.log("MongoDB connected")
    }).catch((err)=>{
        console.log("MongoDB connection error",err)
    })
    
    app.use(cors({origin:"*"}));

    app.use("/",mainRouter)

    
    const httpServer=http.createServer(app);
    const io=new Server(httpServer
        ,{
            cors:{
                origin:"*",
                methods:["GET","POST"],
            }
        }
    );
    let userId="test"
    io.on("connection",(socket)=>{
        socket.on("Joinroom",userId=>{
            user=userId;
            console.log("=====")
            console.log(user)
            console.log("=====")
            socket.join(user)
        })
    })

    const db = mongoose.connection
    db.on("error",console.error.bind(console,"connection error:"))
    db.once("open",()=>{
        console.log("Crud oprations called")
        // here we will write Curd operations 
    })

    httpServer.listen(port,()=>console.log(`Server running on port ${port}`))
}
