import { useLocation } from "react-router-dom";
import { BehaviorSubject, Subject } from "rxjs";
import config from "../config";
export interface SearchModel {
  dataSearch: string;
  isClickSearch: boolean;
}
export const typeSearch = 6;
class SearchService {
  $SearchValue = new BehaviorSubject<SearchModel>(undefined);
  setValueSearch(val) {
    this.$SearchValue.next(val);
  }

  filterSearch(requestUrl: string) {
    const apiName = requestUrl.split(config.apiUrl);
    return apiName[1].toLowerCase() + "Name";
  }

  
}

export const searchService = new SearchService();
