const {model} = require('mongoose')
const {Schema} = require('mongoose')

const strategy = new Schema({
    title_strat: {
        type: String,
        required: true
    },
    text_strat: {
        type: String,
        required: true
    },
    price_strat: {
        type: Number,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    risk: {
        type: String,
        required: true
    },
    profit: {
        type: String,
        required: true
    },
    type_of_risk: {
        type: Boolean,
        required: true
    },
    raiting: {
        type: Number,
        required: true,
        default: 0
    },
        img_strat: String,
    },
   
)
strategy.method('toClient', function() {
    const strategy = this.toObject()
    strategy.id = strategy._id
    delete strategy._id
    return strategy
})

strategy.method.change_count = function() {
    strategy.raiting += 1
    return strategy.save()
}
const Strategy = model('Strategy', strategy)
module.exports = Strategy




// const path = require('path')
// const fs = require('fs')
// const { v4: uuidv4 } = require('uuid')
// const { finished } = require('stream')


// class Strategy {
//     constructor(title, text, price, img) {
//         this.title = title
//         this.text = text
//         this.price = price
//         this.img = img
//         this.id = uuidv4()
//     }

//     toJSON() {
//         return {
//             title: this.title,
//             text: this.text,
//             price: this.price,
//             img: this.img,
//             id: this.id
//         }
//     }
//    async save() {
//     const strats = await Strategy.getAll()
//     strats.push(this.toJSON())

//     return new Promise((resolve, reject) => {
//     fs.writeFile(
//         path.join(__dirname, '..', 'data', 'strateges.json'),
//         JSON.stringify(strats),
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

//     static getAll() {

//     return new Promise((resolve, reject) => {
//         fs.readFile(path.join(__dirname, '..', 'data', 'strateges.json'),
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

//         const strats = await Strategy.getAll()
//         return strats.find(c => c.id === id)
//     }
// }

// module.exports = Strategy

