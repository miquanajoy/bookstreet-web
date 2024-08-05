import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import draftToHtml from "draftjs-to-html";
import { Role } from "../../models/Role";
import { fileService } from "../../_services/file.service";
import { alertService } from "../../_services/alert.service";
import { STORE } from "../../_helpers/const/const";

export default function HandleStore() {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: async () => {
      return await fetAllData();
    },
  });
  const openingHoursNow = watch("openingHours", "");
  const closeHoursNow = watch("closingHours", "");

  const [data, setData] = useState<any>({
    storeId: 0,
    storeName: "",
    locationId: 0,
    locationName: "",
    description: "",
    openingHours: "08:00",
    closingHours: "17:00",
    userId: 0,
    userFullName: "",
    createdAt: new Date(),
    urlImage: "",
  });

  const navigate = useNavigate();
  const params = useParams();

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();
  const [streets, setStreets] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);
  const [editorState, setEditorState] = useState(() => {
    const content = ContentState.createFromText("");
    return EditorState.createWithContent(content);
  });

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    let reader = new FileReader();
    let base64String;

    reader.onload = function () {
      base64String = reader.result;
      setPreview(base64String);
    };
    reader.readAsDataURL(e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl: any = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  async function fetAllData() {
    const streets = await getOption("Street");
    setStreets(streets);

    const locations = await getOption("Location");
    setLocations(locations);

    const users = await getOption("Auth");
    setUsers(users.filter((val) => val.role == Role.Store));

    if (!params.id) return data;
    const result = await fetchWrapper.get(
      config.apiUrl + STORE + "/" + params.id
    );
    setData(result);
    setPreview(result.urlImage);
    const blocksFromHTML = convertFromHTML(result.description ?? "");
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(state));
    return result;
  }

  function getOption(url) {
    return fetchWrapper.get(config.apiUrl + url);
  }

  const savedata = async (val) => {
    console.log("val :>> ", val);
    val.locationName = locations.find(
      (location) => val.locationId == location.locationId
    ).locationName;
    console.log("users :>> ", users);
    val.userFullName = users.find((user) => val.userId == user.id).fullName;

    const formData = new FormData();
    if (selectedFile) {
      formData.append(
        "files",
        new Blob([selectedFile], { type: "image/png" }),
        selectedFile.name
      );
      val.urlImage = await fileService.postFile(formData);
    } else {
      val.urlImage = preview ?? "";
    }

    let process;
    if (params.id) {
      val.storeId = params.id;
      process = fetchWrapper.put(config.apiUrl + STORE + "/" + params.id, val);
    } else {
      delete val.storeId;
      process = fetchWrapper.post(config.apiUrl + STORE, val);
    }

    process.then((res) => {
      if (res.errors) {
        let listErr = {};
        for (const key in res.errors) {
          const element = res.errors[key];
          listErr = {
            ...listErr,
            [key]: element[0],
          };
        }
        return;
      }
      alertService.alert({
        content: params.id ? "Update success" : "Create success",
      });
      navigate("/location", { replace: true });
    });
  };
  return (
    <div className="container">
      <form
        onSubmit={handleSubmit(savedata)}
        className="grid grid-cols-3 gap-2 jumbotron mt-4"
      >
        <div className="row-span-2 flex flex-column items-center gap-2">
          <label
            htmlFor="imageUpload"
            className="block h-52 w-52 bg-slate-50 bg-contain bg-no-repeat bg-center"
            style={{ backgroundImage: "url(" + preview + ")" }}
          ></label>
          <input
            type="file"
            onChange={onSelectFile}
            id="imageUpload"
            accept="image/png, image/jpeg"
            className="hidden"
          />
          <label
            htmlFor="imageUpload"
            className="block border px-2 py-1 bg-slate-50 rounded"
          >
            New Image
          </label>
        </div>
        <div>
          <div>
            <label htmlFor="storeName">
              <b>Store name: </b>
            </label>
            <input
              id="storeName"
              type="text"
              className="form-control"
              placeholder="Store name"
              {...register("storeName")}
            />
            <br />
          </div>
          <div>
            <label htmlFor="User">
              <b>User: </b>
            </label>
            <select {...register("userId")} id="User" className="form-control">
              {users.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.fullName}
                </option>
              ))}
            </select>
            <br />
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="location">
              <b>Location: </b>
            </label>
            <select
              {...register("locationId")}
              id="location"
              className="form-control"
            >
              {locations.map((v) => (
                <option key={v.locationId} value={v.locationId}>
                  {v.locationName}
                </option>
              ))}
            </select>
            <br />
          </div>

          <div>
            <label htmlFor="openH">
              <b>Open hour: </b>
            </label>
            <input
              type="time"
              {...register("openingHours")}
              id="openH"
              className="form-control"
              max={closeHoursNow}
            />
            <br />
          </div>
          <div>
            <label htmlFor="closH">
              <b>Close hour: </b>
            </label>
            <input
              type="time"
              {...register("closingHours")}
              id="closH"
              className="form-control"
              min={openingHoursNow}
            />
            <br />
          </div>
        </div>

        <div className="col-start-2 col-span-2">
          <label htmlFor="avb">
            <b>Description: </b>
          </label>
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={setEditorState}
          />
          <input type="submit" className="btn btn-success mt-12" value="Save" />
        </div>
      </form>
    </div>
  );
}
