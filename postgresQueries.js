const Pool = require("pg").Pool
const pool = new Pool({
    user: "fahad",
    host: "dpg-cetq7n9gp3jmgl1ujld0-a",
    database: "workflows_7s5r",
    password: "FJP1S2fXRgodsErgIMtqSMqitK2Q2zu3",
    port: 5432
})
​
​
// const StateMachine = require("javascript-state-machine")
// const key = "e5b78779c53ded533dbd9023f6c74286"
// const token = "Bearer EAAJW4aYvBDsBAEX4kBeekthXN9OtOv92knxF7EPNBvjFp9bPm7ZBOZAQCTs0BqROOjrHqL1rZAllHQ083XF9xIeLAIDLaJZAv0ra3K7uo5y8X044nvATQacBZCxjltD8fxozyhyT470wzmKlZAMIKKkc5U5kzmccKNJMNvwYVcSbeFTYltvXjWN7gmhPZBPqLbf4q6wGuyiZBGbJS9mYrWJE"
// const axios = require("axios")
// let currentState = ""
// const token = ""
​
let methods = {
    onStart: function () { console.log("Started") }
}
​
const createTable = (request, response) => {
    pool.query(`create table basicetable name varchar age varcha`), (err, results) => {
        if (err) {
            throw err
        }
    }
    response.json({ msg: "table created" })
}
​
const insertData = (request, response) => {
    const { name, age } = request.body
    let data
    pool.query("insert into basictable (name,age) values ($1,$2) returning *", [name, age], (err, results) => {
        if (err) {
            throw err
        } else {
            data = results.rows
            console.log("results", results.rows);
        }
    })
    response.json({ msg: data })
}
​
const getTableData = (request, response) => {
    let data
    pool.query(`select * from basictable`), (err, results) => {
        if (err) {
            throw err
        } else {
            data = results.rows
            console.log("results", results.rows)
        }
    }
    response.json({ msg: data })
}
​
const getWorkflowById = (request, response) => {
    const { id } = request.body
    pool.query(`SELECT * FROM workflows where id = ${id} ORDER BY name ASC`, (err, results) => {
        if (err) {
            // response.status(404).json({ "err": err })
            throw err;
        } else
            response.status(200).json(results.rows[0])
    })
}
​
const getAllWorkflows = (request, response) => {
    pool.query("SELECT * FROM workflows ORDER BY name ASC", (err, results) => {
        if (err) {
            // response.status(404).json({ "err": err })
            throw err;
        }
        response.status(200).json(results.rows)
    })
}
​
const addWorkflow = (request, response) => {
    let { id, name, initialEdges, initialNodes, nodesOrder } = request.body
    initialEdges = JSON.stringify(initialEdges)
    initialNodes = JSON.stringify(initialNodes)
    nodesOrder = JSON.stringify(nodesOrder)
    pool.query(
        "INSERT INTO workflows (id,name,initialEdges,initialNodes,nodesOrder) VALUES ($1,$2,$3,$4,$5) RETURNING *",
        [id, name, initialEdges, initialNodes, nodesOrder],
        (err, results) => {
            if (err) {
                // response.status(404).json({ "err": err })
                throw err;
            } else
                response.status(201).send(`Workflow added: ${results.rows[0]}`)
        }
    )
}
​
module.exports = { getAllWorkflows, addWorkflow, getWorkflowById, createTable, insertData, getTableData }