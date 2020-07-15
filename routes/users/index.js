const express = require('express')
const db = require('../../db')

const studentRoute = express.Router()

studentRoute.get("/", async(req, res)=>{
    const response = await db.query('SELECT _id, name, surname, email, dateofbirth FROM students')
    res.send(response.rows)
})
studentRoute.get("/:id", async(req, res)=>{
    const response = await db.query('SELECT _id, name, surname, email, dateofbirth FROM students WHERE _id = $1', [req.params.id])
    
    if(response.rowCount === 0)
    return res.status(404).send('Not found')

    res.send(response.rows[0])

})
studentRoute.post("/", async(req, res)=>{
    const response = await db.query('INSERT INTO students (name, surname, email, dateofbirth) Values ($1, $2, $3, $4)',
                                                        [req.body.name, req.body.surname, req.body.email, req.body.dateofbirth ])
   res.send(response)
})
studentRoute.put("/:id", async(req, res)=>{
    try {
        const result = await db.query(`UPDATE students
                                        SET name = $1,
                                            surname = $2,
                                            email = $3,
                                            dateofbirth = $4
                                            WHERE _id = $5
                                            RETURNING * `,
                                            [req.body.name, req.body.surname, req.body.email, req.body.dateOfBirth, req.params.id ])
                                           
            if(result.rowCount === 0)
            return res.status(400).send('Not found')

            res.send(result[0])
    } catch(ex) {
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

