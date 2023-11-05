"use client";
import { trpc } from "../_trpc/client";

export function Hello() {
  const helloQuery = trpc.hello.useQuery();
  return <h1>{helloQuery.data ? helloQuery.data : "Loading..."}</h1>;
}
