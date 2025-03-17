interface CodeForcesContestData {
  id: number;
  name: string;
  type: CodeForcesTypeEnum;
  phase: CodeForcephaseEnum;
  forzen: boolean;
  durationSeconds: number;
  freezeDurationSeconds?: number;
  startTimeSeconds?: number;
  relativeTimeSeconds?: number;
  preparedBy?: string;
  websiteUrl?: string;
  description?: string;
  difficulty?: number;
  kind?: string;
  icpcRegion?: string;
  country?: string;
  city?: string;
  season?: string;
}

enum CodeForcesTypeEnum {
  CF = "CF",
  IOI = "IOI",
  ICPC = "ICPC",
}

enum CodeForcephaseEnum {
  BEFORE = "BEFORE",
  CODING = "CODING",
  PENDING_SYSTEM_TEST = "PENDING_SYSTEM_TEST",
  SYSTEM_TEST = "SYSTEM_TEST",
  FINISHED = "FINISHED",
}

interface CodeForcesResponseOK<T> {
  status: "OK";
  result: T;
}

interface CodeForcesResponseFailed {
  status: "FAILED";
  comment: string;
}

type CodeForcesResponse<T> = CodeForcesResponseOK<T> | CodeForcesResponseFailed;

enum CodeChefEvent {
  PAST = "past",
  FUTURE = "future",
}
interface CodeChefContestData {
  contest_code: string;
  contest_name: string;
  contest_start_date: string;
  contest_end_date: string;
  contest_start_date_iso: Date;
  contest_end_date_iso: Date;
  contest_duration: string;
  distinct_users: number;
}

type CodeChefResponse = {
  status: string;
  message: string;
  contests: CodeChefContestData[];
};

enum LeetCodequeryEnum {
  past = `query pastContests($pageNo: Int, $numPerPage: Int) {
  pastContests(pageNo: $pageNo, numPerPage: $numPerPage) {
    data {
      title
      titleSlug
      startTime
    }
  }
}`,
  fetatured = `query {
  featuredContests {
    title
    titleSlug
    startTime
  }
}`,
  upcoming = `query {
  upcomingContests {
    title
    titleSlug
    startTime
  }
}`,
}

interface LeetCodeUpcomingResponseData {
  data: LeetCodeUpcomingContestData;
}

interface LeetCodeUpcomingContestData {
  upcomingContests: UpcomingContest[];
}

interface UpcomingContest {
  title: string;
  titleSlug: string;
  startTime: number;
}

interface LeetCodeFeaturedResponseData {
  data: LeetCodeFeaturedContestData;
}

interface LeetCodeFeaturedContestData {
  featuredContests: FeaturedContest[];
}

interface FeaturedContest {
  title: string;
  titleSlug: string;
  startTime: number;
}

export interface LeetCodePastContestResponseData {
  data: LeetCodePastContestsData;
}

export interface LeetCodePastContestsData {
  pastContests: PastContests;
}

export interface PastContests {
  pageNum: number;
  currentPage: number;
  numPerPage: number;
  data: LeetCodePastContest[];
}

export interface LeetCodePastContest {
  title: string;
  titleSlug: string;
  startTime: number;
}

export {
  LeetCodeFeaturedContestData,
  LeetCodeFeaturedResponseData,
  FeaturedContest,
  LeetCodeUpcomingResponseData,
  UpcomingContest,
  LeetCodeUpcomingContestData,
  LeetCodequeryEnum,
  CodeChefContestData,
  CodeChefResponse,
  CodeChefEvent,
  CodeForcesContestData,
  CodeForcephaseEnum,
  CodeForcesTypeEnum,
  CodeForcesResponse,
  CodeForcesResponseOK,
  CodeForcesResponseFailed,
};
