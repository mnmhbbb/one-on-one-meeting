import { http, HttpResponse } from "msw";

const User = [
  { id: "mnmhbbb", nickname: "min-hee baek" },
  { id: "test", nickname: "테스트" },
];

export const handlers = [
  http.get("/api/users/:userId", ({ params }) => {
    const { userId } = params;
    const found = User.find(v => v.id === userId);
    if (found) {
      return HttpResponse.json(found);
    }
    return HttpResponse.json(
      { message: "no_such_user" },
      {
        status: 404,
      }
    );
  }),
  http.get("/api/list", () => {
    return HttpResponse.json([
      { id: 1, title: "안녕하세요?", count: 2323 },
      { id: 2, title: "안녕하세요?2", count: 2323 },
      { id: 3, title: "안녕하세요?3", count: 2323 },
      { id: 4, title: "안녕하세요?4", count: 2323 },
      { id: 5, title: "안녕하세요?5", count: 2323 },
      { id: 6, title: "안녕하세요?6", count: 2323 },
      { id: 7, title: "안녕하세요?7", count: 2323 },
      { id: 8, title: "안녕하세요?8", count: 2323 },
      { id: 9, title: "안녕하세요?9", count: 2323 },
    ]);
  }),
];

export default handlers;
