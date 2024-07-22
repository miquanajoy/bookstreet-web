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

export default function HandleArea() {
  const [data, setData] = useState([]);
  const headers = [
    {
      key: "image",
      name: "urlImage",
    },
    { key: "areaName", name: "areaName" },
    { key: "streetName", name: "streetName" },
  ];

  function fetAllData() {
    const result = fetchWrapper.get(config.apiUrl + "Area");
    result.then((val) => {
      const convertedData = val.map((val) => {
        let p = [];
        p.push({ id: val.areaId });
        p.push({ image: val.urlImage });
        for (const key in val) {
          if (!["streetId", "urlImage"].includes(key)) {
            p.push({ [key]: val[key] });
          }
        }
        return p;
      });
      setData(convertedData);
    });
  }

  useEffect(() => {
    fetAllData();
  }, []);

  function deleteItem(val) {
    const result = fetchWrapper.delete(
      config.apiUrl + "Area/" + val.id
    );
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
        title="Area Manager"
        buttonName="Create new area"
        linkEdit=""
        deleteItem={deleteItem}
        header={headers}
        data={data}
      ></ListComponent>
    </>
  );
}
