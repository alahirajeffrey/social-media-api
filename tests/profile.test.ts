import supertest from "supertest";
import server from "../src/server";
import * as clearTable from "../src/utils/clearDb.utils";

describe("Profile Routes", () => {
  beforeAll(clearTable.clearProfileTable);
  beforeAll(clearTable.clearUserTable);
});
