import assert from "assert";
import { Logger } from "totoms";
import { extractTokenFromHeader } from "../../src/util/TokenExtract";

describe("extractTokenFromHeader", () => {

    before(() => Logger.init("toto-ms-auth"));

    it("extracts the token from a lowercase authorization header", () => {

        assert.strictEqual(extractTokenFromHeader({ authorization: "Bearer abc.def.ghi" }, "cid"), "abc.def.ghi");
    });

    it("extracts the token from a capitalized Authorization header", () => {

        assert.strictEqual(extractTokenFromHeader({ Authorization: "Bearer abc.def.ghi" }, "cid"), "abc.def.ghi");
    });

    it("returns null when there is no authorization header", () => {

        assert.strictEqual(extractTokenFromHeader({}, "cid"), null);
    });

    it("returns null when the header is not a Bearer header", () => {

        assert.strictEqual(extractTokenFromHeader({ authorization: "Basic dXNlcjpwd2Q=" }, "cid"), null);
    });
});
