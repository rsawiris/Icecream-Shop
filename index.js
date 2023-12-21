const pg = require('pg')
const client = new pg.Client('postgres://localhost/ice_cream_shop')
const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

// get ice cream flavor
app.get('/api/icecream', async (req, res, next) => {
    try {
        const SQL = `
            SELECT *
            FROM icecream
        `
        const response = await client.query(SQL)
        console.log(response.rows)
        res.send(response.rows)
        
        
    } catch (error) {
        next(error)
    }
})

// get one ice cream flavor
app.get('/api/icecream/:id', async (req,res,next) => {
    try {
        console.log(req.params.id)

        const SQL = `
            SELECT * FROM icecream WHERE id=$1
        `

        const response = await client.query(SQL, [req.params.id])
       if(!response.rows.length) {
        next({
            name: "id: error",
            message: `icecream with ${req.params.id} not found`
        }) 
       } else{
        res.send(response.rows[0])
       }
    } catch (error) {
        next(error)
    }
})

// delete ice cream flavor
app.delete(`/api/icecream/:id`, async (req,res,next) => {
    const SQL = `
        DELETE FROM icecream WHERE id=$1
    `
    const response = await client.query(SQL, req.params.id)
    console.log(response)
    res.sendStatus(204)
})

// error handler 
app.use((error,req,res,next) => {
    res.status(500)
    res.send(error)
})


const start = async () => {
    await client.connect()
    console.log('connected to db')
    const SQL = `
        DROP TABLE IF EXISTS icecream;
        CREATE TABLE icecream(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20)
        );
        INSERT INTO icecream (name) VALUES ('chocolate');
        INSERT INTO icecream (name) VALUES ('vanilla');
        INSERT INTO icecream (name) VALUES ('rocky road');
        INSERT INTO icecream (name) VALUES ('cookie dough');
    `
    await client.query(SQL);
    console.log("table created and seeded")
    
    const port = 3001;
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })
   
}

start()