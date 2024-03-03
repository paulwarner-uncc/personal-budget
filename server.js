// Budget API

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const budgetModel = require("./models/budgetCategory");

const DB_URL = "mongodb://127.0.0.1:27017/personal_budget";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/budget", (req, res) => {
    res.header("Content-Type", "application/json");

    let budget = {myBudget: []};

    mongoose.connect(DB_URL)
        .then(() => {
            budgetModel.find({}).select({title: 1, budget: 1, color: 1, _id: 0})
                .then((data) => {
                    budget.myBudget = data;

                    res.end(JSON.stringify(budget));
                }).catch(() => {
                    res.end(JSON.stringify(budget));
                }).finally(() => {
                    mongoose.connection.close();
                });
        }).catch(() => {
            mongoose.connection.close();

            res.end(JSON.stringify(budget));
        });
});

app.post("/budget/category", (req, res) => {
    res.header("Content-Type", "application/json");

    let newCategory = new budgetModel({
        title: req.body.title,
        budget: req.body.budget,
        color: req.body.color
    });

    mongoose.connect(DB_URL)
        .then(() => {
            budgetModel.insertMany([newCategory])
                .then(() => {
                    console.log("Inserted!");

                    res.end(JSON.stringify({
                        error: false,
                        msg: null,
                        data: {
                            title: newCategory.title,
                            budget: newCategory.budget,
                            color: newCategory.color
                        }
                    }));
                }).catch((err) => {
                    console.log("Insert error!", err);

                    res.end(JSON.stringify({
                        error: true,
                        msg: "Invalid category data.",
                        data: null
                    }));
                }).finally(() => {
                    mongoose.connection.close();
                });
        }).catch(err => {
            console.log("Error!", err);
            mongoose.connection.close();

            res.end(JSON.stringify({
                error: true,
                msg: "An unknown error occurred.",
                data: null
            }));
        });
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});