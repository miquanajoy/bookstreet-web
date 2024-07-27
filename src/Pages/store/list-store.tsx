import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { alertService, onAlert } from "../../_services";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import draftToHtml from "draftjs-to-html";
import { Trash } from "../../assets/icon/trash";
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

  function deleteItem(val) {
    const result = fetchWrapper.delete(config.apiUrl + "Store/" + val.id);
    result.then((val) => {
      alertService.alert({
        content: "Remove success",
      });
      fetAllData();
    });
  }

  return (
    <>
      <ListComponent
        title="Store Manager"
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
