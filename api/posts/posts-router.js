// implement your posts router here
const express = require("express");
const Post = require('./posts-model');
const router = express.Router();



router.get("/", (req, res)=> {
    Post.find()
    .then((posts) => {
        res.status(200).json(posts);
    })
    .catch(()=>{
        res.status(500).json({
            message: "The posts information could not be retrieved",
        })
    })
})

router.get("/:id", (req, res) =>{
    Post.findById(req.params.id)
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
        Post.insert(post)
        .then(async({id})=>{
            const newPost = await Post.findById(id);
            res.status(201).json(newPost);
        })
        .catch(()=> {
            res.status(500).json({
                message: "There was an error while saving the post to the database",
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
        Post.update(req.params, req.body)
        .then(async (update)=>{
            const updatedPost = await Post.findById(req.params.id);
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
    const id = req.params.id;
    const post = await Post.findById(id);

    if(!post){
        res.status(404).json({
            message: "The post with the specified ID does not exist"
        });
    } else {
        Post.remove(id)
        .then(()=>{
            res.status(200).json({
                message: "Deleted successfully."
            });
        })
        .catch(()=> {
            res.status(500).json({
                message: "The post could not be removed"
            });
        });
    }
});

module.exports = router;