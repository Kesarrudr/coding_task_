import { PlatFromEnum } from "@prisma/client";
import {
  checkEvent,
  findSolution,
  getplaylistVideos,
} from "../utilis/helperfuntions";
import { getContestsData, uploadDataQuery } from "../utilis/query";
import { youtube_v3 } from "googleapis";

const uploadSolutions = async (
  platfrom: PlatFromEnum,
  playListCode: string,
) => {
  const repos = await getContestsData(platfrom);
  if (!repos) return;
  const pastContests = repos.flatMap((contest) => {
    const check = checkEvent(contest.StartTime);
    return check ? [contest] : [];
  });

  let playList: youtube_v3.Schema$PlaylistItem[] = [];
  let nextToken;
  do {
    const response = await getplaylistVideos(playListCode, nextToken);

    if (response) {
      const { nextPageToken, items } = response;
      if (items) {
        playList = [...playList, ...items];
      }
      nextToken = nextPageToken;
    }
  } while (nextToken);

  const titleArray = playList.map((itema) => itema.snippet?.title);

  const uploadData = pastContests.flatMap((contest) => {
    const resp = findSolution(
      `${contest.PlatFrom + " " + contest.contestName}`,
      titleArray,
    );
    const bestMatchSolution = playList[resp.bestMatchIndex];
    const url = `https://www.youtube.com/watch?v=${bestMatchSolution.snippet?.resourceId?.videoId}`;

    return {
      contestId: contest.id,
      url: url,
    };
  });

  const count = await uploadDataQuery(uploadData);
  console.log(`inseted ${JSON.stringify(count)} solution of ${platfrom}`);
};

export { uploadSolutions };
