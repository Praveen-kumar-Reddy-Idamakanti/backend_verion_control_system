const repoRouter = require("express").Router()
const repoController = require("../controllers/repoController")

repoRouter.post("/repo/create", repoController.createRepository)
repoRouter.get("/repo/all", repoController.getAllRepositories)
repoRouter.get("/repo/id/:id", repoController.fetchRepositoryById)
repoRouter.get("/repo/:name", repoController.fetchRepositoryByName)
repoRouter.get("/repo/me/:id", repoController.fetchRepositoriesForCurrentUser)
repoRouter.put("/repo/:id", repoController.updateRepositoryById)
repoRouter.patch("/repo/toggleVisibility/:id", repoController.toggleVisibilityById)
repoRouter.delete("/repo/:id", repoController.deleteRepositoryById)

module.exports = repoRouter