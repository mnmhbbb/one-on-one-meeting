import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type Middlewares = [["zustand/devtools", never], ["zustand/immer", never]];

/**
 * immer, devtools(개발환경에서만) 미들웨어를 적용한 스토어 생성 함수
 * @param initializer 스토어 초기화 함수
 * @returns 스토어
 */
export const createStore = <T extends object>(initializer: StateCreator<T, Middlewares, [], T>) =>
  process.env.NODE_ENV === "development"
    ? create<T, Middlewares>(devtools(immer(initializer)))
    : create<T>()(immer(initializer)); // devtools 제외
