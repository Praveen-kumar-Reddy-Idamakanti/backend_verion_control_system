const issueRouter=require("express").Router()
const issueController=require("../controllers/issueController")


issueRouter.post("/issue/create",issueController.createIssue)
issueRouter.get("/issue/getall",issueController.getAllIssues)
issueRouter.get("/issue/get/:id",issueController.getIssueById)
issueRouter.put("/issue/update/:id",issueController.updateIssueById)
issueRouter.delete("/issue/delete/:id",issueController.deleteIssueById)

module.exports=issueRouter