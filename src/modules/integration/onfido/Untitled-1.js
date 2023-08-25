
/* 
const express = require('express')

const app = express()


app.get('/employee', (req, res) => {


})

app.use((req, res, next) => {

    next()
}) */
/* 
module.exports.testModule = {

    add: function () {

    }
}

const obbj = [{
    name: 'ankit'
}, {
    name: 'pawan'
},
{
    name: 'bindesh'
}]

obbj.sort((a, b) => {
    a.name.toUpperCase().localeCompare(b.name.toUpperCase())
}) */



const str = "()())()"

function isBalanced(input) {

    const chars = []

    for (let i = 0; i < input.length; i++) {
        const d = input.charAt(i)

        if (d == '(') {
            chars.push(d)
        } else {
            if (d == ')' && chars.includes('(')) {
                chars.pop()
            }
        }
    }

    return chars.length === 0
}

console.log(isBalanced(str))