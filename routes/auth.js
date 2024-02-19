//로그인을 위한 라우터
const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();
//POST /auth/join
router.post('/join', isNotLoggedIn, join);
//Post /auth/login
router.post('/login', isNotLoggedIn, login);
//Post /auth/logout
router.get('/logout', isLoggedIn, logout);

//카카오 로그인 과정 시작
router.get('/kakao', passport.authenticate('kakao'));
//GET/auto/kakao
router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/?error=카카오로그인 실패',
  }),
  (req, res) => {
    //성공 시에는 /로 이동
    res.redirect('/');
  }
);
module.exports = router;
