import config from "../config";
import { accountService, alertService } from "../_services";
import axios from "axios";
import { PAGINATOR } from "./const/paginator.const";
import { loadingService } from "../_services/loading.service";

export const fetchWrapper = {
  getByValue,
  get,
  post,
  put,
  Post2GetByPaginate,
  delete: _delete,
  postUpgrade,
};

function get(url) {
  loadingService.showLoading();
  const requestOptions = {
    method: "GET",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function Post2GetByPaginate(
  url,
  pageNumber = 1,
  filter?,
  limit = PAGINATOR.LIMIT
) {
  loadingService.showLoading();
  const requestOptions = {
    ...authHeader(url),
  };

  return axios({
    url: url + PAGINATOR.URL,
    method: "post",
    data: {
      page: pageNumber,
      limit: limit,
      ...filter,
    },
    headers: requestOptions,
  }).then(handleResponseForPost2Get);
}

function getByValue(url, value) {
  loadingService.showLoading();
  const requestOptions = {
    method: "GET",
    headers: authHeader(url),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

function post(url, body) {
  loadingService.showLoading();
  const requestOptions: any = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then((response) => {
    loadingService.showLoading();
    return response.json();
  });
}

function postUpgrade(url, body) {
  loadingService.showLoading();
  const requestOptions: any = {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponseForPost);
}

function put(url, body) {
  loadingService.showLoading();
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader(url) },
    body: JSON.stringify(body),
  };
  return fetch(url, requestOptions).then(handleResponse);
}

async function _delete(url) {
  loadingService.showLoading();
  const requestOptions = {
    method: "DELETE",
    headers: authHeader(url),
  };
  return await fetch(url, requestOptions).then((data) => {
    return data;
  });
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
  loadingService.hiddenLoading();

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
  loadingService.hiddenLoading();

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
  loadingService.hiddenLoading();
  if ([400].includes(response.status)) {
    alertService.alert({
      content: "Can't create",
    });
    return Promise.reject(response.errors);
  }

  if (response.statusCode == 200) {
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
