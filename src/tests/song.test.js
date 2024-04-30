require('../models')
const request = require("supertest")
const app = require("../app")
const Album = require("../models/Album")
const Artist = require('../models/Artist')
const Genre = require('../models/Genre')

const URL_BASE = '/api/v1/songs'

let song
let album
let songId
beforeAll(async () => {
    album = await Album.create({
        name: "mi primer album",
        image: "ramdon32",
        releaseYear: 2020
    })

    song = {
        name: "devuelveme el corazon",
        albumId: album.id
    
    }

})



test("POST -> URL_BASE, should return status code 201, and res.body.name === song.name", async () => {
    const res = await request(app)
    .post(URL_BASE)
    .send(song)

    songId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(song.name)
})

test("Get -> URL_BASE, should retun statusCode 200, and res.body.length === 1", async () => {

    const res = await request(app)
    .get(URL_BASE)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("Get -> URL_BASE/:id, should retur statusCode 200, res.body.name === song.name an res.body.albumId === song.albumId", async () => {
    const res= await request(app)
    .get(`${URL_BASE}/${songId}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(song.name)
    expect(res.body.albumId).toBe(song.albumId)
})

test("PUT -> URL_BASE/:id should return statusCode 200, and res.body.name === bodyUpdate.name", async () => {
    const bodyUpdate = {
        name: "No hay nadie mas"
    }
    const res = await request(app)
        .put(`${URL_BASE}/${songId}`)
        .send(bodyUpdate)
    
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(bodyUpdate.name)
    expect(res.body.albumId).toBe(song.albumId)

})

test("Post -> URL_BASE/:id/artists, should return statusCode 200, and res.body.length === 1,", async () => {
    const artist = {
        name: "Ruthshelle",
        country: "Haiti",
        formationYear: "2023",
        image: "RAMDOM"
    }
    
    const  createArtist = await Artist.create(artist)

    const res = await request(app)
    .post(`${URL_BASE}/${songId}/artists`)
    .send([createArtist.id])

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

    expect(res.body[0].songArtists.artistId).toBe(createArtist.id)
    expect(res.body[0].songArtists.songId).toBe(songId)


    await createArtist.destroy()
})


test("Post -> URL_BASE/:id/genres, should return statusCode 200, and res.body.length === 1", async () => {

    const genre = {
        name: "Pop"
    }
     const createGenre = await Genre.create(genre)

     const res = await request(app)
     .post(`${URL_BASE}/${songId}/genres`)
     .send([createGenre.id])

     expect(res.status).toBe(200)
     expect(res.body).toBeDefined()
     expect(res.body).toHaveLength(1)

     /*expect(res.body[0].songGenres.songId).toBe(songId)
     expect(res.body[0].songGenres.genreId).toBe(createGenre.id)*/

 
     await createGenre.destroy()

    
   
})

test("Delete -> URL_BASE/:id, should return statusCode 204", async () => {
    const res = await request(app)
    .delete(`${URL_BASE}/${songId}`)

    expect(res.status).toBe(204)

    await album.destroy()
})