const {model} = require('mongoose')
const {Schema} = require('mongoose')

const post = new Schema({
    title_post: {
        type: String,
        required: true
    },
    descr_post: {
        type: String,
        required: true
    },
    text_post: {
        type: String,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
        img_post: String
    }
)
post.method('toClient', function() {
    const course = this.toObject()
    course.id = post._id
    delete post._id
    return post
})
const Post = model('Post', post)
module.exports = Post





// const path = require('path')
// const fs = require('fs')
// const { v4: uuidv4 } = require('uuid')


// class Post {
//     constructor(title, text, descr, img) {
//         this.title = title
//         this.descr = descr
//         this.text = text
//         this.img = img
//         this.id = uuidv4()
//     }

//     toJSON() {
//         return {
//             title: this.title,
//             text: this.text,
//             descr: this.descr,
//             img: this.img,
//             id: this.id
//         }
//     }
//    async save() {
//     const posts = await Post.getAll()
//     posts.push(this.toJSON())

//     return new Promise((resolve, reject) => {
//     fs.writeFile(
//         path.join(__dirname, '..', 'data', 'posts.json'),
//         JSON.stringify(posts),
//         (err) => {
//             if (err) {
//             reject(err)
//             } else {
//                 resolve()
//             }
//         } 
//     )
//     })
//     }

//     static async update(post) {
     
//         const posts = await Post.getAll()
//         const idx = posts.findIndex(c => c.id === post.id)
//         posts[idx] = post
    
//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'posts.json'),
//                 JSON.stringify(posts),
//                 (err) => {
//                     if (err) {
//                     reject(err)
//                     } else {
//                         resolve()
//                     }
//                 } 
//             )
//         })
//     }

//     static getAll() {
//     return new Promise((resolve, reject) => {
//         fs.readFile(path.join(__dirname, '..', 'data', 'posts.json'),
//         'utf-8',
//         (err, content) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(JSON.parse(content))
//             }
//         })
//         }
//     )}
//     static async getById(id) {
//         const posts = await Post.getAll()
//         return posts.find(c => c.id === id)
//     }
// }

// module.exports = Post