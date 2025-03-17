import axios, { AxiosResponse } from "axios";
import {
  FeaturedContest,
  LeetCodeFeaturedResponseData,
  LeetCodePastContest,
  LeetCodePastContestResponseData,
  LeetCodequeryEnum,
  LeetCodeUpcomingResponseData,
  UpcomingContest,
} from "../types/types";
import { PlatFromEnum } from "@prisma/client";

async function fetchData<T>(query: LeetCodequeryEnum, variables = {}) {
  try {
    const response = await axios.post<any, AxiosResponse<T>>(
      "https://leetcode.com/graphql/",
      JSON.stringify({ query, variables }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching data:");
    return null;
  }
}

const handleResponse = async () => {
  const response = await fetchData<LeetCodeUpcomingResponseData>(
    LeetCodequeryEnum.upcoming,
  );
  const contestData = response?.data.upcomingContests.map(
    (contest: UpcomingContest) => {
      return {
        querySlug: contest.titleSlug,
        contestName: contest.title,
        StartTime: contest.startTime,
        PlatFrom: PlatFromEnum.LeetCode,
      };
    },
  );
  return contestData;
};

const handleFeturedResponse = async () => {
  const response = await fetchData<LeetCodeFeaturedResponseData>(
    LeetCodequeryEnum.fetatured,
  );
  const contestData = response?.data.featuredContests.map(
    (contest: FeaturedContest) => {
      return {
        querySlug: contest.titleSlug,
        contestName: contest.title,
        StartTime: contest.startTime,
        PlatFrom: PlatFromEnum.LeetCode,
      };
    },
  );
  return contestData;
};

const handlePastResponse = async (pagno: number) => {
  const response = await fetchData<LeetCodePastContestResponseData>(
    LeetCodequeryEnum.past,
    { pageNo: pagno },
  );

  if (response?.data && response?.data.pastContests.data.length <= 0) return;
  if (response?.data.pastContests.data) {
    const contestData = response?.data.pastContests.data.map(
      (contest: LeetCodePastContest) => {
        return {
          querySlug: contest.titleSlug,
          contestName: contest.title,
          StartTime: contest.startTime,
          PlatFrom: PlatFromEnum.LeetCode,
        };
      },
    );
    return contestData;
  }
};

export {
  handleResponse as LeetCodeFunctionUpcomingContest,
  handleFeturedResponse as LeetCodeFeaturedContest,
  handlePastResponse as LeetCodeFunctionPastContests,
};
