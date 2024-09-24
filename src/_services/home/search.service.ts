import { useLocation } from "react-router-dom";
import { BehaviorSubject, Subject } from "rxjs";
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
    const apiName = requestUrl.split("https://fptbs.azurewebsites.net/api/");
    return apiName[1].toLowerCase() + "Name";
  }

  
}

export const searchService = new SearchService();
