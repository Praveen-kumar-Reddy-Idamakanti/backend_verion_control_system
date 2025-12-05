const fs = require("fs").promises;
const path = require("path");
const { s3,S3_BUCKET } = require("../config/aws-config");

async function pushFiles(){
    const repoPath=path.resolve(process.cwd(),".Praveengit");
    const commitsPaths=path.join(repoPath,"commits");
    try {
        const commitDirs=await fs.readdir(commitsPaths);
        for (const commitDir of commitDirs){
            const commitPath=path.join(commitsPaths,commitDir)
            const commitFiles=await fs.readdir(commitPath)
            for (const commitFile of commitFiles){
                const filePath=path.join(commitPath,commitFile)
                const fileContent=await fs.readFile(filePath)
                const params={
                    Bucket:S3_BUCKET,
                    Key:`commits/${commitDir}/${commitFile}`,
                    Body:fileContent
                }
                await s3.upload(params).promise()
            }
        }
        console.log("files pushed successfully")
    } catch (error) {
        console.error("error in pushing files",error)
    }
}
module.exports={pushFiles}