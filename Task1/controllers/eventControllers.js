import { getDB } from "../config/db.js";
import { upload } from "../utils/multer.js";

export const getEventInfoByID = async (req, res, next) => {
  const db = getDB();
  const collection = db.collection("eventCollection");
  let { id } = req.query;
  let arr;

  if (id !== undefined) {
    try {
      const result = await collection.find({ _id: id });
      if (result) {
        for await (const doc of result) {
          arr = doc;
        }
        return res.status(200).json({ success: true, arr });
      }
      return res.status(404).json({ success: false, error: "Event not found" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
  //------------------------------------------------------------------//
  else {
    const { type, limit = 5, page = 1 } = req.query;
    let curr_date = Date.now();
    let monthBreak = new Date();
    monthBreak.setMonth(monthBreak.getMonth() + 1);
    let events;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    if (type === "latest") {
      try {
        const query = { schedule: { $gte: curr_date, $lt: monthBreak } };
        events = await collection
          .find(query)
          .sort({ schedule: -1 })
          .skip(skip)
          .limit(parseInt(limit));
        if (events) {
          for await (const doc of events) {
            arr = doc;
          }
          return res.status(200).json({ success: true, arr });
        }
        return res
          .status(404)
          .json({ success: false, error: "No Latest Events Found" });
      } catch (err) {
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    } else {
      try {
        const query = { schedule: { $gte: monthBreak } };
        events = await collection
          .find(query)
          .sort({ schedule: -1 })
          .skip(skip)
          .limit(parseInt(limit));
        if (events) {
          for await (const doc of events) {
            arr = doc;
          }
          return res.status(200).json({ success: true, arr });
        }
        return res
          .status(404)
          .json({ success: false, error: "Events Not Found" });
      } catch (err) {
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    }
  }
};

export const insertEvent = (req, res, next) => {
  let obtained_file, new_id;
  const user_ids = [19, 20, 15, 10, 5, 3];
  const db = getDB();
  const collection = db.collection("eventCollection");

  upload(req, res, (err) => {
    if (err) {
      return res.status(404).json({ message: "file not uploaded" });
    }
    obtained_file = req.file;
    const newEvent = {
      type: "event",
      uid: 18,
      name: req.body.name,
      tagline: req.body.tagline,
      schedule: req.body.schedule,
      description: req.body.description,
      file: obtained_file,
      moderator: req.body.moderator,
      category: req.body.category,
      sub_category: req.body.sub_category,
      rigor_rank: req.body.rigor_rank,
      attendees: user_ids,
    };

    collection.insertOne(newEvent, (error, result) => {
      if (error) {
        console.error("Error inserting document:", error);
      } else {
        new_id = result.insertedId;
        console.log("Inserted document:", new_id);
      }
    });

    return res
      .status(200)
      .json({ message: "data uploaded successfully", new_id });
  });
};

export const updateEvent = async (req, res, next) => {
  const db = getDB();
  const collection = db.collection("eventCollection");
  let { id } = req.query;
  const user_ids = [19, 20, 15, 10, 5, 3];
  let obtained_file;

  const filtered = await collection.find({ _id: id });

  if (!filtered) {
    return res.json({
      success: false,
      message: "Event Not Found",
    });
  }
  upload(req, res, (err) => {
    if (err) {
      return res.status(404).json({ message: "file not uploaded" });
    }
    obtained_file = req.file;
    const updateEvent = {
      type: "event",
      uid: 18,
      name: req.body.name,
      tagline: req.body.tagline,
      schedule: req.body.schedule,
      description: req.body.description,
      file: obtained_file,
      moderator: req.body.moderator,
      category: req.body.category,
      sub_category: req.body.sub_category,
      rigor_rank: req.body.rigor_rank,
      attendees: user_ids,
    };

    collection.updateOne({ _id: id }, updateEvent, (error, result) => {
      if (error) {
        console.error("Error Updating the document:", error);
        return res
          .status(404)
          .json({ success: false, message: "Failed to Update Event" });
      }
    });

    return res
      .status(200)
      .json({ success: true, message: "Event updated successfully" });
  });
};

export const deleteEvent = async (req, res, next) => {
  const db = getDB();
  const collection = db.collection("eventCollection");
  let { id } = req.query;

  try {
    const result = await collection.find({ _id: id });
    if (result) {
      await collection.deleteOne({ _id: id });
      return res
        .status(200)
        .json({ success: true, message: "Event Deleted Successfully" });
    }
    return res
      .status(404)
      .json({ success: false, message: "Event to be deleted not found" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};