import { useEffect, useState } from "react";
import ListComponent from "../../Components/list.component";
import { alertService } from "../../_services/alert.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { EVENT } from "../../_helpers/const/const";
import dayjs from "dayjs";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../_services/search.service";

export default function CalenderManagerPage() {
  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  const headers = [
    {
      key: "title",
      name: "Tiêu đề",
    },
    {
      key: "starDate",
      name: "Ngày bắt đầu",
    },
    {
      key: "endDate",
      name: "Ngày kết thúc",
    },
    {
      key: "purpose",
      name: "Mục đích",
    },
  ];

  async function fetAllData(pageNumber = 1) {
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
        ],
      }
    );
    result.then((res) => {
      const convertedData = res.list.map((val) => {
        return [
          {
            image: val.image,
          },
          {
            id: val.id,
          },
          {
            title: val.title,
          },
          {
            starDate: dayjs(val.starDate).format("YYYY-MM-DD"),
          },
          {
            endDate: dayjs(val.endDate).format("YYYY-MM-DD"),
          },
          {
            purpose: val.purpose,
          },
          {
            hostName: val.hostName,
          },
        ];
      });
      setData({
        list: convertedData,
        totalPage: res.totalPage,
      });
    });
    return result
  }

  useEffect(() => {
    fetAllData();
  }, []);

  // Search area
  useEffect(() => {
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

  return (
    <>
      <ListComponent
        title="QUẢN LÝ SỰ KIỆN"
        buttonName="Tạo sự kiện"
        deleteItem={deleteItem}
        header={headers}
        data={data.list}
        totalPage={data.totalPage}
        handleChange={fetAllData}
      ></ListComponent>
    </>
  );
}
