import { getMatchingRoomIds } from "../src/helpers/getMatchingRoomIds";

describe("getMatchingRoomIds", () => {
  test("両方の配列が空の場合は空の配列を返す", () => {
    const unreadRoomIds: string[] = [];
    const targetRoomIds: string[] = [];
    const result = getMatchingRoomIds(unreadRoomIds, targetRoomIds);
    expect(result).toEqual([]);
  });

  test("共通のルームIDがない場合は空の配列を返す", () => {
    const unreadRoomIds: string[] = ["a", "b", "c"];
    const targetRoomIds: string[] = ["d", "e", "f"];
    const result = getMatchingRoomIds(unreadRoomIds, targetRoomIds);
    expect(result).toEqual([]);
  });

  test("重複を除いた共通のルームIDの配列を返す", () => {
    const unreadRoomIds: string[] = ["a", "b", "c", "a"];
    const targetRoomIds: string[] = ["b", "c", "d", "c"];
    const result = getMatchingRoomIds(unreadRoomIds, targetRoomIds);
    expect(result).toEqual(["b", "c"]);
  });
});
