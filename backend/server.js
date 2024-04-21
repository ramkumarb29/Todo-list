const express = require('express')
const mongoose = require('mongoose')
const todoModel = require('./models/todoModel')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const app = express()

app.use(express.json())
app.use(cors())

dotenv.config({path: path.join(__dirname, 'config.env')})

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("MongoDB connection successful."))
    .catch((err) => console.log(err))
    
app.post('/todos', async (req, res) => {

    try {
        const todoDetail = req.body

        const todoItem = await todoModel.create(todoDetail)

        res.status(201).json({
            message: "ToDo Item Created.",
            todoItem
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
    
})

app.get('/todos', async(req, res) => {

    try {
        const todoList = await todoModel.find({})

        res.status(200).json({
            todoList
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
    
})

app.put('/todo/:id', async(req, res) => {

    try {
        const id = req.params.id
        const todoDetail = req.body

        const todoItem = await todoModel.findByIdAndUpdate(id, todoDetail, { new: true })

        if(!todoItem) {
            res.status(404).json({
                message: "ToDo Item Not Found."
            })
        }

        res.status(200).json({
            message: "ToDo Item Updated.",
            todoItem
        })
    } catch (error) {
        res.json({
            message: error.message
        })
    }
    
})

app.delete('/todo/:id', async(req, res) => {

    try {
        const id = req.params.id

        await todoModel.findByIdAndDelete(id)

        res.status(200).json({
            message: "ToDo Item Deleted."
        })

    } catch (error) {
        res.json({
            message: error.message
        })
    }

})

app.listen( 8000, () => {
    console.log("Server is up and running.")
})