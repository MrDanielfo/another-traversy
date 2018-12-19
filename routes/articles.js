const express = require('express');
const router = express.Router();

// Bring in Article Model

let Article = require('../models/article'); 
// User Model
let User = require('../models/user'); 


// Add Route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_article', {
        title: 'Add Article'
    });
});

// Route for single articles

router.get('/:id', (req, res) => {


    Article.findById(req.params.id, (err, article) => {
        User.findById(article.author, function(err, user){
            if (err) {
                console.log(err);
            } else {
                res.render('article', {
                    article: article,
                    author: user.name
                });
            }
        })
        
    });

});



// Add Route for editing articles

router.get('/edit/:id', ensureAuthenticated, (req, res) => {

    Article.findById(req.params.id, (err, article) => {
        if (err) {
        console.log(err);
        } else {
            User.findById(article.author, function (err, user) {
                if (article.author != req.user._id) {
                    req.flash('danger', 'Not Authorized')
                    res.redirect('/');
                } else {
                    res.render('edit-article', {
                        title: 'Edit ' + article.title,
                        article: article,
                        author: user.name
                    });
                } 
            });    
        }
    });
});

// Add Submit POST
// Se debe instalar un body parser 

router.post('/add',  (req, res) => {
    req.checkBody('title', 'Title is required').notEmpty();
    //req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    // Get Error
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            errors: errors,
            title: 'Add Article'
        });
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;

        article.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Artículo Creado');
                res.redirect('/');
            }
        });
    }
})


// Access Control

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

// Ruta para guardar la edición de posts
// las rutas que simulan un action en php, no es necesario crearlas con pug

router.post('/edit/:id', (req, res) => {
    // se declara de diferente forma, se pasa un objeto vacío

    let article = {};

    article.title = req.body.title;
    article.author = req.user._id;
    article.body = req.body.body;

    let query = { _id: req.params.id }

    // Se usa el objeto en vez de la variable para editar
    // ver cómo toma los parámetros 

    Article.update(query, article, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Artículo Editado');
            res.redirect('/');
        }
    })
})

// Ruta eliminar Post

router.delete('/delete/:id', ensureAuthenticated, (req, res) => {
    if(!req.user_id) {
        res.status(500).send();
    }

  let query = { _id: req.params.id };

  Article.findById(req.params.id, function(err, article){
      if(article.author != req.user_id) {
          res.status(500).send();
      } else {
          Article.remove(query, function (err) {
              if (err) {
                  console.log(err);
              } else {
                  res.send('Sucess');
              }
          });
      }
  }); 

  
});

module.exports = router; 

// El console.log() creado en el servidor se mostrará en la consola 

