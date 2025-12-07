const mongoose = require("mongoose");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");


async function createIssue(req,res){
    const {title,description,status,repository} = req.body
    try{
        if(!title){
            return res.status(400).json({message:"Title is required",issue:"creations Failed"})
        } 
        if (!mongoose.Types.ObjectId.isValid(repository)){
            return res.status(400).json({message:"Invalid Repository ID",issue:"creations Failed"})
        }
        const repoId = new mongoose.Types.ObjectId(repository);
        const newIssue=new Issue({
            title,
            description,
            status,
            repository:repoId
        })
        const result = await newIssue.save()
        res.status(201).json({message:"Issue created successfully",issue:result})
    }   
    catch(error){
        res.status(500).json({message:error.message,issue:"creations Failed"})
    } 
};

async function getAllIssues(req,res){
    try{
        const issues = await Issue.find({})
        .populate("repository");
        if (!issues || issues.length == 0){
            return res.status(404).json({message:"Issues not found",issue:"fetching Failed"})
        }
        res.json({message:"Issues fetched successfully",issues})
    }catch(error){
        res.status(500).json({message:error.message,issue:"fetching Failed"})
    }
};

async function getIssueById(req,res){
   try{
    const result= await Issue.find({_id:req.params.id})
    if (!result || result.length == 0){
        return res.status(404).json({message:"Issue not found",issue:"fetching Failed"})
    }
    res.json({message:"Issue fetched successfully",issue:result})
   }
   catch(error){
    res.status(500).json({message:error.message,issue:"fetching Failed"})
   }
};

async function updateIssueById(req,res){
   const {title,description}=req.body;
   const id = req.params.id;
   try {
    const issue=await Issue.findById(id)
    if (!issue){
        res.status(404).json({message:"Issue not found",issue:"updating Failed"})
    }
    issue.title=title;
    issue.description=description;
    const result = await issue.save();
    res.json({message:"Issue updated successfully",issue:result})
   } catch (error) {
    res.status(500).json({message:error.message,issue:"updating Failed"})
   }
};

async function deleteIssueById(req,res){
    try {
        const issue = await Issue.findByIdAndDelete(req.params.id)
        if (!issue){
            res.status(404).json({message:"Issue not found",issue:"deleting Failed"})
        }
        res.json({message:"Issue deleted successfully",issue})
    } catch (error) {
        res.status(500).json({message:error.message,issue:"deleting Failed"})
    }
};


module.exports={
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssueById,
    deleteIssueById
}