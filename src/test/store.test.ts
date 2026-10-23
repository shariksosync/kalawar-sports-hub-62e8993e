import { beforeEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { seedAccounts, seedFollows, seedPosts } from "@/lib/data";
import { addComment, canViewPosts, follow, markNoticesRead, registerAccount, respondRequest, setState, unfollow, useStore } from "@/lib/store";

beforeEach(() => {
  act(() => { setState(() => ({ accounts: seedAccounts, posts: seedPosts, follows: seedFollows, notices: [], sessionId: null })); });
});

describe("Media privacy and actions", () => {
  it("hides private posts from guests and unrelated accounts but allows owner and accepted follower", () => {
    const { result } = renderHook(() => useStore((s) => s));
    expect(canViewPosts(result.current, "u-m2", null)).toBe(false);
    expect(canViewPosts(result.current, "u-m2", "u-m1")).toBe(false);
    expect(canViewPosts(result.current, "u-m2", "u-m2")).toBe(true);
    expect(canViewPosts(result.current, "u-m2", "u-m3")).toBe(true);
  });
  it("creates only one private request, accepts it, and marks notices read", () => {
    const { result } = renderHook(() => useStore((s) => s));
    act(() => { follow("u-m1", "u-m2"); follow("u-m1", "u-m2"); follow("u-m1", "u-m1"); });
    expect(result.current.follows.filter((f) => f.from === "u-m1" && f.to === "u-m2")).toEqual([{ from: "u-m1", to: "u-m2", status: "pending" }]);
    expect(result.current.notices).toHaveLength(1);
    expect(result.current.follows.some((f) => f.from === f.to)).toBe(false);
    act(() => { respondRequest("u-m2", "u-m1", true); markNoticesRead("u-m1"); });
    expect(canViewPosts(result.current, "u-m2", "u-m1")).toBe(true);
    expect(result.current.notices[0]?.read).toBe(true);
  });
  it("removes cancelled follow request notices", () => {
    const { result } = renderHook(() => useStore((s) => s));
    act(() => { follow("u-m1", "u-m2"); unfollow("u-m1", "u-m2"); });
    expect(result.current.notices).toHaveLength(0);
  });
  it("notifies a subscribed reader of a new comment", () => {
    const { result } = renderHook(() => useStore((s) => s));
    act(() => { addComment("p1", "u-m3", "Great session"); });
    expect(result.current.posts.find((p) => p.id === "p1")?.comments.at(-1)?.text).toBe("Great session");
    expect(result.current.notices.map((n) => n.to)).toEqual(["u-k1", "u-m1"]);
  });
  it("normalizes new emails and rejects duplicate usernames", () => {
    expect(registerAccount({ email: "another@test.in", handle: "aarav.fights", name: "New", password: "demo123", type: "media" })).toBe("This username is already taken.");
    const account = registerAccount({ email: " NEW@test.in ", handle: "new.creator", name: "New", password: "demo123", type: "media" });
    expect(typeof account === "string" ? account : account.email).toBe("new@test.in");
  });
});