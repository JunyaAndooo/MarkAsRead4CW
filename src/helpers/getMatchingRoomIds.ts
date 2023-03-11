/**
 * 未読と対象の部屋IDから共通する部屋IDだけを返す関数。
 * @param unreadRoomIds string[] 未読の部屋IDの配列
 * @param targetRoomIds string[] 対象の部屋IDの配列
 * @return string[] 共通する部屋IDだけが含まれる配列
 */
export const getMatchingRoomIds = (
  unreadRoomIds: string[],
  targetRoomIds: string[]
) => {
  const uniqueUnreadRoomIds = new Set(unreadRoomIds);
  const uniqueTargetRoomIds = new Set(targetRoomIds);

  const commonRoomIds = [...uniqueUnreadRoomIds].filter((id) =>
    uniqueTargetRoomIds.has(id)
  );

  return commonRoomIds;
};
