import axios, { Axios } from "axios";

/**
 * CwMessageオブジェクト。
 */
export type CwMessage = Readonly<{
  body: string;
  message_id: string;
  account: {
    account_id: string;
    name: string;
    avatar_image_url: string;
  };
}>;

/**
 * CwRoomオブジェクト。
 */
export type CwRoom = Readonly<{
  room_id: number;
  name: string;
  type: string;
  role: string;
  sticky: boolean;
  unread_num: number;
  mention_num: number;
  mytask_num: number;
  message_num: number;
  file_num: number;
  task_num: number;
  icon_path: string;
  last_update_time: number;
}>;

/**
 * グループ情報を取得します。
 * @param {string} cwKey チャットワークのアクセスキー
 * @param {axios.AxiosInstance} axiosInstance Axiosのインスタンス
 * @returns {CwRoom[]} チャットワークのルーム一覧
 */
export const getGroups = async (cwKey: string): Promise<CwRoom[]> => {
  const res = await axios
    .get(`https://api.chatwork.com/v2/rooms`, {
      headers: {
        "X-ChatWorkToken": cwKey,
      },
    })
    .catch((err) => {
      console.log(JSON.stringify(err));
      return err.response;
    });
  if (res.status !== 200) {
    throw new Error(
      `レスポンスコードが200以外のものが返却されました:${JSON.stringify(res)}`
    );
  }
  return res.data;
};

/**
 * メッセージを取得します。
 * @typeParam T メッセージの型
 * @param {string} cwKey チャットワークのアクセスキー
 * @param {string} cwRoomId チャットワークの部屋ID
 * @returns {T} メッセージ
 */
export const getMessage = async <T>(
  cwKey: string,
  cwRoomId: string,
  filter: (data: CwMessage[]) => T
): Promise<T> => {
  const res = await axios
    .get(`https://api.chatwork.com/v2/rooms/${cwRoomId}/messages`, {
      headers: {
        "X-ChatWorkToken": cwKey,
      },
      params: {
        force: 1,
      },
    })
    .catch((err) => {
      return err.response;
    });
  if (res.status !== 200) {
    throw new Error(
      `レスポンスコードが200以外のものが返却されました:${JSON.stringify(res)}`
    );
  }
  return filter(res.data);
};

/**
 * 既読にします。
 * @param {string} cwKey チャットワークのアクセスキー
 * @param {string} cwRoomId チャットワークの部屋ID
 * @returns {void}
 */
export const readMessage = async (
  cwKey: string,
  cwRoomId: string,
  messageId: string
): Promise<void> => {
  const res = await axios
    .put(
      `https://api.chatwork.com/v2/rooms/${cwRoomId}/messages/read`,
      {
        message_id: messageId,
      },
      {
        headers: {
          "X-ChatWorkToken": cwKey,
        },
      }
    )
    .catch((err) => {
      return err.response;
    });
};
