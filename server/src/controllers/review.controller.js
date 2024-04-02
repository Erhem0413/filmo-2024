import responseHandler from "../handlers/response.handler.js";
import reviewModel from "../models/review.model.js";

const create = async (req, res) => {
  try {
    const { movieId } = req.params;

    const review = new reviewModel({
      user: req.user.id,
      movieId,
      ...req.body
    });

    await review.save();

    responseHandler.created(res, {
      ...review._doc,
      id: review.id,
      user: req.user
    });
  } catch {
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewModel.findOne({
      _id: reviewId,
      user: req.user.id
    });

    if (!review) return responseHandler.notfound(res);

    await review.remove();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getReviewsOfUser = async (req, res) => {
  try {
    const reviews = await reviewModel.find({
      user: req.user.id
    }).sort("-createdAt");

    responseHandler.ok(res, reviews);
  } catch {
    responseHandler.error(res);
  }
};

export default { create, remove, getReviewsOfUser };

// Энэхүү кодын хэсэг нь тоймтой холбоотой үйлдлүүдийг зохицуулах гурван асинхрон функцийг тодорхойлдог:
// үүсгэх: Заасан киноны шинэ шүүмжийг үүсгэнэ. Энэ нь хүсэлтийн параметрүүдээс киноны ID-г гаргаж авч, одоогийн хэрэглэгчийн ID болон өгөгдсөн хяналтын өгөгдөл бүхий шинэ хянан шалгах баримт бичгийг үүсгэж, мэдээллийн санд хадгалж, үүсгэсэн хянан үзэх объекттой амжилттай хариу илгээдэг.
// устгах: Шүүмжийн ID болон одоогийн хэрэглэгчийн ID дээр үндэслэн шүүмжийг устгана. Энэ нь өгөгдлийн сангаас тоймыг хайж олохыг оролдож, байгаа эсэх, одоогийн хэрэглэгчийнх эсэхийг шалгаж, олдвол устгаж, амжилттай хариу илгээдэг. Хэрэв тойм байхгүй эсвэл одоогийн хэрэглэгчдэд хамаарахгүй бол "олдсонгүй" гэсэн хариу илгээдэг.
// getReviewsOfUser: Одоогийн хэрэглэгчтэй холбоотой бүх шүүмжийг татаж авна. Энэ нь хэрэглэгчийн ID нь одоогийн хэрэглэгчийн ID-тай таарч байгаа бүх тоймыг мэдээллийн сангаас олж, тэдгээрийг үүсгэсэн огноогоор нь буурах дарааллаар эрэмбэлж, олж авсан шүүмжийн хамт амжилттай хариу илгээдэг.
// Бүх функцууд нь try-catch блок ашиглан гарч болзошгүй алдааг зохицуулж, хариу үйлчлэгчийг ашиглан харилцагч руу зохих хариултуудыг илгээдэг.