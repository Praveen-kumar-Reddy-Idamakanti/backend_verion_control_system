const fs = require("fs").promises;
const path = require("path");

async function initRepo(){
    const repoPath=path.resolve(process.cwd(),".Praveengit")
    const commitsPath=path.join(repoPath,"commits")
    try{
        await fs.mkdir(repoPath,{recursive:true})
        await fs.mkdir(commitsPath,{recursive:true})
        await fs.writeFile(path.join(repoPath,"config.json"),JSON.stringify({
            bucket: process.env.S3_BUCKET
        }))
        console.log("Repository initialized successfully")
    }catch(err){
        console.log("Repository already initialized or error in creating repository")
    }
}
module.exports = {initRepo};
