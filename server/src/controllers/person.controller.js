import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";

const personDetail = async (req, res) => {
  try {
    const { personId } = req.params;

    const person = await tmdbApi.personDetail({ personId });

    responseHandler.ok(res, person);
  } catch {
    responseHandler.error(res);
  }
};

const personMedias = async (req, res) => {
  try {
    const { personId } = req.params;

    const medias = await tmdbApi.personMedias({ personId });

    responseHandler.ok(res, medias);
  } catch {
    responseHandler.error(res);
  }
};


export default { personDetail, personMedias };

// Энэхүү кодын хэсэг нь TMDB (The Movie Database) API-аас хүнтэй холбоотой мэдээлэл болон медиаг сэргээхтэй холбоотой үйлдлүүдийг зохицуулах хоёр асинхрон функцийг тодорхойлдог:
// personDetail: Өгөгдсөн хүний ID дээр үндэслэн тодорхой хүний талаарх дэлгэрэнгүй мэдээллийг авна.
// personMedias: Тухайн хүнтэй холбоотой, тухайлбал, тэдний оролцсон кино, ТВ шоу гэх мэт медиа зүйлсийг татаж авдаг.
// Энэ хоёр функц хоёулаа боломжит алдааг шийдвэрлэхийн тулд оролдлого барих блокт өөрийн функцийг боож, амжилттай мессеж эсвэл алдааны мэдэгдэл гэх мэт зохих хариуг харилцагч руу буцааж илгээхийн тулд answerHandler ашигладаг.