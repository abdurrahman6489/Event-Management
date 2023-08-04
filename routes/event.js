const express = require("express");
const router = new express.Router();

const eventController = require("../controller/event.js");

router.post("/create", eventController.createEvent);

router.get("/get-list", eventController.getAllEvents);

router.get("/get-event/:eventId", eventController.getEvent);

router.get("/search", eventController.searchEvents);

router.post("/join/:eventId", eventController.joinEvent);

module.exports = router;
