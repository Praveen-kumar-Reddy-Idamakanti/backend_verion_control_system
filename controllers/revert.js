const fs = require("fs").promises;
const path = require("path");

async function revertRepo(commitId) {
    const repoPath = path.resolve(process.cwd(), ".Praveengit");
    const commitsPath = path.join(repoPath, "commits");
    
    try {
        const commitDir = path.join(commitsPath, commitId);
        const commitFiles = await fs.readdir(commitDir);
        
        const parentDir = path.dirname(repoPath);
        
        let fileCount = 0;
        
        // Process each file in the commit
        for (const commitFile of commitFiles) {
            if (commitFile === 'commit.json') continue; // Skip the commit metadata file
            
            const sourcePath = path.join(commitDir, commitFile);
            const destPath = path.join(parentDir, commitFile);
            
            try {
                await fs.copyFile(sourcePath, destPath);
                console.log(`Restored: ${commitFile}`);
                fileCount++;
            } catch (error) {
                console.error(`Failed to restore ${commitFile}:`, error.message);
            }
        }
        
        if (fileCount > 0) {
            console.log(`Successfully reverted ${fileCount} files from commit ${commitId}`);
        } else {
            console.log('No files were reverted. The commit might be empty or only contains a commit.json file.');
        }
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            if (error.path && error.path.includes(commitId)) {
                console.error(`Error: Commit ${commitId} not found in the repository.`);
            } else {
                console.error('Error: .Praveengit directory not found. Are you in the root of your repository?');
            }
        } else {
            console.error('Error during revert:', error.message);
        }
    }
}

module.exports = { revertRepo };