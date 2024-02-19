const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  //로그인 시 실행, req.session 객체에 어떤 데이터를 저장할지 정하는 메서드
  // 매개변수로 user를 받고 done 함수에 두번째 인수로 user.id를 넘김
  passport.serializeUser((user, done) => {
    console.log('serialize');
    //첫번째 인수는 에러가 발생할 때, 두번째 인수에는 저장하고 싶은 데이터(여기서는 user.id)를 넣음
    done(null, user.id);
  });
  //각 요청마다 실행
  //passport.session 미들웨어가 이 메서드를 호출
  //serializeUser의 done의 두번째 인수로 넣었던 데이터가 deserializeUser의 매개변수가 됨
  passport.deserializeUser((id, done) => {
    console.log('deserialize');
    //req.user를 바꾸기 위해 deserializeUser를 조작
    User.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', 'nick'], as: 'Followers' }, //비밀번호가 유출되지 않게 하기 위함
        { model: User, attributes: ['id', 'nick'], as: 'Followings' },
      ],
    })
      .then(
        (user) => done(null, user) //req.user에 저장
      )
      .catch((err) => done(err));
  });
  local();
  kakao();
};
