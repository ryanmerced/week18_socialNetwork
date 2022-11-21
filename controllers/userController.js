const { User, Thought } = require('../models');

module.exports = {
  //  GET "/"
  getUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  //  GET "/:userId"
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // POST "/:userId"
  createUser( req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // DELETE "/:userId"
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Update user - PUT "/:userId"
  updateUser(req, res) {
    User.findOneAndUpdate( 
      { _id: req.params.userId},
      { $set: req.body },
      // { $push: { thoughts: _id } },
      { new: true, runValidators: true}
    )
      .then((user) => 
      !user 
        ? res.status(404).json({ message: "No user with that ID" })
        : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  //  add friend - "/:userId/friends/:friendId"
  addFriend( req, res ) {
    console.log('You are adding a friend');
    User.findOneAndUpdate(
        { _id: req.params.userId},
        { $addToSet: { friends: req.params.friendId} },
        { new: true, runValidators: true}
    )
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  //  remove friend - "/:userId/friends/:friendId"
  removeFriend( req, res ) {
    User.findOneAndUpdate(
        { _id: req.params.userId},
        { $pull: { friends: req.params.friendId } },
        {new: true}
    )
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  }
};


