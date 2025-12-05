const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

async function commitRepo(message){
    const repoPath=path.resolve(process.cwd(),".Praveengit");
    const stagePath=path.join(repoPath,"stageing");
    const commitsPath=path.join(repoPath,"commits");
    try {
        const commitId=uuidv4();
        const commitDir=path.join(commitsPath,commitId);
        await fs.mkdir(commitDir,{recursive:true})
        
        const stageFiles=await fs.readdir(stagePath)
        for(const file of stageFiles){
            await fs.copyFile(path.join(stagePath,file),path.join(commitDir,file))
        }    
        await fs.writeFile(path.join(commitDir,"commit.json"),JSON.stringify({message,date:new Date().toISOString(),id:commitId}))

        console.log(`commit ${commitId} created successfully with message ${message}`)
    } catch (error) {
        console.error("error in commit",error)
    }
}
module.exports={commitRepo}