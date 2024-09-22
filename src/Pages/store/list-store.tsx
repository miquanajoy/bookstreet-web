import React, { useEffect, useState } from "react";
import { alertService, onAlert } from "../../_services";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import ListComponent from "../../Components/list.component";
import { STORE } from "../../_helpers/const/const";
import {
  SearchModel,
  searchService,
  typeSearch,
} from "../../_services/home/search.service";

export default function ListStore() {
  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  const headers = [
    {
      key: "image",
      name: "Avatar",
    },
    { key: "storeName", name: "Tên cửa hàng" },
    { key: "locationName", name: "Vị trí" },
    { key: "openingHours", name: "Giờ mở cửa" },
    { key: "closingHours", name: "Giờ đóng cửa" },
    { key: "description", name: "Mô tả" },
  ];

  function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + STORE,
      pageNumber,
      {
        filters: [
          {
            field: "storeName",
            value: searchService.$SearchValue.value?.dataSearch,
            operand: typeSearch,
          },
        ],
      }
    );
    result.then((res) => {
      const convertedData = res.list.map((val) => [
        { id: val.storeId },
        {
          image: val.urlImage,
        },
        {
          storeName: val.storeName,
        },
        {
          locationName: val.locationName,
        },
        {
          openingHours: val.openingHours,
        },
        {
          closingHours: val.closingHours,
        },
        {
          description: val.description,
        },
      ]);
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

  async function deleteItem(id) {
    await fetchWrapper.delete(config.apiUrl + STORE + "/" + id, fetAllData);
  }

  return (
    <>
      <ListComponent
        title="Quản lý cửa hàng"
        buttonName="Tạo cửa hàng"
        deleteItem={deleteItem}
        header={headers}
        data={data.list}
        totalPage={data.totalPage}
        handleChange={fetAllData}
      ></ListComponent>
    </>
  );
}
