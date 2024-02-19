const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {
  //kakao login에 대한 설정
  passport.use(
    new KakaoStrategy(
      {
        //kakao에서 발급해주는 아이디
        //노출 방지를 위해 process.env.KAKAO_ID로 설정
        //나중에는 아이디를 발급받아 .env 파일에 넣을 것
        clientID: process.env.KAKAO_ID,
        //카카오로부터 인증 결과를 받을 라우터 주소
        callbackURL: '/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
          //카카오를 통해 회원 가입을 한 사용자가 있는 조회
          const exUser = await User.findOne({
            where: { snsId: profile.id, provider: 'kakao' },
          });
          if (exUser) {
            //이미 회원 가입이 되어있다면 사용자 정보와 함께 done 함수를 호출하고 전략을 종료
            done(null, exUser);
          } else {
            //없다면 회원 가입을 진행

            const newUser = await User.create({
              // profile 속성이 undefined일 수 있어 옵셔널 체이닝 문법을 사용
              email: profile._json?.kakao_account?.email,
              nick: profile.displayName,
              snsId: profile.id,
              provider: 'kakao',
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
