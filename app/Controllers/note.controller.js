const Note = require('../Models/note.model.js');
exports.create = (req, res) => {
	if(!req.body.content) {
		return res.status(400).send({
			message: "Note content can not be empty"
		});
	}
	const note = new Note(req.body);
	note.save().then(data => {
		res.json(data);
	}).catch(err => {
		res.send(err);
	});
};
exports.findAll = (req, res) => {
	Note.find().then(notes => {
		res.send(notes);
	}).catch(err => {
		res.send(err);
	});
};
exports.findOne = (req, res) => {
	Note.findById(req.params.noteId).then(note => {
		res.send(note);
	}).catch(err => {
		res.send({
			message: "Not Found This id :-" + req.params.noteId
		});
	});
};
exports.update = (req, res) => {
	Note.findById(req.params.noteId).then(note => {
		Note.update({
			_id: req.params.noteId
		}, {
			content: req.body.content,
			title: req.body.title
		}, (err, data) => {
			if(err) throw err;
			Note.findById(req.params.noteId).then(reslut => {
				res.json(reslut);
			});
		})
	}).catch(err => {
		res.send({
			message: "Note not found with id:-" + req.params.noteId
		});
	});
}
exports.delete = (req, res) => {
	Note.findByIdAndRemove(req.params.noteId).then(note => {
		res.send({
			message: "Note deleted successfully!"
		});
	}).catch(err => {
		res.json("Note not found with id:-" + req.params.noteId);
	});
};
