const express = require('express')
const Article = require('./../models/article')
const router = express.Router()
// new post route
router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})
// route to get the id of current post
router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article })
})
// edit get route
router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})
// add post request and save value into database
router.post(
  '/',
  async (req, res, next) => {
    req.article = new Article()
    next()
  },
  savePostAndRedirect('new'),
)
// edit post request and save value into database
router.put(
  '/:id',
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
  },
  savePostAndRedirect('edit'),
)
// router.post('/', async (req, res) => {
//   let article = new Article({
//     title: req.body.title,
//     description: req.body.description,
//   })
//   try {
//     article = await article.save()
//     res.redirect(`/articles/${article.slug}`)
//   } catch (e) {
//     res.render('articles/new', { article: article })
//   }
// })
// delete route 'to delete the post by its id, here method-override has been used to use delete option'
router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function savePostAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router
