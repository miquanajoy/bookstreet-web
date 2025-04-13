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
import convertDate from "../../_helpers/converts/convertDate";

const EventManagerViewmodel = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [formData, setFormData] = useState<any>();
  const [eventStatus, setEventStatus] = useState<any>(1);

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
        value: eventTp === "5" ? undefined : eventTp,
        operand: 0,
      },
      // {
      //   field: "eventType",
      //   value: eventTp,
      //   operand: 0,
      // },
    ];
    switch (eventStatus) {
      case "0": // Assuming eventStatus < 1 means 0
        filters.push(
          {
            field: "starDate",
            value: currentDate,
            operand: 2,
          },
          {
            field: "endDate",
            value: currentDate,
            operand: 2,
          }
        );
        break;
      case "1":
        filters.push(
          {
            field: "starDate",
            value: currentDate,
            operand: 5,
          },
          {
            field: "endDate",
            value: currentDate,
            operand: 3
          }
        );
        break;
      case "2":
        filters.push({
          field: "endDate",
          value: currentDate,
          operand: 4,
        });
        break;
      default:
        // Handle any other cases if needed
        break;
    }
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + EVENT,
      pageNumber,
      {
        filters,
      }
    );
    result.then((res) => {
      console.log('res :>> ', res);
      setData({
        list: res.list,
        totalPage: res.totalPage,
      });
    });
    return result;
  }

  useEffect(() => {
    fetAllData(1, undefined, "1");
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
    formData,
    setFormData,
    eventStatus,
    setEventStatus,
  };
};
export default EventManagerViewmodel;
