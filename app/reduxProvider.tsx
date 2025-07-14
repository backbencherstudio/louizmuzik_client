"use client";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";

interface Providers {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: Providers) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}