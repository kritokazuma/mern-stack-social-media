const Post = require('../models/Post')

exports.likePost = async (req, res) => {
    const user = req.user
    const postId = req.query.postid
    try {
        const post = await Post.findById(postId)
        if (post) {
            if (post.likes.find(p => p.username === user.username)) {
                post.likes = post.likes.filter(p => p.username !== user.username)
            } else {
                post.likes.push({
                    username: user.username,
                    createdAt: new Date().toISOString()
                })
            }
            await post.save()
            return res.status(200).json(post)
        } else {
            return res.status(500).json({
                errors: "Post not found"
            })
        }
    } catch (error) {
        res.status(501).json({
            errors: error
        })
    }
}