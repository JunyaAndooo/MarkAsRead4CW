import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getMessage, CwMessage } from "../src/helpers/chatworkHelper";

// axiosのインスタンスを作成
const instance = axios.create();
// モックアダプターを作成
const mock = new MockAdapter(instance);

// テスト用の環境変数
const cwKey = "test_key";
const cwRoomId = "test_room";

// テスト用のフィルター関数
const filter = (data: CwMessage[]) => data[0].body;

describe("getMessage", () => {
  // 正常系のテスト
  test("正しいアクセスキーでリクエストした場合はメッセージが返る", async () => {
    mock
      .onGet(`https://api.chatwork.com/v2/rooms/${cwRoomId}/messages`)
      .reply(200, [
        {
          body: "test message",
          message_id: "test_id",
          account: {
            account_id: "test_account",
            name: "test_name",
            avatar_image_url: "test_url",
          },
        },
      ]);

    // 期待するメッセージ
    const expected = "test message";

    // getMessage関数を呼び出して結果を検証する
    await expect(
      getMessage(cwKey, cwRoomId, filter, instance)
    ).resolves.toEqual(expected);
  });

  // 異常系のテスト
  test("不正なアクセスキーでリクエストした場合はエラーが発生する", async () => {
    // モックアダプターで異常なレスポンスを設定
    mock
      .onGet(`https://api.chatwork.com/v2/rooms/${cwRoomId}/messages`)
      .reply(401);

    // 関数がエラーを投げることを検証
    await expect(
      getMessage(cwKey, cwRoomId, filter, instance)
    ).rejects.toThrowError("レスポンスコードが200以外のものが返却されました");
  });
});
