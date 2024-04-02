import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const signup = async (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    const checkUser = await userModel.findOne({ username });

    if (checkUser) return responseHandler.badrequest(res, "username already used");

    const user = new userModel();

    user.displayName = displayName;
    user.username = username;
    user.setPassword(password);

    await user.save();

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch {
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username }).select("username password salt id displayName");

    if (!user) return responseHandler.badrequest(res, "User not exist");

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch {
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel.findById(req.user.id).select("password id salt");

    if (!user) return responseHandler.unauthorize(res);

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    user.setPassword(newPassword);

    await user.save();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch {
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updatePassword
};


// Энэхүү кодын хэсэг нь хэрэглэгчийн баталгаажуулалт болон мэдээлэл хайхтай холбоотой хэд хэдэн асинхрон функцийг тодорхойлдог:

// бүртгүүлэх: Өгөгдсөн хэрэглэгчийн нэр, нууц үг, дэлгэцийн нэрээр шинэ хэрэглэгчийг бүртгэнэ. Энэ нь хэрэглэгчийн нэр аль хэдийн ашиглагдаж байгаа эсэхийг шалгах, шинэ хэрэглэгчийн баримт бичиг үүсгэх, хэш функц ашиглан хэрэглэгчийн нууц үгийг тохируулах, хэрэглэгчийг мэдээллийн санд хадгалах, хэрэглэгчийн ID-тай JWT токен үүсгэх, токен болон амжилттай хариу илгээх. хэрэглэгчийн мэдээлэл.

// нэвтрэх: Өгөгдсөн хэрэглэгчийн нэр, нууц үгээр хэрэглэгчийг баталгаажуулна. Энэ нь хэрэглэгч байгаа эсэхийг шалгаж, нууц үгээ баталгаажуулж, JWT токен үүсгэж, хэрэглэгчийн объектоос эмзэг мэдээллийг (нууц үг, давс) устгаж, токен болон хэрэглэгчийн мэдээллийн хамт амжилттай хариу илгээдэг.

// updatePassword: Баталгаажсан хэрэглэгчийн нууц үгийг шинэчилнэ. Энэ нь өгөгдлийн сангаас хэрэглэгчийг татаж авч, одоогийн нууц үгийг баталгаажуулж, хэш функц ашиглан шинэ нууц үгээ тохируулж, шинэчлэгдсэн хэрэглэгчийн объектыг хадгалж, амжилттай хариу илгээдэг.

// getInfo: Баталгаажсан хэрэглэгчийн талаарх мэдээллийг авна. Энэ нь өгөгдлийн сангаас хэрэглэгчийг ID-аар нь олж, хэрэглэгчийн мэдээлэлтэй амжилттай хариу илгээдэг.

// Бүх функцууд нь try-catch блок ашиглан гарч болзошгүй алдааг зохицуулж, хариу үйлчлэгчийг ашиглан харилцагч руу зохих хариултуудыг илгээдэг.