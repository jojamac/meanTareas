var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var mongoose = require('mongoose');
var Tareas = mongoose.model('Tareas');

//GET - listar tareas
router.get('/tareas', function(req, res, next){
	Tareas.find(function(err, tareas){
		if (err) {return next(err)}
			res.json(tareas);
	})
});

//POST crear tarea
router.post('/tarea', function(req, res, next){
	var tareaCreada = new Tareas(req.body);

	tareaCreada.save(function(err, tareaCreada){
			if (err) {return next(err)}
				res.json(tareaCreada);
	})
})

//PUT actualizar tarea
router.put('/tarea/:id', function(req, res){
	Tareas.findById(req.params.id, function(err, tarea){
		tarea.nombre = req.body.nombre;
		tarea.prioridad = req.body.prioridad;

		tarea.save(function(err){
			if (err) {res.send(err)}
				res.json(tarea);
		})
	})
})

//DELETE eliminar tarea
router.delete('/tarea/:id', function(req, res){
	Tareas.findByIdAndRemove(req.params.id, function(err){
			if (err) {res.send(err)}
				res.json({mensajeRta: 'La tarea se ha eliminado'});
	})
})

module.exports = router;
