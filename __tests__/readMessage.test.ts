import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { readMessage } from "../src/helpers/chatworkHelper";

// axiosのインスタンスを作成
const instance = axios.create();
// モックアダプターを作成
const mock = new MockAdapter(instance);

// テスト用の環境変数
const cwKey = "test_key";
const cwRoomId = "test_room";
const messageId = "test_messageId";

describe("readMessage", () => {
  test("既読に変更できた場合は正常で返る", async () => {
    mock
      .onPut(`https://api.chatwork.com/v2/rooms/${cwRoomId}/messages/read`)
      .reply(200, [
        {
          message_id: "messageId",
        },
      ]);

    expect(readMessage(cwKey, cwRoomId, messageId, instance)).resolves
      .toBeUndefined;
  });

  test("レスポンスエラーとなってもErrorは発生しない", async () => {
    mock
      .onPut(`https://api.chatwork.com/v2/rooms/${cwRoomId}/messages/read`)
      .reply(401, [
        {
          message_id: "messageId",
        },
      ]);

    expect(readMessage(cwKey, cwRoomId, messageId, instance)).resolves
      .toBeUndefined;
  });
});
