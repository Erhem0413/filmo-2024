import axios from "axios";

const get = async (url) => {
  const response = await axios.get(url, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "identity"
    }
  });
  return response.data;
};

export default { get };

// Ерөнхийдөө энэ код нь захиалгат толгойтой Axios ашиглан GET хүсэлтийг гүйцэтгэх энгийн аргыг өгдөг.