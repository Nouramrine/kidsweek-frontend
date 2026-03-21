import { createListenerMiddleware } from "@reduxjs/toolkit";
import { login } from "../reducers/user";
import { fetchMembersAsync } from "../reducers/members";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: login,
  effect: async (action, listenrApi) => {
    await listenrApi.dispatch(fetchMembersAsync());
  },
});

export default listenerMiddleware;
