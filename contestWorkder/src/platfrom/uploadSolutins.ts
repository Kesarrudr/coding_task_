import { PlatFromEnum } from "@prisma/client";
import {
  checkFutureEvent,
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
  const pastContests = repos.filter(
    (contest) => !checkFutureEvent(contest.StartTime),
  );

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

  const titleArray = playList
    .filter(
      (iteam): iteam is { snippet: { title: string } } =>
        !!iteam.snippet?.title,
    )
    .flatMap((itema) => itema.snippet.title.split("|")[0].trim());

  const uploadData = pastContests.flatMap((contest) => {
    const resp = findSolution(
      contest.PlatFrom === PlatFromEnum.CodeForces
        ? contest.contestName
        : `${contest.PlatFrom + " " + contest.contestName}`,
      titleArray,
    );

    if (resp.bestMatch.rating <= 0.6) {
      return [];
    }

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
