import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { getGroups, CwRoom } from "../src/helpers/chatworkHelper";

// axiosのインスタンスを作成
const instance = axios.create();
// モックアダプターを作成
const mock = new MockAdapter(instance);

// チャットワークのアクセスキー
const cwKey = "test";

// ルーム一覧のサンプルデータ
const rooms: CwRoom[] = [
  {
    room_id: 123,
    name: "Group Chat Name",
    type: "group",
    role: "admin",
    sticky: false,
    unread_num: 10,
    mention_num: 1,
    mytask_num: 0,
    message_num: 122,
    file_num: 10,
    task_num: 17,
    icon_path: "https://example.com/ico_group.png",
    last_update_time: 1298905200,
  },
];

describe("getGroups", () => {
  // 正常系のテスト
  test("正しいアクセスキーでリクエストした場合はルーム一覧が返る", async () => {
    // モックアダプターで正常なレスポンスを設定
    mock.onGet("https://api.chatwork.com/v2/rooms").reply(200, rooms);

    // 関数を実行して結果を取得
    const result = await getGroups(cwKey);

    // 結果が期待通りかどうか検証
    expect(result).toEqual(rooms);
  });

  // 異常系のテスト
  test("不正なアクセスキーでリクエストした場合はエラーが発生する", async () => {
    // モックアダプターで異常なレスポンスを設定
    mock.onGet("https://api.chatwork.com/v2/rooms").reply(401);

    // 関数がエラーを投げることを検証
    await expect(getGroups(cwKey)).rejects.toThrow(
      `レスポンスコードが200以外のものが返却されました`
    );
  });
});
