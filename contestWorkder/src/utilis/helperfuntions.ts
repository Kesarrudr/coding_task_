import { youtube_v3 } from "@googleapis/youtube";
import { google } from "googleapis";
import { BestMatch, findBestMatch } from "string-similarity";
import { noSoutionsContests, uploadDataQuery } from "./query";
import { PlatFromEnum } from "@prisma/client";

const checkEvent = (timeStamp: number) => {
  const date = new Date(timeStamp * 1000);
  const now = new Date();

  if (date > now) {
    return false;
  } else {
    return true;
  }
};

const youtube: youtube_v3.Youtube = google.youtube({
  version: "v3",
  auth: "AIzaSyABk9J3s9_7bWUziL0DH08SPwsAqYeVvNs",
});

async function getplaylistVideos(playlistId: string, nextPageToken?: string) {
  const res = await youtube.playlistItems.list({
    part: ["snippet"],
    playlistId: playlistId,
    fields:
      "nextPageToken,prevPageToken,items(etag,snippet(title,resourceId(videoId)))",
    maxResults: 50,
    pageToken: nextPageToken,
  });

  if (res.status === 200) {
    return res.data;
  }
}

function findSolution(contestName: string, matchTilesArray: string[]) {
  const resp: BestMatch = findBestMatch(contestName, matchTilesArray);
  return resp;
}

async function getChannelId(channelHandle: string) {
  const response = await youtube.channels.list({
    part: ["id"],
    forHandle: channelHandle,
  });

  const channelId = response.data.items?.[0]?.id;

  if (!channelId) {
    console.error("Invalid YouTube handle");
    return;
  }

  return channelId;
}

function checkFutureEvent(timeStamp: number) {
  return timeStamp > Math.floor(Date.now() / 1000);
}

async function getChannelVideos(channelId: string) {
  const res = await youtube.search.list({
    part: ["snippet"],
    channelId: channelId,
    //TODO: change this 10
    maxResults: 50,
    order: "date",
    fields: "items(id(videoId),etag,snippet(title,publishedAt))",
  });

  if (res.status === 200) {
    return res.data;
  }
  return {};
}

function isWithinLastTwoMinutes(timestamp?: string | null): boolean {
  if (!timestamp || timestamp === null) return false;
  const givenTime = new Date(timestamp).getTime();
  //TODO: change this to two minute
  //WARNING: currently query all the last one months videos
  const thirtyDays = Date.now() - 30 * 24 * 60 * 60 * 1000;

  return givenTime >= thirtyDays;
}

async function updateLatedSolution(channelId: string) {
  console.log(
    `🕒 [${new Date().toISOString()}] Checking for latest uploads...`,
  );

  const latedUploads = await getChannelVideos(channelId);
  if (!latedUploads || !latedUploads.items) {
    console.warn("⚠️ No uploads found or API returned an empty response.");
    return;
  }

  const intersetUpload = latedUploads.items.flatMap((item) => {
    const isRecent = isWithinLastTwoMinutes(item.snippet?.publishedAt);
    return isRecent ? item : [];
  });

  if (!intersetUpload.length) {
    console.log("✅ No new videos uploaded in the last two minutes.");
    return;
  }

  console.log(
    `🎥 Found ${intersetUpload.length} new videos. Fetching contests...`,
  );

  const contestData = await noSoutionsContests();

  if (!contestData || contestData.length === 0) {
    console.log("✅ All contests already have at least one solution.");
    return;
  }

  const pastcontests = contestData.filter(
    (contest) => !checkFutureEvent(contest.StartTime),
  );

  if (!pastcontests.length) {
    console.log(`✅ All pasts contests have the solutions`);
    return;
  }

  const contestNameArray = pastcontests.map((contest) =>
    contest.PlatFrom === PlatFromEnum.CodeForces
      ? `${contest.contestName}`
      : `${contest.PlatFrom + " " + contest.contestName}`,
  );

  const uploadData = intersetUpload.flatMap((upload) => {
    if (upload.snippet?.title) {
      const bestMatch: BestMatch = findSolution(
        upload.snippet.title.split("|")[0].trim(),
        contestNameArray,
      );

      if (bestMatch.bestMatch.rating <= 0.6) {
        return [];
      }

      const url = `https://www.youtube.com/watch?v=${upload.id?.videoId}`;

      console.log(
        `🔍 Matched "${upload.snippet.title}" to "${contestNameArray[bestMatch.bestMatchIndex]}" having contest id ${pastcontests[bestMatch.bestMatchIndex].id}`,
      );

      if (contestNameArray.length - 1 > bestMatch.bestMatchIndex) {
        contestNameArray.splice(bestMatch.bestMatchIndex, 1);
      }

      return [{ url, contestIndex: bestMatch.bestMatchIndex }];
    }
    return [];
  });

  if (uploadData.length === 0) {
    console.warn("⚠️ No valid matches found for the uploaded videos.");
    return;
  }

  const queryData = uploadData.map((data) => ({
    contestId: pastcontests[data.contestIndex].id,
    url: data.url,
  }));

  console.log(`📤 Uploading ${queryData.length} solutions to the database...`);

  const count = await uploadDataQuery(queryData);
  console.log(`✅ Successfully uploaded ${count?.count} new solutions.`);
}

const repeatUpdate = async (channelId: string) => {
  await updateLatedSolution(channelId);
  setTimeout(() => repeatUpdate(channelId), 2 * 60 * 1000);
};

export {
  repeatUpdate,
  updateLatedSolution,
  checkEvent,
  getChannelVideos,
  findSolution,
  getplaylistVideos,
  getChannelId,
  checkFutureEvent,
};
