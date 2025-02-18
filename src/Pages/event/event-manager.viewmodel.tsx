import { useEffect, useState } from "react";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import { calenderDetailService } from "./dialog-detail.component";
import config from "../../config";
import { EVENT } from "../../_helpers/const/const";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../_services/search.service";

const EventManagerViewmodel = () => {
  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  async function fetAllData(pageNumber = 1, formDataFilter?) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + EVENT,
      pageNumber,
      {
        filters: [
          {
            field: "title",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          },
          {
            field: "eventType",
            value: formDataFilter,
            operand: 0,
          },
        ],
      }
    );
    result.then((res) => {
      setData({
        list: res.list,
        totalPage: res.totalPage,
      });
    });
    return result;
  }

  useEffect(() => {
    fetAllData();

    const searchSub = searchService.$SearchValue.subscribe({
      next: (v: SearchModel) => {
        if (v?.isClickSearch) {
          fetAllData();
        }
      },
    });
    return () => searchSub.unsubscribe();
  }, []);
  // End Search area

  function deleteItem(id) {
    fetchWrapper.delete(config.apiUrl + EVENT + "/" + id, fetAllData);
  }

  const handleClickOpenDetail = (v) => {
    calenderDetailService.showDialog(v);
  };

  return {
    data,
    handleClickOpenDetail,
    deleteItem,
    fetAllData,
  };
};
export default EventManagerViewmodel;
