const express = require('express')
const db = require('../../db')

const studentRoute = express.Router()

studentRoute.get("/", async(req, res)=>{
    const response = await db.query('SELECT _id, name, surname, email, dateofbirth FROM students')
    res.send(response.rows)

})
studentRoute.get("/:id", async(req, res)=>{
    const response = await db.query('SELECT * FROM students JOIN projects ON students._id  = projects.studentid WHERE students._id = $1', [req.params.id])
    const organized = response.rows.reduce((obj, value)=> {
        console.log(value)
        const current = obj.find(x => x._id === value.studentid)
        if (current)
            current.projects.push({
                name: value.name,
                description: value.description,

            })
        else {
            obj.push({
                _id: value.studentid,
                name: value.name,
                surname: value.surname,
                email: value.email,

                projects: [{
                    name: value.name,
                    description: value.description
                }]
            })
        }
        return obj
    }, [])

    if(response.rowCount === 0)
    return res.status(404).send('Not found')

    res.send(organized)

})
studentRoute.post("/", async(req, res)=>{
    const response = await db.query('INSERT INTO students (name, surname, email, dateofbirth) Values ($1, $2, $3, $4)',
                                                        [req.body.name, req.body.surname, req.body.email, req.body.dateofbirth ])
   res.send(response)
})
studentRoute.put("/:id", async(req, res)=>{
    try {
        let params = []
        let query = 'UPDATE "students" SET '
        for (bodyParamName in req.body) {
            query += // for each element in the body I'll add something like parameterName = $Position
                (params.length > 0 ? ", " : '') + //I'll add a coma before the parameterName for every parameter but the first
                bodyParamName + " = $" + (params.length + 1) // += Category = $1 
            params.push(req.body[bodyParamName]) //save the current body parameter into the params array
        }
        params.push(req.params.id) //push the asin into the array
        query += " WHERE _id = $" + (params.length) + " RETURNING *" //adding filtering for ASIN + returning
        console.log(query)
        const result = await db.query(query, params) //querying the DB for updating the row
        if (result.rowCount === 0) //if no element match the specified ASIN => 404
            return res.status(404).send("Not Found")
        res.send(result.rows[0]) //else, return the updated version
    }
    catch(ex) {
        console.log(ex)
        res.status(500).send(ex)
    }

})
studentRoute.delete("/:id", async(req, res)=>{
     const response = await db.query(`DELETE FROM students WHERE _id =  $1`, [req.params.id])

     if(response.rowCount === 0)
     return res.status.send("Not FOUND")

     res.send("Ok, deleted")
})




module.exports =  studentRoute

