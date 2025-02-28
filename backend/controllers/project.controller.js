import projectModel from "../models/project.model.js"
import * as projectService from "../services/project.service.js"
import {validationResult} from "express-validator"
import userModel from "../models/user.model.js";

export const createProject = async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try{
        const {name} = req.body;
        const loggedInUser = await userModel.findOne({email:req.user.email});
    
        const userId = loggedInUser._id;
    
        const newProject = await projectService.createProject({name,userId});
        res.status(201).json(newProject);
    }
    catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }
}

export const getAllProject = async(req,res) =>{
    try{
        const loggedInUser = await userModel.findOne({
            email:req.user.email,
        });

        const allUserProjects = await projectService.getAllProjectByUserId({
            userId:loggedInUser._id,
        });

        return res.status(200).json({
            projects:allUserProjects,
        });
    } 
    catch(err){
        return res.status(400).json({error:err.message});
    }
}

export const addUserToProject = async (req,res) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try{
        const {projectId,users} = req.body;
        const loggedInUser = await userModel.findOne({
            email:req.user.email
        });

        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId:loggedInUser._id
        });

        return res.status(200).json({
            project,
        })
    }
    catch(err){
        console.log(err);
        return res.status(400).json({error:err.message})
    }
}

export const getProjectById = async(req,res) =>{
    const {projectId} = req.params;
    try{
        const project = await projectService.getProjectById({
            projectId
        });

        return res.status(200).json({
            project
        });
    }
    catch(err){
        console.log(err);
        res.status(400).json({error:err.message});
    }
}

export const updateFileTree = async(req,res) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    try{
        const {projectId,fileTree} = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree,
        });

        return res.status(200).json({
            project
        });
    }
    catch(err){
        console.log(err);
        res.status(400).json({error:err.message});
    }
}

export const addMessageToProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { sender, message } = req.body;

        if (!projectId) {
            return res.status(400).json({ error: "Project ID is required" });
        }

        if (!sender || !message) {
            return res.status(400).json({ error: "Sender and message are required" });
        }

        const senderData = sender._id === "ai" ? "ai" : sender;

        const updatedProject = await projectModel.findOneAndUpdate(
            { _id: projectId },
            { $push: { messages: { sender: senderData, message } } }, 
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ error: "Project not found" });
        }

        return res.status(200).json(updatedProject);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const getProjectMessages = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(400).json({ error: "Project ID is required" });
        }

        const project = await projectModel
            .findById(projectId)
            .populate("messages.sender", "email") 
            .select("messages");

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        return res.status(200).json({ messages: project.messages });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
