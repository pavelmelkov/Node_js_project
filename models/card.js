// const path = require('path')
// const fs = require('fs')
// const { countReset } = require('console')

// const p = path.join(
//     path.dirname(process.mainModule.filename),
//     'data',
//     'card.json'
// ) 



// class Card {

//     static async add(strat) {
//         const card = await Card.fetch()
//         console.log("корзина: ", card)
//         const idx = card.strats.findIndex(c => c.id === strat.id)
//         const candidate = card.strats[idx]
//         console.log("candidate", candidate)

//         if (candidate) {
//             candidate.count++
//             card.strats[idx] = candidate
//         } else {
//             strat.count = 1
//             card.strats.push(strat)
            
//         }

//         card.price += +strat.price

//         return new Promise((resolve, reject) => {
//             fs.writeFile(p, JSON.stringify(card), err => {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     resolve()
//                 }
//             }) 
//         })
//     }

//     static async fetch() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(p, 'utf-8', (err, content) => {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     resolve(JSON.parse(content))
//                 }
//             })
//         })
//     }

//     static async remove(id) {

//         const card = await Card.fetch()
//         console.log(card.strats)
//         const idx =  card.strats.findIndex(c => c.id === id) 
//         const strat = card.strats[idx]

//         if (strat.count === 1) {
//             card.strats = card.strats.filter(c => c.id !== id)
//         } else {
//             card.strats[idx].count--
//         }

//         card.price -= strat.price

//         return new Promise((resolve, reject) => {
//             fs.writeFile(p, JSON.stringify(card), err => {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     resolve(card)
//                 }
//             }) 
//         })
//     }

// }

// module.exports = Card