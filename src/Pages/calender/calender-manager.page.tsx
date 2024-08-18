import { useEffect, useState } from "react";
import ListComponent from "../../Components/list.component";
import { alertService } from "../../_services/alert.service";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { EVENT } from "../../_helpers/const/const";
import dayjs from "dayjs";

export default function CalenderManagerPage() {
  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  const headers = [
    {
      key: "title",
      name: "Title",
    },
    {
      key: "starDate",
      name: "Start Date",
    },
    {
      key: "endDate",
      name: "End date",
    },
    {
      key: "purpose",
      name: "Purpose",
    },
  ];

  async function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + EVENT,
      pageNumber
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
      console.log("convertedData :>> ", convertedData);
      setData({
        list: convertedData,
        totalPage: res.totalPage,
      });
    });
  }

  useEffect(() => {
    fetAllData();
  }, []);

  function deleteItem(id) {
    const result = fetchWrapper.delete(config.apiUrl + EVENT + "/" + id);
    result.then((val) => {
      fetAllData();
      alertService.alert({
        content: "Xóa thành công",
      });
    });
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
