const fs = require("fs").promises;
const path = require("path");
const { s3,S3_BUCKET } = require("../config/aws-config");

async function pullFiles(){
    const repoPath=path.resolve(process.cwd(),".Praveengit");
    const commitsPath=path.join(repoPath,"commits");
    try {
        const data=await s3.listObjectsV2({Bucket:S3_BUCKET,Prefix:"commits/"}).promise()
        const objects = data.Contents;
        for(const object of objects){
            const key=object.Key;
            path.dirname(key).split("/").pop();
            await fs.mkdir(commitsPath,{recursive:true});
        const params={
            Bucket:S3_BUCKET,
            Key:key,
        }
        const fileContent=await s3.getObject(params).promise()
        await fs.writeFile(path.join(repoPath,key),fileContent.Body)
        console.log(`file ${key} pulled successfully`)
        }
        

    } catch (error) {
        console.error("error in pull files",error)
    }
}
module.exports={pullFiles}