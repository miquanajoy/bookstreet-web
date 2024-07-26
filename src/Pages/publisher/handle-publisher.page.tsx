import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
  convertFromRaw,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";
import { fileService } from "../../_services/file.service";

export default function HandlePublisher() {
  const { register, handleSubmit } = useForm();
  const [editorState, setEditorState] = useState(() => {
    return EditorState.createWithContent(convertValueForEditor(""));
  });

  const [data, setData] = useState<any>();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const [selectedFile, setSelectedFile] = useState<any>();
  const [preview, setPreview] = useState();

  function fetAllData() {
    if (!params.id) return;
    const result = fetchWrapper.get(config.apiUrl + "Publisher/" + params.id);
    result.then((val) => {
      (document.getElementById("nm") as HTMLInputElement).value = val.name;
      setData({ ...val });
      setEditorState(
        EditorState.createWithContent(convertValueForEditor(val.description))
      );
    });
  }

  useEffect(() => {
    fetAllData();
  }, []);

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

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  const savedata = (val) => {
    const formData = new FormData();
    formData.append(
      "files",
      new Blob([selectedFile], { type: "image/png" }),
      "file.png"
    );

    fileService.postFile(formData).then((result) => {
      console.log("result :>> ", result);
    });
    const dataPost = {
      ...data,
      ...val,
      description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
    };

    if (params.id) {
      fetchWrapper.put(config.apiUrl + 'Publisher/' + params.id, dataPost)
    } else {
      fetchWrapper.post(config.apiUrl + 'Publisher', dataPost)
    }
  };

  function convertValueForEditor(val) {
    const sampleMarkup = val;
    const blocksFromHTML = convertFromHTML(sampleMarkup);

    return ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
  }
  return (
    <div className="container">
      <div className="col-10 mx-auto">
        <h1 className="title">Publisher Manager</h1>
        <form
          onSubmit={handleSubmit(savedata)}
          className="grid grid-cols-2 gap-2 jumbotron mt-4"
        >
          <div className="flex flex-column items-center gap-2">
            <label
              htmlFor="imageUpload"
              className="block h-52 w-52 bg-slate-50 bg-contain bg-no-repeat bg-center"
              style={{ backgroundImage: "url(" + preview + ")" }}
            ></label>
            <input
              type="file"
              onChange={onSelectFile}
              id="imageUpload"
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
            <label className="uppercase" htmlFor="nm">
              <b>Publisher name: </b>
            </label>
            <input
              id="nm"
              type="text"
              className="form-control"
              {...register("name")}
            />
            <br />
            <label className="uppercase" htmlFor="Description">
              <b>Description: </b>
            </label>
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={setEditorState}
            />

            <input type="submit" className="btn btn-dark mt-2" value="Save" />
          </div>
        </form>
      </div>
    </div>
  );
}
