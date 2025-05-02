import { useEffect, useState, useCallback } from "react";
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
import dayjs, { Dayjs } from "dayjs";
import { debounce } from "lodash";

const EventManagerViewmodel = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [formData, setFormData] = useState<any>();
  const [eventStatus, setEventStatus] = useState<any>("1");
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [filterType, setFilterType] = useState<"status" | "date" | null>("status");

  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });

  const fetAllData = useCallback(
    async (
      pageNumber = 1,
      eventTp?,
      eventStatus?,
      fromDate?: Dayjs | null,
      toDate?: Dayjs | null,
      filterType?: "status" | "date" | null
    ) => {
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
      ];

      // Thêm bộ lọc dựa trên filterType
      if (filterType === "date" && (fromDate || toDate)) {
        if (fromDate) {
          filters.push({
            field: "starDate",
            value: convertDate(fromDate.toDate()),
            operand: 3, // Lớn hơn hoặc bằng (gte)
          });
        }
        if (toDate) {
          const toDateEndOfDay = toDate.set("hour", 23).set("minute", 59).set("second", 59);
          filters.push({
            field: "endDate",
            value: convertDate(toDateEndOfDay.toDate()),
            operand: 5, // Nhỏ hơn hoặc bằng (lte)
          });
        }
      } else if (filterType === "status" && eventStatus !== undefined) {
        switch (eventStatus) {
          case "0": // Sắp diễn ra
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
          case "1": // Đang diễn ra
            filters.push(
              {
                field: "starDate",
                value: currentDate,
                operand: 5,
              },
              {
                field: "endDate",
                value: currentDate,
                operand: 3,
              }
            );
            break;
          case "2": // Đã kết thúc
            filters.push({
              field: "endDate",
              value: currentDate,
              operand: 4
            }
            );
            break;
          default:
            break;
        }
      }

      const result = await fetchWrapper.Post2GetByPaginate(
        config.apiUrl + EVENT,
        pageNumber,
        {
          filters,
        }
      );
        setData({
          list: result.list,
          totalPage: result.totalPage,
        });
      return result;
    },
    []
  );

  const debouncedFetAllData = useCallback(
    debounce(
      (pageNumber, eventTp, eventStatus, fromDate, toDate, filterType) => {
        fetAllData(pageNumber, eventTp, eventStatus, fromDate, toDate, filterType);
      },
      300
    ),
    [fetAllData]
  );

  useEffect(() => {
    debouncedFetAllData(1, formData, eventStatus, fromDate, toDate, filterType);
    const searchSub = searchService.$SearchValue.subscribe({
      next: (v: SearchModel) => {
        if (v?.isClickSearch) {
          debouncedFetAllData(1, formData, eventStatus, fromDate, toDate, filterType);
        }
      },
    });
    return () => searchSub.unsubscribe();
  }, [debouncedFetAllData, formData, eventStatus, fromDate, toDate, filterType]);

  function deleteItem(id) {
    fetchWrapper.delete(config.apiUrl + EVENT + "/" + id, () =>
      fetAllData(1, formData, eventStatus, fromDate, toDate, filterType)
    );
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
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    filterType,
    setFilterType,
  };
};

export default EventManagerViewmodel;