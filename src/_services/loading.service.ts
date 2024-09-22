import { BehaviorSubject, Subject } from "rxjs";

const loading$ = new BehaviorSubject<boolean>(false);
export const isLoadingVarialble = loading$;
export const loadingService = {
  get isLoading() {
    return loading$.value
  },
  loading$,
  showLoading,
  hiddenLoading,
};

function showLoading() {
  loading$.next(true);
}

function hiddenLoading() {
  loading$.next(false);
}
