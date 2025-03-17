import axios, { AxiosResponse } from "axios";
import { CodeForcesContestData, CodeForcesResponse } from "../types/types";
import { PlatFromEnum } from "@prisma/client";

let config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://codeforces.com/api/contest.list",
  headers: {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.7",
    "Cache-Control": "max-age=0",
    Connection: "keep-alive",
    "If-None-Match": 'W/"43-3/CUv16Zj3GU/1iWMv5R1h8rEjw"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Sec-GPC": "1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
  },
};

async function fetchContest() {
  try {
    const response = await axios.request<
      any,
      AxiosResponse<CodeForcesResponse<CodeForcesContestData[]>>
    >(config);
    if (response.status === 200) {
      const data = response.data;
      if (data.status === "OK") {
        return data.result;
      }
    }
  } catch (error) {
    console.log("can't get the contests");
  }
}

const handleContestResponse = async () => {
  const response = await fetchContest();
  const contestData = response?.map((contest: CodeForcesContestData) => {
    return {
      querySlug: contest.id.toString(),
      contestName: contest.name.toString(),
      StartTime: contest.startTimeSeconds!,
      PlatFrom: PlatFromEnum.CodeForces,
    };
  });

  return contestData;
};

export { handleContestResponse as CodeForcesFunction };
