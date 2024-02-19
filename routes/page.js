const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { renderProfile, renderJoin, renderMain, renderHashtag } = require('../controllers/page');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  //팔로잉/팔로워 숫자와 팔로우 버튼을 표시
  res.locals.followerCount = req.user?.Followers?.length || 0; //팔로잉 수
  res.locals.followingCount = req.user?.Followings?.length || 0; //팔로워 수
  res.locals.followingIdList = req.user?.Followings?.map((f) => f.id) || []; //팔로워 아이디 리스트
  next();
});
//자신의 프로필은 로그인해야 볼 수 있으므로
//req.isAuthenticated()가 true여야 next()를 호출하여
//res.render가 있는 미들웨어로 넘어갈 수 있음
router.get('/profile', isLoggedIn, renderProfile);
//회원 가입 페이지는 로그인 하지 않은 사람에게만 보여야함
//isNotloggedIn 미들웨어로 로그인하지 않아야만 next()로 호출
router.get('/join', isNotLoggedIn, renderJoin);
router.get('/', renderMain);
router.get('/hashtag', renderHashtag);
module.exports = router;
