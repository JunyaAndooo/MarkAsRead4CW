/**
 * 環境変数から設定情報を取得する関数。
 * @param {void}
 * @returns {Config} 設定情報オブジェクト
 * @throws {Error} 環境変数が設定されていない場合
 */
export const getConfing = (): Config => {
  const chatworkKey = process.env.CW_KEY;
  if (!chatworkKey) {
    throw new Error("Chatwork Keyが設定されていません。");
  }
  const chatworkReadRoomIdsExcludeMe = process.env.CW_READ_ROOMIDS_EXCLUDE_ME;
  if (!chatworkReadRoomIdsExcludeMe) {
    throw new Error(
      "Chatworkの自身以外を既読にするルームID一覧が設定されていません。"
    );
  }
  const chatworkAlwaysReadRoomIds = process.env.CW_ALWAYS_READ_ROOMIDS ?? "";
  return {
    chatworkKey,
    chatworkReadRoomIdsExcludeMe: chatworkReadRoomIdsExcludeMe.split(","),
    chatworkAlwaysReadRoomIds: chatworkAlwaysReadRoomIds.split(","),
  };
};

/**
 * 設定情報オブジェクトの型。
 */
export type Config = Readonly<{
  /**
   * ChatWork APIキー
   */
  chatworkKey: string;

  /**
   * 自身以外を既読にするルームID一覧
   */
  chatworkReadRoomIdsExcludeMe: string[];

  /**
   * 常に既読にするルームID一覧
   */
  chatworkAlwaysReadRoomIds: string[];
}>;
