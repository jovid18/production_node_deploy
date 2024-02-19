exports.isLoggedIn = (req, res, next) => {
  //Passport는 req 객체에 isAuthenticated 메서드를 추가하며
  //로그인 중이면 req.isAuthenticated()가 true, 로그아웃이면 false
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
};
