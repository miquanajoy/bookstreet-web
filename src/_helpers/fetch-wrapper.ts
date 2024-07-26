import config from "../config";
import { accountService, alertService } from "../_services";
import axios from "axios";
import { PAGINATOR } from "./const/paginator.const";

export const fetchWrapper = {
  getByValue,
  get,
  post,
  put,
  Post2GetByPaginate,
  delete: _delete,
  postUpgrade
};

function get(url) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function Post2GetByPaginate(url, pageNumber, filter?) {
  const requestOptions = {
    ...authHeader(url),
  };

  return axios({
    url: url + PAGINATOR.URL,
    method: "post",
    data: {
      page: pageNumber,
      limit: PAGINATOR.LIMIT,
      ...filter
    },
    headers: requestOptions,
  }).then(handleResponseForPost2Get);
}

function getByValue(url, value) {
  const requestOptions = {
    method: "GET",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
  const requestOptions: any = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then((response) => response.json());
}

function postUpgrade(url, body) {
  const requestOptions: any = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponseForPost)    ;
}

function put(url, body) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function _delete(url) {
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function authHeader(url) {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const isLoggedIn = user && user.token;
  const isApiUrl = url.startsWith(config.apiUrl);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `${user.token}` };
  } else {
    return {};
  }
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if ([401, 403].includes(response.status) && accountService.userValue) {
        // accountService.logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function handleResponseForPost2Get(response) {
  console.log("response :>> ", response);

  const data = response.data.data;

  if (!(response.statusText == "OK")) {
    if ([401, 403].includes(response.status) && accountService.userValue) {
      // accountService.logout();
    }
    const error = (data && data.message) || response.statusText;

    return Promise.reject(error);
  }
  const { total: total } = data.pagination;

  return { list: data.list, totalPage: PAGINATOR.calculatorPageTotals(total) };
}

function handleResponseForPost(response) {
  if ([400].includes(response.status)) {
    alertService.alert({
      content: "Can't create",
    });
    return Promise.reject(response.errors);
  }

  if(response.statusCode == 200) {
    return Promise.resolve();
  }

  if (!(response.statusText == "OK")) {
    if ([401, 403].includes(response.status) && accountService.userValue) {
      // accountService.logout();
    }
    alertService.alert({
      content: "Can't create",
    });
    return Promise.reject();
  }
}