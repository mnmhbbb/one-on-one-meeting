"use client";

import { useState } from "react";

export default function LoginTest() {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [loginResult, setLoginResult] = useState<null | boolean>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/smartlead-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, userPw }),
    });

    const data = await res.json();
    setLoginResult(data.success);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h1>Smartlead 로그인</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={userPw}
          onChange={(e) => setUserPw(e.target.value)}
          required
        />
        <button type="submit">로그인</button>
      </form>

      {loginResult !== null && <p>{loginResult ? "로그인 성공!" : "로그인 실패 😢"}</p>}
    </div>
  );
}
