import { BehaviorSubject } from 'rxjs';

import config from '../config';
import { fetchWrapper } from '../_helpers/fetch-wrapper';

var userSubject = new BehaviorSubject(null);
var baseUrl = `${config.apiUrl}Auth/`;

export const accountService = {
    login,
    logout,
    refreshToken,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    user: userSubject.asObservable(),
    get userValue() {
        console.log('val 26:>> ', userSubject);
        return userSubject.value
    }
};

export function login(email, password) {
    return fetchWrapper.post(`${baseUrl}Login`, { username: email, password: password })
        .then((result) => {
            const convertToString = JSON.stringify(result.data)
            if (result.statusCode === 200) {
                userSubject.next(result.data);

                localStorage.setItem("userInfo", `${convertToString}`)
            }
            return result
        });

}

export function logout() {
    localStorage.removeItem("userInfo")

    // fetchWrapper.post(`${baseUrl}/revoke-token`, {});
    // stopRefreshTokenTimer();
    userSubject.next(null);
    // history.push('/account/login');
    return true
}

function refreshToken() {
    return fetchWrapper.post(`${baseUrl}/refresh-token`, {})
        .then(user => {
            userSubject.next(user);
            startRefreshTokenTimer();
            return user;
        });
}

export function registerHandle(params) {
    return fetchWrapper.post(`${config.apiUrl}Auth`, params);
}

function verifyEmail(token) {
    return fetchWrapper.post(`${baseUrl}/verify-email`, { token });
}

function forgotPassword(email) {
    return fetchWrapper.post(`${baseUrl}/forgot-password`, { email });
}

function validateResetToken(token) {
    return fetchWrapper.post(`${baseUrl}/validate-reset-token`, { token });
}

function resetPassword({ token, password, confirmPassword }) {
    return fetchWrapper.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function create(params) {
    return fetchWrapper.post(baseUrl, params);
}

function update(id, params) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(user => {
            if (user.id === userSubject.value.id) {
                user = { ...userSubject.value, ...user };
                userSubject.next(user);
            }
            return user;
        });
}

function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`)
        .then(x => {
            if (id === userSubject.value.id) {
                logout();
            }
            return x;
        });
}


let refreshTokenTimeout;

function startRefreshTokenTimer() {
    const jwtToken = JSON.parse(atob(userSubject.value.jwtToken.split('.')[1]));

    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    refreshTokenTimeout = setTimeout(refreshToken, timeout);
}

function stopRefreshTokenTimer() {
    clearTimeout(refreshTokenTimeout);
}
