import axios from "axios";
import { fetchWrapper } from "../_helpers/fetch-wrapper";
import config from "../config";

class FileService {
  postFile(files) {
    return axios({
      method: "post",
      url: `${config.apiUrl}File`,
      data: files,
      headers: {
        Accept: "text/plain",
        "Content-Type": "multipart/form-data; boundary=----",
        ...this.authHeader(),
      },
    }).then(res => {
      const urlImg = `https://fptbs.azurewebsites.net/api/File/image/${res.data.data[0]}?resizeIfWider=true&resizeImageAndRatio=true`
      return urlImg
    });
  }
  authHeader() {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    return { Authorization: `${user.token}` };
  }
}

export const fileService = new FileService();
