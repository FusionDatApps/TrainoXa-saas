export const REQUEST_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export function createInitialRequestState() {
  return {
    status: REQUEST_STATUS.IDLE,
    loading: false,
    error: "",
    data: null,
  };
}
