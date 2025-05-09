import { useEffect, useState } from "react";
import { fetchWrapper } from "../../../../_helpers/fetch-wrapper";
import config from "../../../../config";
import { EVENT } from "../../../../_helpers/const/const";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../../../_services/search.service";
import convertDate from "../../../../_helpers/converts/convertDate";

const useMembershipHook = () => {  
  const [formData, setFormData] = useState<any>(null);
  const [eventStatus, setEventStatus] = useState<any>(null);

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  async function fetAllData(pageNumber = 1, eventTp?, eventStatus?) {
    const currentDate = convertDate(new Date());

    const filters = [
      {
        field: "title",
        value: searchService.$SearchValue.value?.dataSearch,
        operand: typeSearch,
      },
      {
        field: "eventType",
        value: eventTp,
        operand: 0,
      },
    ];
    if (eventStatus) {
      if (eventStatus > 0) {
        filters.push({
          field: "startDate",
          value: currentDate,
          operand: 4,
        }, {
          field: "endDate",
          value: currentDate,
          operand: 2,
        });
        // return event.starDate < currentDate && event.endDate > currentDate;
      } else {
        filters.push({
          field: "startDate",
          value: currentDate,
          operand: 2,
        });
        // return event.starDate > currentDate;
      }
    } else {
      // return event;
    }
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + EVENT,
      pageNumber,
      {
        filters
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
  };

  return {
    data,
    handleClickOpenDetail,
    deleteItem,
    fetAllData,
    formData, setFormData, eventStatus, setEventStatus
  };
};
export default useMembershipHook;
