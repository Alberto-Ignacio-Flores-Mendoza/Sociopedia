import Comment from "../models/Comment.js";

export const createComment = async (req, res) => {
     try{
        const newComment=new Comment(req.body)
        //console.log(`This is the body ${req.body}`)
        const savedComment=await newComment.save()
        //console.log("2")

        res.status(200).json(savedComment)
    }
    catch(err){
        res.status(500).json(err)
    }
}

export const updateComment = async(req,res) =>{
    try{
       
        const updatedComment=await Comment.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedComment)

    }
    catch(err){
        res.status(500).json(err)
    }
}

export const deleteComment = async(req,res) =>{
    try{
        const comment = await Comment.findByIdAndDelete(req.params.id)
        
        res.status(200).json(comment)

    }
    catch(err){
        res.status(500).json(err)
    }
}

export const getAllPostComments= async(req,res) =>{
    try{
        const comments=await Comment.find({postId:req.params.postId})
        res.status(200).json(comments)
    }
    catch(err){
        res.status(500).json(err)
    }
}