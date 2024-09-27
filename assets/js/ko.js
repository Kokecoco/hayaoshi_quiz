const buzzerButton = document.getElementById("buzzer");
const ws = new WebSocket("wss://hayaoshi-quiz-backend.onrender.com");

ws.onopen = () => {
  document.getElementById("status").textContent = "サーバーに接続しました";
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type);
  if (data.type === "reset") {
    buzzerButton.disabled = false; // ボタンを復活させる
    document.getElementById("clients").textContent = "まだ誰も押していません";
  } else if (data.type === "clientId") {
    buzzerButton.dataset.clientId = data.id; // クライアントIDを保存
    document.getElementById("status").textContent =
      `${data.id}番として接続しています。`;
    ws.send(JSON.stringify({ type: "newClient", name: data.id }));
  } else if (data.type === "buzzer") {
    document.getElementById("clients").textContent =
      `${data.name}番が押しました`;
    buzzerButton.disabled = true;
  }
};

buzzerButton.addEventListener("click", () => {
  const timestamp = Date.now(); // 現在時刻のタイムスタンプを取得
  const audio = new Audio("assets/audio/Quiz-Buzzer02-1.mp3");
  audio.play();
  const clientId = buzzerButton.dataset.clientId; // クライアントIDを取得
  ws.send(
    JSON.stringify({
      type: "buzzer",
      name: clientId,
      timestamp: timestamp,
    }),
  ); // 自分の名前とタイムスタンプを送信
  buzzerButton.disabled = true; // ボタンを無効化
  document.getElementById("clients").textContent =
    "あなたが押しました。処理を待っています";
});

document.addEventListener("keydown", function (event) {
  console.log(event.code);
  if (event.code === "Space" || event.code === "Enter") {
    // スペースキーが押されたとき
    buzzerButton.click();
  }
});
