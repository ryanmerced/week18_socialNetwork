const router = require('express').Router();

const {

    getThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction,

} = require('../../controllers/thoughtController');

// get all thoughts /api/thoughts
router.route('/')
    .get(getThoughts)
    .post(createThought);

// get single thought /api/thoughts/:thoughtId
router.route('/:thoughtId')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought);

// post reaction  /api/thoughts/reactions
router.route('/:thoughtId/reactions').post(addReaction);

// remove reaction /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);



module.exports = router;