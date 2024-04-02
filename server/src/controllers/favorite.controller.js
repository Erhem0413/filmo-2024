import responseHandler from "../handlers/response.handler.js";
import favoriteModel from "../models/favorite.model.js";

const addFavorite = async (req, res) => {
  try {
    const isFavorite = await favoriteModel.findOne({
      user: req.user.id,
      mediaId: req.body.mediaId
    });

    if (isFavorite) return responseHandler.ok(res, isFavorite);

    const favorite = new favoriteModel({
      ...req.body,
      user: req.user.id
    });

    await favorite.save();

    responseHandler.created(res, favorite);
  } catch {
    responseHandler.error(res);
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;

    const favorite = await favoriteModel.findOne({
      user: req.user.id,
      _id: favoriteId
    });

    if (!favorite) return responseHandler.notfound(res);

    await favorite.remove();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getFavoritesOfUser = async (req, res) => {
  try {
    const favorite = await favoriteModel.find({ user: req.user.id }).sort("-createdAt");

    responseHandler.ok(res, favorite);
  } catch {
    responseHandler.error(res);
  }
};

export default { addFavorite, removeFavorite, getFavoritesOfUser };

// Энэхүү кодын хэсэг нь дуртай холбоотой үйлдлүүдийг зохицуулах гурван асинхрон функцийг тодорхойлдог:
// 1. `addFavorite`: Хэрэв энэ нь байхгүй бол одоогийн хэрэглэгчийн шинэ дуртай зүйл нэмнэ. Энэ нь тухайн зүйл аль хэдийн дуртай эсэхийг шалгадаг бөгөөд хэрэв үгүй бол шинэ дуртай бичлэг үүсгэж, мэдээллийн санд хадгалдаг.
// 2. `removeFavorite`: Өгөгдсөн дуртай ID дээр үндэслэн одоогийн хэрэглэгчийн дуртай зүйлийг устгана. Энэ нь хэрэглэгчдэд дуртай зүйл байгаа эсэхийг шалгаж, мэдээллийн сангаас устгадаг.
// 3. `getFavoritesOfUser`: Өгөгдлийн сангаас одоогийн хэрэглэгчийн дуртай бүх зүйлсийг татаж, үүсгэсэн огнооноос нь хамааран буурах дарааллаар эрэмбэлнэ.
// Функц бүр нь try-catch блок ашиглан болзошгүй алдааг зохицуулж, амжилттай болсон тухай мессеж, алдааны мэдэгдэл гэх мэт зохих хариуг үйлчлүүлэгч рүү буцааж илгээхийн тулд `responseHandler`-г ашигладаг.