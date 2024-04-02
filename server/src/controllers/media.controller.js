import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";
import userModel from "../models/user.model.js";
import favoriteModel from "../models/favorite.model.js";
import reviewModel from "../models/review.model.js";
import tokenMiddlerware from "../middlewares/token.middleware.js";

const getList = async (req, res) => {
  try {
    const { page } = req.query;
    const { mediaType, mediaCategory } = req.params;

    const response = await tmdbApi.mediaList({ mediaType, mediaCategory, page });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};

const getGenres = async (req, res) => {
  try {
    const { mediaType } = req.params;

    const response = await tmdbApi.mediaGenres({ mediaType });

    return responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};

const search = async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { query, page } = req.query;

    const response = await tmdbApi.mediaSearch({
      query,
      page,
      mediaType: mediaType === "people" ? "person" : mediaType
    });

    responseHandler.ok(res, response);
  } catch {
    responseHandler.error(res);
  }
};

const getDetail = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;

    const params = { mediaType, mediaId };

    const media = await tmdbApi.mediaDetail(params);

    media.credits = await tmdbApi.mediaCredits(params);

    const videos = await tmdbApi.mediaVideos(params);

    media.videos = videos;

    const recommend = await tmdbApi.mediaRecommend(params);

    media.recommend = recommend.results;

    media.images = await tmdbApi.mediaImages(params);

    const tokenDecoded = tokenMiddlerware.tokenDecode(req);

    if (tokenDecoded) {
      const user = await userModel.findById(tokenDecoded.data);

      if (user) {
        const isFavorite = await favoriteModel.findOne({ user: user.id, mediaId });
        media.isFavorite = isFavorite !== null;
      }
    }

    media.reviews = await reviewModel.find({ mediaId }).populate("user").sort("-createdAt");

    responseHandler.ok(res, media);
  } catch (e) {
    console.log(e);
    responseHandler.error(res);
  }
};

export default { getList, getGenres, search, getDetail };


// Энэхүү кодын хэсэг нь TMDB (The Movie Database) API-аас өгөгдөл татахтай холбоотой янз бүрийн үйлдлүүдийг зохицуулах хэд хэдэн асинхрон функцуудыг тодорхойлдог:
// 1. `getList`: Хуудасны дугаарын хамт заасан медиа төрөл, ангилалд үндэслэн медиа (кино, ТВ шоу гэх мэт) жагсаалтыг гаргаж авна.
// 2. `getGenres`: Тодорхой медиа төрлийн жанрын жагсаалтыг гаргаж авна.
// 3. `хайх`: Өгөгдсөн асуулгын мөр болон зөөвөрлөгчийн төрөлд үндэслэн медиа зүйлсийн хайлтыг гүйцэтгэнэ. Хэрэв энэ нь "хүмүүс" бол TMDB API-ийн хүлээгдэж буй утгад нийцүүлэн медиа төрлийг тохируулдаг.
// 4. `getDetail`: Тухайн медиа зүйлийн тухай дэлгэрэнгүй мэдээлэл, түүний кредит, видео, зөвлөмж, зураг, одоогийн хэрэглэгчийн дуртай эсэх, холбогдох шүүмж гэх мэт хэрэглэгчтэй холбоотой өгөгдөл зэргийг татаж авдаг. Энэ нь мөн хэрэглэгчийн баталгаажуулалтын токеныг тайлж, медиа зүйлийг хэрэглэгчийн дуртай эсэхийг шалгадаг.
// Функц бүр боломжит алдааг зохицуулахын тулд өөрийн функцийг try-catch блокт багтааж, амжилттай мессеж эсвэл алдааны мэдэгдэл гэх мэт зохих хариултуудыг үйлчлүүлэгч рүү буцааж илгээхийн тулд `responseHandler`-г ашигладаг. Нэмж хэлэхэд, энэ нь дибаг хийх зорилгоор баригдсан аливаа алдааг бүртгэдэг.