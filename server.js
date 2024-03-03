// Budget API

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const budgetModel = require("./models/budgetCategory");

const DB_URL = "mongodb://127.0.0.1:27017/personal_budget";

const app = express();
const port = 3000;

app.use(cors());

app.get("/budget", (req, res) => {
    let budget = {myBudget: []};

    mongoose.connect(DB_URL)
        .then(() => {
            budgetModel.find({}).select({title: 1, budget: 1, color: 1, _id: 0})
                .then((data) => {
                    budget.myBudget = data;

                    res.header("Content-Type", "application/json");
                    res.end(JSON.stringify(budget));
                }).catch((err) => {
                    console.log("Error!", err);

                    res.header("Content-Type", "application/json");
                    res.end(JSON.stringify(budget));
                }).finally(() => {
                    mongoose.connection.close();
                });
        }).catch(err => {
            console.log("Error!", err);
            mongoose.connection.close();

            res.header("Content-Type", "application/json");
            res.end(JSON.stringify(budget));
        });
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});