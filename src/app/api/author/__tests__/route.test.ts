
import { describe, it, expect } from "vitest";
import { GET } from "../route";
import { authorData } from "../authorData";

describe("Author API", () => {
  it("should return the correct author data", async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual(authorData);
  });
});
