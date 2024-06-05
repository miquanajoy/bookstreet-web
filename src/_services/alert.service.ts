import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

const alertSubject = new Subject();
const defaultId = 'default-alert';

export const alertService = {
    onAlert,
    success,
    error,
    info,
    warn,
    alert,
    clear
};

export const AlertType = {
    Success: 'Success',
    Error: 'Error',
    Info: 'Info',
    Warning: 'Warning'
}

export function onAlert(id = defaultId) {
    return alertSubject
}

function success(message, options) {
    alert({ ...options, type: AlertType.Success, message });
}

function error(message, options) {
    alert({ ...options, type: AlertType.Error, message });
}

function info(message, options) {
    alert({ ...options, type: AlertType.Info, message });
}

function warn(message, options) {
    alert({ ...options, type: AlertType.Warning, message });
}

function alert(alert) {
    alertSubject.next(alert);

}

function clear(id = defaultId) {
    alertSubject.next({ id });
}