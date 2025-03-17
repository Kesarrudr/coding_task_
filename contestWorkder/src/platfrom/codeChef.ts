import axios, { AxiosResponse } from "axios";
import { CodeChefEvent, CodeChefResponse } from "../types/types";
import { PlatFromEnum } from "@prisma/client";

const fetchCodeChefContest = async (event: CodeChefEvent, offset: number) => {
  try {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://www.codechef.com/api/list/contests/${event}?sort_by=START&sorting_order=asc&offset=${offset}&mode=all`,
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.8",
        priority: "u=1, i",
        referer: "https://www.codechef.com/contests",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
      },
    };

    const response = await axios.request<any, AxiosResponse<CodeChefResponse>>(
      config,
    );
    if (response.status === 200) {
      if (response.data.status === "success") {
        return response.data.contests;
      }
    }
  } catch (error) {
    console.error("Error fetching CodeChef contests:", error);
  }
};

const handleCodeChefResponse = async (event: CodeChefEvent, offset: number) => {
  const response = await fetchCodeChefContest(event, offset);
  if (response?.length === 0) return;
  const contestData = response?.map((contest) => {
    return {
      querySlug: contest.contest_code,
      contestName: contest.contest_name,
      StartTime: Math.floor(
        new Date(contest.contest_start_date_iso).getTime() / 1000,
      ),
      PlatFrom: PlatFromEnum.CodeChef,
    };
  });
  return contestData;
};

export { handleCodeChefResponse as CodeChefFunction };
