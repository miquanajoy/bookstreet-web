import { BehaviorSubject, Subject } from "rxjs";

const loading$ = new Subject<boolean>();
export const isLoadingVarialble = loading$;
export const loadingService = {
  get isLoading() {
    return loading$
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
