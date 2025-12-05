const fs = require("fs").promises;
const path = require("path");

async function addFiles(filepath){
    const repoPath=path.resolve(process.cwd(),".Praveengit");
    const stagePath=path.join(repoPath,"stageing");
    try {
        await fs.mkdir(stagePath,{recursive:true});
        const fileContent=await fs.readFile(filepath);
        const filename=path.basename(filepath);
        await fs.writeFile(path.join(stagePath,filename),fileContent);

        console.log(`file ${filename} added to staging area`)
    } catch (error) {
        console.log("error in adding files")
    }
}
module.exports = {addFiles};
