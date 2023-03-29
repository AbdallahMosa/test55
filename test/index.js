const express = require("express")
const cors = require("cors")
const app = express()
app.use(express.json())
app.use(cors());
require('dotenv').config();
const data = require("./data.json")
const axios = require('axios');
const { Client } = require('pg')
// let url = `postgres://abdallah:0000@localhost:5432/lab13`;

const PORT = process.env.PORT || 9002

let url = process.env.URL
const client = new Client(url)


app.get("/test",getDAta)
app.get("/trending",getTrending)
app.get("/search",getserch)
app.post("/addMovies",addMovies)
app.get("/all",getMydatabase)

function getDAta(req,res){

    let newData = new Datas(data.title , data.poster_path, data.overview)
    res.json(newData)
}
function getTrending(req, res){
        const url = 'https://api.themoviedb.org/3/trending/all/day?api_key=8b7513d92ee30781a2290e33a82e1e1f'

        axios.get(url)
        .then(result =>{

            newData = result.data.results.map(item =>{
                    return new Trending(item.id, item.title,item.release_date,item.poster_path,item.overview)
                    

            })
            res.json(newData)
        })
        .catch(err =>{
            console.log(err)
        })


}

function getserch(req,res){
    const name = req.query.title

    const url = `https://api.themoviedb.org/3/search/company?api_key=8b7513d92ee30781a2290e33a82e1e1f&query=${name}&page=1`
    axios.get(url)
    .then(result =>{

        newData = result.data.results
        res.json(newData)
    })
    .catch(err =>{
        console.log(err)
    })
}


function addMovies(req,res){
    let sql = `INSERT INTO table_name (title, time, comments)
    VALUES ($1,$2,$3) RETURNING *; `
    let {title,time,comments}=req.body;
    let val = [title,time,comments]
    client.query(sql,val).then((result)=>{


        console.log(result.rows)
        res.status(201).send(result.rows)
    }).catch(err=>{
        console.log(err)
    })
}

function getMydatabase(req,res){

    let sql =`SELECT * FROM table_name;`;

    client.query(sql).then((result)=>{

        res.send(result.rows)
    })
}
function Datas(title, poster_path,overview){
 
    this.title = title
    this.poster_path= poster_path
    this.overview = overview
}

function Trending(id,title,release_date,poster_path,overview){

    this.id=id;
    this.title=title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview
}

client.connect().then(()=>{

    app.listen(PORT,()=>{
    
        console.log(`welcome from the ${PORT}` )
    })


}).catch(err =>{
    console.log(err)
})
