// implement your posts router here
const express = require('express');

const Posts = require('./posts-model');

const router = express.Router();

router.get('/', (res, req)=> {
    Posts.find()
    .then((posts) => {
        res.status(200).json(posts);
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json({
            message: "The posts information could not be retrieved",
        })
    })
})

router.get('/:id', (req, res) =>{
    Posts.findById(req.params.id)
    .then((posts)=>{
        if(posts) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        }
    })
    .catch((error)=>{
        console.log(error);
        res.status(500).json({
            message: "The posts information could not be retrieved",
        });
    });
});

router.post("/", (req, res)=>{
    const post = req.body;
    if (!post.title || !post.contents){
        res.status(400).json({
            message: "Please provide title and contents for the post"
        });
    } else {
        Posts.insert(post)
        .then(async({id})=>{
            const newPost = await Posts.findById(id);
            res.status(201).json(newPost);
        })
        .catch((error)=> {
            res.status(500).json({
                message: "There was an error while saving the post to the database",
                error: error.message
            });
        });
    }
});

router.put("/:id", (req, res)=>{
    const newPost = req.body;
    if (!newPost.title || !newPost.contents){
        res.status(400).json({
            message: "Please provide title and contents for the post"
        });
    } else {
        Posts.update(req.params, req.body)
        .then(async (update)=>{
            const updatedPost = await Posts.findById(req.params.id);
            if (update){
                res.status(200).json(updatedPost);
            } else {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                });
            }
        })
        .catch((error)=> {
            console.log(error);
            res.status(500).json({
                message: "The post information could not be modified"
            });
        });
    }
});
router.delete("/:id", async (req, res) =>{
    try{
    const post = await Posts.findById(req.params.id);
    if(!post){
        res.status(404).json({
            message: "The post with the specified ID does not exist"
        });
    } else {
        await Posts.remove(req.params.id);
        res.json(post);
    } catch {error}{
        res.status(500).json({
            message: "The post could not be removed",
            error: error.message,
            stack: error.stack,
        })
        }
    }
})