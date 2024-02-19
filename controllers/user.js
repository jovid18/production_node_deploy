const User = require('../models/user');

exports.follow = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } }); //:id부분이 req.params.id가 된다.
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10)); //현재 로그인한 사용자와의 관계를 지정
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};
