import { getConfing, Config } from "../src/helpers/getConfig";

describe("getConfing", () => {
  // 環境変数を保存する変数
  let env: NodeJS.ProcessEnv;

  // テスト前に環境変数を保存し、テスト後に復元する
  beforeEach(() => {
    env = process.env;
  });
  afterEach(() => {
    process.env = env;
  });

  test("環境変数から設定情報オブジェクトを返す", () => {
    process.env.CW_KEY = "test_key";
    process.env.CW_READ_ROOMIDS_EXCLUDE_ME = "1,2,3";
    process.env.CW_ALWAYS_READ_ROOMIDS = "4,5,6";

    const expected: Config = {
      chatworkKey: "test_key",
      chatworkReadRoomIdsExcludeMe: ["1", "2", "3"],
      chatworkAlwaysReadRoomIds: ["4", "5", "6"],
    };

    expect(getConfing()).toEqual(expected);
  });

  test("環境変数「CW_KEY」が設定されていない場合はエラーを投げる", () => {
    process.env.CW_KEY = "";
    process.env.CW_READ_ROOMIDS_EXCLUDE_ME = "";
    process.env.CW_ALWAYS_READ_ROOMIDS = "";

    expect(getConfing).toThrowError("Chatwork Keyが設定されていません。");
  });

  test("環境変数「CW_READ_ROOMIDS_EXCLUDE_ME」が設定されていない場合はエラーを投げる", () => {
    process.env.CW_KEY = "test_key";
    process.env.CW_READ_ROOMIDS_EXCLUDE_ME = "";
    process.env.CW_ALWAYS_READ_ROOMIDS = "";

    expect(getConfing).toThrowError(
      "Chatworkの自身以外を既読にするルームID一覧が設定されていません。"
    );
  });

  test("環境変数「CW_ALWAYS_READ_ROOMIDS」が設定されていないなくてもエラーにはならない", () => {
    process.env.CW_KEY = "test_key";
    process.env.CW_READ_ROOMIDS_EXCLUDE_ME = "1,2,3";
    process.env.CW_ALWAYS_READ_ROOMIDS = "";

    const expected: Config = {
      chatworkKey: "test_key",
      chatworkReadRoomIdsExcludeMe: ["1", "2", "3"],
      chatworkAlwaysReadRoomIds: [""],
    };

    expect(getConfing()).toEqual(expected);
  });
});
