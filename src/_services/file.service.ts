import axios from "axios";
import { fetchWrapper } from "../_helpers/fetch-wrapper";
import config from "../config";
import { alertService } from "./alert.service";
import { URL_IMG } from "../_helpers/const/csv.const";
import { loadingService } from "./loading.service";

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
    })
      .then((res) => {
        const urlImg = URL_IMG + `${res.data.data[0]}`;
        return urlImg;
      })
      .catch(() => {
        alertService.alert({
          content: "Have an error when update image",
        });
      });
  }

  postFileExcel(files, url) {
    loadingService.showLoading();
    url = config.apiUrl + url;
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
      loadingService.hiddenLoading();
      return res.data;
    });
  }

  authHeader() {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    return { Authorization: `${user.token}` };
  }
}

export const fileService = new FileService();
