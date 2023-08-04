const Event = require("../model/event.js");
const Audience = require("../model/audience.js");

const createEvent = async (req, res) => {
  const { name, date } = req.body;
  const user = req.user;
  const newEvent = new Event({ name, date, creator: user._id });
  await newEvent.save();
  res.json({ success: true, message: "event created successfully" });
};

const getEvent = async (req, res) => {
  const eventId = req.params.eventId;
  if (!eventId)
    return res
      .status(404)
      .json({ success: false, message: "no event id passed" });
  try {
    const event = await Event.findById(eventId);
    res.json({ success: true, message: "found the event", result: event });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "something went wrong please try later",
    });
  }
};

const getAllEvents = async (req, res) => {
  const events = await Event.find({});
  res.json({ success: true, message: "found all the events", result: events });
};

const searchEvents = async (req, res) => {
  const searchKey = req.query.searchKey;
  if (!searchKey)
    return res
      .status(404)
      .json({ success: false, message: "no search key found" });
  const query = {
    name: {
      $regex: new RegExp(searchKey),
      $options: "i",
    },
  };
  const searchedEvents = await Event.find(query);
  if (!searchEvents)
    return res.status(404).json({
      success: false,
      message: "there was no event found with the search " + searchKey,
    });
  res.json({
    success: true,
    message: `found all the events with ${searchKey}`,
    result: searchedEvents,
  });
};

const joinEvent = async (req, res) => {
  const eventId = req.params.eventId;
  const event = await Event.findById(eventId);
  if (!event) {
    return res.json({ success: false, message: "event does not exist" });
  }
  const user = req.user;
  const userId = user._id;
  const audience = await Audience.findOne({
    eventId,
    userId,
  });
  if (audience)
    return res
      .status(404)
      .json({ success: false, message: "user has already joined" });

  const newAudience = new Audience({ eventId, userId });
  await newAudience.save();

  return res.json({
    success: true,
    message: "user joined the event successfully",
  });
};
module.exports = {
  createEvent,
  getAllEvents,
  getEvent,
  searchEvents,
  joinEvent,
};
