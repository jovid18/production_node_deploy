const { Post, Hashtag } = require('../models');

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          //데이터베이스에 해시태그가 존재하면 가져오고, 존재하지 않으면 생성한 후 가져오는 메소드
          return Hashtag.findOrCreate({
            //tag에서 #를 떼고 소문자로 바꿈
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      //결과 값으로 [모델, 생성 여부] 반환
      //즉 모델만 추출
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
};
