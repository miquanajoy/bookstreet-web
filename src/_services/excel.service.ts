import { IMPORT_CSV } from "../_helpers/const/csv.const";
import { fileService } from "./file.service";

export const TYPE_BOOK = 1;
export const TYPE_GIFT = 2;
export const TYPE_AUTHOR = 3;

class ExcelService {
  getCsv(template = TYPE_BOOK) {
    window.open(IMPORT_CSV + `?templateImport=${template}`, "_blank");
  }

  async importExcel(e, url) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    let reader = new FileReader();
    let base64String;

    reader.onload = function () {
      base64String = reader.result;
    };
    const formData = new FormData();

    formData.append("file", e.target.files[0]);
    const result = await fileService.postFileExcel(formData, url);
    return JSON.parse(result.data);
  }
}

export const excelService = new ExcelService();
