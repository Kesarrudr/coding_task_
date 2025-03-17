import { youtube_v3 } from "@googleapis/youtube";
import { google } from "googleapis";
import { BestMatch, findBestMatch } from "string-similarity";
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

async function getChannelVideos(playlistId: string, nextPageToken?: string) {
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

function findSolution(contestName: string, matchTilesArray: any[]) {
  const resp: BestMatch = findBestMatch(contestName, matchTilesArray);

  return resp;
}

export { checkEvent, getChannelVideos, findSolution };
