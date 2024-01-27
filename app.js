const express = require('express')
const app = express()
const fs = require('fs')
const { scraping, guardarDatos } = require('./scraping')

let noticias = []

function leerDatos() {
    try {
        const data = fs.readFileSync('noticias.json', 'utf-8');
        noticias = JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo noticias.json:', error.message);
    }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Read
app.get('/', (req, res) => {
    noticias.length !== 0
        ? res.json(noticias)
        : res.redirect('/scraping')
})

app.get('/scraping', scraping, (req, res) => {
    leerDatos()
    res.redirect('/')
})

app.get('/:index', (req, res) => {
    const index = req.params.index
    leerDatos()
    res.json(noticias[index])
})


// Create
app.post('/', (req, res) => {
    leerDatos()
    const nuevaNoticia = {
        titulo: req.body.titulo || '',
        img: req.body.img || '',
        descripcion: req.body.descripcion || '',
        enlace: req.body.enlace || ''
    }
    noticias.push(nuevaNoticia)
    guardarDatos(noticias)
    res.json(noticias)
})


// Update
app.put('/:index', (req, res) => {
    leerDatos()
    const index = req.params.index

    if (index) {
        noticias[index] = { ...req.body }
        guardarDatos(noticias)
        res.json(noticias)
    } else { res.status(404).json({ Error: "Índice no encontrado" }) }
})


// Delete
app.delete('/:index', (req, res) => {
    leerDatos()
    const index = req.params.index

    if (index) {
        noticias.splice(index, 1)
        guardarDatos(noticias)
        res.json(noticias)
    } else { res.status(404).json({ Error: "Índice no encontrado" }) }

})


app.use((req, res) => {
    res.status(404).json({ error: "Página no encontrada" })
})

app.listen(3000, () => {
    console.log('Express está escuchando en el puerto http://localhost:3000/')
})