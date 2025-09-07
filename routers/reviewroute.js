const express = require('express')
const router = express.Router({ mergeParams: true });
const asynwrap = require('../utils/wrapasync');
const { validateReview, islogged, isReviewAuthor } = require('../middleware/middleware')
const { addreview, deletereview } = require('../controllers/review')

// review route
router.route('/')
.post(validateReview, islogged, asynwrap(addreview));


// delete review route
router.route('/:reviewid')
.delete(
   islogged, isReviewAuthor,
  asynwrap(deletereview))


module.exports = router;