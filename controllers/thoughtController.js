const { Thought, User} = require('../models');

module.exports = {
  //  GET "/api/thoughts"
  getThoughts(req, res) {
    Thought.find({})
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  //  GET "/:thoughtId
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .populate({
        path: 'reactions',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // POST "/:thoughtID"
  createThought( req, res) {
    Thought.create(req.body)
    .then((thought) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );
    })
    .then((user) =>
      !user
        ? res.status(404).json({
            message: 'thought created, but found no user with that ID',
          })
        : res.json('Created the new thought')
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  },
  // DELETE "/:thoughtId"
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { videos: req.params.thoughtId } },
            { new: true }
      )
    )
      .then((thought) => res.json( { message: 'thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // PUT ""/:thoughtId""
  updateThought(req, res) {
    Thought.findOneAndUpdate( 
      { _id: req.params.thoughtId},
      { $set: req.body },
      { new: true, runValidators: true}
    )
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  //  add reaction - /api/thoughts/:thoughtId/reactions
  addReaction( req, res ) {
    console.log('You are adding a reaction');
    console.log(req.body);
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId},
        { $push: { reactions: req.body} },
        { new: true, runValidators: true }
    )
      .then((reactions) => res.json(reactions))
      .catch((err) => res.status(500).json(err));
  },
//   remove reaction - /api/thoughts/:thoughtId/reactions/:reactionId
  removeReaction( req, res ) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId},
        { $pull: { reactions: {reactionId: req.params.reactionId } } },
        {new: true}
    )
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  }
};

