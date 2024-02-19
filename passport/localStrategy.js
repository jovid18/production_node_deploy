const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        // usernameField와 passwordField에는 일치하는 로그인 라우터의 req.body 속성명을 작성
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: false,
      },
      //전략을 실행하는 async 함수
      //첫번째 인수에서 넣어준 email과 password가 첫번째, 두번째 매개 변수가 된다.
      //세번째 인수인 done 함수는 passport.authenticate의 콜백함수
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              //로그인 성공
              //done 함수에 사용자 정보를 보냄
              done(null, exUser);
            } else {
              //로그인 실패
              //두번째 인수를 사용하지 않음
              done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
            }
          } else {
            //서버 에러 (사용자 정의 에러)
            done(null, false, { message: '가입되지 않은 회원입니다.' });
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
