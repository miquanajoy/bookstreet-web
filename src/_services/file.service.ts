import axios from "axios";
import { fetchWrapper } from "../_helpers/fetch-wrapper";
import config from "../config";

class FileService {
  postFile(files, url?) {
    url = `${config.apiUrl}` + (url ? url : "File");
    return axios({
      method: "post",
      url,
      data: files,
      headers: {
        Accept: "text/plain",
        "Content-Type": "multipart/form-data; boundary=----",
        ...this.authHeader(),
      },
    }).then((res) => {
      const urlImg = `https://fptbs.azurewebsites.net/api/File/image/${res.data.data[0]}`;
      return urlImg;
    });
  }

  postFileExcel(files, url) {
    url = config.apiUrl + url ;
    return axios({
      method: "post",
      url,
      data: files,
      headers: {
        Accept: "text/plain",
        "Content-Type": "multipart/form-data; boundary=----",
        ...this.authHeader(),
      },
    }).then((res) => {
        return res.data
      
    });
  }

  authHeader() {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    return { Authorization: `${user.token}` };
  }
}

export const fileService = new FileService();
