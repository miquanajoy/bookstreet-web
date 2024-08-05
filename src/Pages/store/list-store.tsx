import React, { useEffect, useState } from "react";
import { alertService, onAlert } from "../../_services";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import ListComponent from "../../Components/list.component";
import { STORE } from "../../_helpers/const/const";

export default function ListStore() {
  const [data, setData] = useState({
    list: [],
    totalPage: 0,
  });
  const headers = [
    {
      key: "image",
      name: "urlImage",
    },
    { key: "storeName", name: "storeName" },
    { key: "locationName", name: "locationName" },
    { key: "openingHours", name: "openingHours" },
    { key: "closingHours", name: "closingHours" },
    { key: "description", name: "description" },
  ];

  function fetAllData(pageNumber = 1) {
    const result = fetchWrapper.Post2GetByPaginate(
      config.apiUrl + STORE,
      pageNumber
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
  }

  useEffect(() => {
    fetAllData();
  }, []);

  async function deleteItem(id) {
    const result = await fetchWrapper.delete(config.apiUrl + STORE + "/" + id);
    result.then((_) => {
      alertService.alert({
        content: "Remove success",
      });
      fetAllData();
    });
  }

  return (
    <>
      <ListComponent
        title="Store Management"
        buttonName="Create new store"
        deleteItem={deleteItem}
        header={headers}
        data={data.list}
        totalPage={data.totalPage}
        handleChange={fetAllData}
      ></ListComponent>
    </>
  );
}
