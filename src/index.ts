import dotenv from "dotenv";
import {
  CwMessage,
  getGroups,
  getMessage,
  readMessage,
} from "./helpers/chatworkHelper";
import { getConfing } from "./helpers/getConfig";
import { getMatchingRoomIds } from "./helpers/getMatchingRoomIds";

/*
 * 対象のルームを既読にします。
 *
 * 1. 既読にするグループを取得（コンフィグに記載）。下記処理を追加
 *   - 自分宛てのものは既読にしないリスト
 *   - 絶対に既読にするリスト
 * 2. グループ一覧を取得
 *   - unread_numが0以上のもの
 *   - typeが"group"のもの
 * 3. 上記1.と2.の両方のもののメッセージを取得
 *   - 一番新しいメッセージ
 * 4. 上記3.で取得したメッセージを既読に変更
 */
(async () => {
  dotenv.config();
  try {
    const config = getConfing();

    const unreadRooms = (await getGroups(config.chatworkKey))?.filter(
      (g) => g.unread_num > 0
    );

    const targetRoomIdsExcludeMe = getMatchingRoomIds(
      unreadRooms
        ?.filter((g) => g.mention_num === 0)
        .map((g) => g.room_id.toString()) ?? [],
      config.chatworkReadRoomIdsExcludeMe
    );

    const targetAlwaysUnreadRoomIds = getMatchingRoomIds(
      unreadRooms?.map((g) => g.room_id.toString()) ?? [],
      config.chatworkAlwaysReadRoomIds
    );

    const unReadTargetRoomIds = [
      targetRoomIdsExcludeMe,
      targetAlwaysUnreadRoomIds,
    ].flat();

    await Promise.all(
      unReadTargetRoomIds.map(async (g) => {
        const lastMessage = await getMessage<CwMessage | null>(
          config.chatworkKey,
          g,
          (ms: CwMessage[]) => (ms.length > 0 ? ms[ms.length - 1] : null)
        );

        lastMessage &&
          readMessage(config.chatworkKey, g, lastMessage.message_id);
      })
    );
  } catch (error) {
    const err = error as Error;
    console.error("name:", err.name);
    console.error("message:", err.message);
    console.error("stack:", err.stack);
  }
})();
