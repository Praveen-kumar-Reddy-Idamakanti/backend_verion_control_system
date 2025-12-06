const createIssue=(req,res)=>{
    res.send("Issue created")
};

const getAllIssues=(req,res)=>{
    res.send("All issues fetched")
};

const getIssueById=(req,res)=>{
    res.send("Issue by id fetched")
};

const updateIssueById=(req,res)=>{
    res.send("Issue updated")
};

const deleteIssueById=(req,res)=>{
    res.send("Issue deleted")
};


module.exports={
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssueById,
    deleteIssueById
}