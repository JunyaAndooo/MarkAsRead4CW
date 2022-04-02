import dotenv from "dotenv";
import {
  CwMessage,
  getGroups,
  getMessage,
  readMessage,
} from "./helpers/chatworkHelper";

/*
 * 対象のルームを既読にします。
 *
 * 1. 既読にするグループを取得（コンフィグに記載）
 * 2. グループ一覧を取得
 *   - unread_numが0以上のもの
 *   - typeが"group"のもの
 * 3. 上記1.と2.の両方のもののメッセージを取得
 *   - 一番新しいメッセージ
 * 4. 上記3.で取得したメッセージを既読に変更
 */
(async () => {
  try {
    dotenv.config();

    const cwKey = process.env.CW_KEY ?? "";
    const targetRoomIds = (process.env.CW_TARGET_ROOMS ?? "").split(",");

    const unReadRoomIds =
      (await getGroups(cwKey))
        ?.filter((g) => g.unread_num > 0 && g.type === "group")
        .map((g) => g.room_id.toString()) ?? [];

    const unReadTargetRoomIds = [targetRoomIds, unReadRoomIds]
      .flat()
      .filter(
        (value, index, self) =>
          self.indexOf(value) === index && self.lastIndexOf(value) !== index
      );

    unReadTargetRoomIds.map(async (g) => {
      const lastMessage = await getMessage<CwMessage | null>(
        cwKey,
        g,
        (ms: CwMessage[]) => (ms.length > 0 ? ms[ms.length - 1] : null)
      );

      lastMessage && readMessage(cwKey, g, lastMessage.message_id);
    });
  } catch (error) {
    console.error(error);
  }
})();
