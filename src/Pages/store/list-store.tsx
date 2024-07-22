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

export default function ListStore() {
  const [data, setData] = useState([]);
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

  function fetAllData() {
    const result = fetchWrapper.get(config.apiUrl + "Store");
    result.then((res) => {
      const convertedData = res.map((val) => [
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
      setData(convertedData);
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
        linkEdit=""
        deleteItem={deleteItem}
        header={headers}
        data={data}
      ></ListComponent>
    </>
  );
}