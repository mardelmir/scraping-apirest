const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs')

const url = 'https://elpais.com/ultimas-noticias/'

async function scraping(req, res, next) {
    try {
        const response = await axios.get(url)
        const html = response.data
        const $ = cheerio.load(html)

        let noticias = [];
        $('article').each((index, element) => {
            const noticia = {
                titulo: $(element).find('h2').text().trim(),
                img: $(element).find('img').attr('src') || '',
                descripcion: $(element).find('p').text().trim(),
                enlace: $(element).find('h2').find('a').attr('href'),
            };
            noticias.push(noticia)
        })

        guardarDatos(noticias)
    }
    catch (error) { console.log(error) }
    next()
}

function guardarDatos(noticias) {
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}

module.exports = { scraping, guardarDatos }