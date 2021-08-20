// ----------------------------- media CRUD ---------------------
import express from "express"
import uniqid from "uniqid"
import { getMedia, writeMedia } from "../../lib/fs-tools.js"
import createError from 'http-errors';

const mediaRouter = express.Router()

// GET /media
mediaRouter.get("/", async (req, res, next) => {
    try {
        const media = await getMedia()
        res.status(200).send(media)
    } catch (err) {
        next(err)
    }
})

// GET /media/:_id
mediaRouter.get("/:_id", async (req, res, next) => {
    try {
        const media = await getMedia()
        const singleMedia = media.find( m => m._id === req.params._id )   
        if(singleMedia) {
            res.status(200).send(singleMedia)
        } else {
            next(createError(404, `Movie with ${req.params._id} was not found`))
        }        
    } catch (err) {
        next(err)
    }
})

// POST /media
mediaRouter.post("/", async (req, res, next) => {
    try {
        const media = await getMedia()
        const singleMedia = media.find(m => m.Title === req.body.Title)   
        if(!singleMedia) {
            const newMedia = { ...req.body, _id: uniqid.time(), createdAt: new Date()} 
            media.push(newMedia)
            await writeMedia(media)
            res.status(201).send({ _id: newMedia._id })
        } else {
            res.status(400).send(`Movie with title: ${req.body.Title} already exists`)
        }
    } catch (err) {
        next(err)
    }
})

// PUT /media/_id => edit the media with the given id
mediaRouter.put("/:_id", async (req, res, next) => {
    try {
        const media = await getMedia()
        const updatedMedia = { ...req.body, _id: req.params._id}
        const remainingMedia = media.filter(m => m._id !== req.params._id)
        remainingMedia.push(updatedMedia)

        await writeMedia(remainingMedia)
        res.status(200).send(`Movie with ${req.params._id} was updated`)
    } catch (err) {
        next(err)
    }
})

// DELETE /media/_id => delete the media with the given id
mediaRouter.delete("/:_id", async (req, res, next) => {
    try {
        const media = await getMedia()
        const remainingMedia = media.filter(m => m._id !== req.params._id)
    
        await writeMedia(remainingMedia)
        res.status(204).send(`Movie with ${req.params._id} was deleted`) //204 No Content
    } catch (err) {
        next(err)
    }
})

export default mediaRouter