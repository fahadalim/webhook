const Pool = require("pg").Pool
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "workflows",
    password: "postgrey",
    port: 5432
})


const StateMachine = require("javascript-state-machine")
// const key = "e5b78779c53ded533dbd9023f6c74286"
const token = "Bearer EAAJW4aYvBDsBAEX4kBeekthXN9OtOv92knxF7EPNBvjFp9bPm7ZBOZAQCTs0BqROOjrHqL1rZAllHQ083XF9xIeLAIDLaJZAv0ra3K7uo5y8X044nvATQacBZCxjltD8fxozyhyT470wzmKlZAMIKKkc5U5kzmccKNJMNvwYVcSbeFTYltvXjWN7gmhPZBPqLbf4q6wGuyiZBGbJS9mYrWJE"
const axios = require("axios")
let currentState = ""
// const token = ""

let methods = {
    onStart: function () { console.log("Started") }
}

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

const getAllWorkflows = (request, response) => {
    pool.query("SELECT * FROM workflows ORDER BY name ASC", (err, results) => {
        if (err) {
            // response.status(404).json({ "err": err })
            throw err;
        }
        response.status(200).json(results.rows)
    })
}

const addWorkflow = (request, response) => {
    let { id, name, initialEdges, initialNodes, nodesOrder } = request.body
    // id = JSON.stringify(id)
    // name = JSON.stringify(name)
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

//run workflow by id

var tempWorkflow = new StateMachine({
    init: "start",
    transitions: [],
    methods
})

const runWorkflowByOrder = async (request, response) => {
    let { nodesOrder } = request.body
    let c = 0
    if (nodesOrder[c].type === "apiNode" && currentState == "") {
        methods.onApi = async function () {
            var response = await axios.get("https://whatsapp-webhook-kes7.onrender.com/fahad")
            console.log(response.data)
            currentState = response.data[response.data.length - 1].userStatus || "Api failed"
            console.log("Api node started", currentState)
        }
        await tempWorkflow._fsm.config.methods.onApi()
        c++;
    } else if (nodesOrder[c].type === "conditionNode") {
        methods.onCondition = function () {
            console.log("condition started", currentState)
        }
        c++;
    } else if (nodesOrder[c].type === "textNode") {
        if (currentState === "Api failed") {
            //send msg api failed
        }
        if (currentState === "new") {
            //send msg new
        } if (currentState === "old") {
            //send msg old
        }
        c++;
    }
    else if (nodesOrder[c].type === "templateNode") {
        if (currentState === "new" || "old") {
            //send product list
            //wait for customer to click 

        }
    }


    response.json({ message: "Engine started" })

}




module.exports = { getAllWorkflows, addWorkflow, getWorkflowById, runWorkflowByOrder }