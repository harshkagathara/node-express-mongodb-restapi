const Note = require("../Models/note.model.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const imageStorage = multer.diskStorage({
  destination: "images", // Destination to store image
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const imageUpload = multer({
  storage: imageStorage,
  limits: { fieldSize: 1024 * 1024 * 3 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

module.exports = (app) => {
  app.post("/create-note", imageUpload.single("image"), function (req, res) {
    const Data = new Note({
      image: req.file.filename,
      title: req.body.title,
      content: req.body.content,
    });
    try {
      Data.save();
      res.json(Data);
    } catch {
      res.json();
    }
  });
  app.get("/notes", async (req, res) => {
    try {
      const Data = await Note.find({});
      res.status(200).send(Data);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  app.get("/note/:id", async (req, res) => {
    try {
      const data = await Note.findById(req.params.id);
      if (!data) {
        return res.status(404);
      }
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  app.put("/update-note/:id", imageUpload.single("image"), async (req, res) => {
    if (req.file) {
      let Datas = {
        image: req.file.filename,
        title: req.body.title,
        content: req.body.content,
      };

      try {
        const data = await Note.findByIdAndUpdate(req.params.id, Datas, {
          new: true,
        });
        if (!data) {
          return res.status(404).send();
        }
        res.status(200).send(data);
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      let Datas = {
        title: req.body.title,
        content: req.body.content,
      };

      try {
        const data = await Note.findByIdAndUpdate(req.params.id, Datas, {
          new: true,
        });
        if (!data) {
          return res.status(404).send();
        }
        res.status(200).send(data);
      } catch (error) {
        res.status(500).send(error);
      }
    }
  });
  app.delete("/detele-note/:id", async (req, res) => {
    const data = await Note.findById(req.params.id);
    fs.unlinkSync(`images/${data.image}`);
    try {
      const data = await Note.findByIdAndDelete(req.params.id);
      if (!data) {
        return res.status(404).send();
      }
      res.send({ data: "Delete Done" });
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
