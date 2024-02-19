const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
//회원가입 컨트롤러
exports.join = async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    //기존에 같은 이메일로 가이한 사용자가 있는 조회하고 있으면 회원 가입 페이지로 되돌려보냄
    //이때 주소에 에러를 쿼리스트링으로 표시
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    //비밀번호는 암호화해서 저장
    //12번 바고한다는 뜻
    //promise를 지원하여 await를 사용
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

exports.login = (req, res, next) => {
  //로컬 로그인 전략 수행

  //전략이 성공하거나 실패하면 authenticate 메서드의 콜백함수가 실행
  //authError가 있으면 실패한 것
  //user가 있으면 성공한 것이고 이를 이용해 req.login() 메서드 호출
  //Passport는 req객체에 login과 logout 메서드 를 추가
  //req.login->passport.serializeUser 호출->req.login에서 제공하는 user 객체가 serializeUser로 넘어감-> connect.sid 세션 쿠키가 브라우저에 전송
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
};
//req.logout 메서드는 req.user 객체와 req.session 객체를 제거
//req.logout 메서드는 콜백 함수를 인수로 받아, 세션 정보를 지운후 콜백함수를 실행
//이후 메인 페이지로 복귀
exports.logout = (req, res) => {
  console.log('로그아웃', req);
  req.logout(() => {
    console.log('로그아웃2');
    res.redirect('/');
  });
};
