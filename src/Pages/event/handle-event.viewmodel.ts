import { LOCATION } from "../../_helpers/const/const";
import { fetchWrapper } from "../../_helpers/fetch-wrapper";
import config from "../../config";

export default function HandleEventViewmodel() {
  async function getLocation() {
    const result = await fetchWrapper.Post2GetByPaginate(
      config.apiUrl + LOCATION,
      0,
      undefined,
      0
    );

    return result.list;
  }
  return {  getLocation};
}
