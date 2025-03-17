import { PlatFromEnum, PrismaClient } from "@prisma/client";
import {
  LeetCodeFeaturedContest,
  LeetCodeFunctionPastContests,
  LeetCodeFunctionUpcomingContest,
} from "./platfrom/leetcode";
import { CodeChefEvent } from "./types/types";
import { CodeChefFunction } from "./platfrom/codeChef";
import { CodeForcesFunction } from "./platfrom/codeforce";
import { uploadSolutions } from "./platfrom/uploadSolutins";

async function main() {
  // const prisma = new PrismaClient();
  //
  // const codeForcesContests = await CodeForcesFunction();
  // if (codeForcesContests) {
  //   try {
  //     const result = await prisma.contest.createMany({
  //       data: codeForcesContests,
  //       skipDuplicates: true, // Prevent duplicate insertions
  //     });
  //     console.log(`Inserted ${result.count} contests of codeforce`);
  //   } catch (error) {
  //     console.error("Error inserting contests:", error);
  //   }
  // }
  //
  // const codeChefUpcomingContests = await CodeChefFunction(
  //   CodeChefEvent.FUTURE,
  //   0,
  // );
  // if (codeChefUpcomingContests) {
  //   try {
  //     const result = await prisma.contest.createMany({
  //       data: codeChefUpcomingContests,
  //       skipDuplicates: true, // Prevent duplicate insertions
  //     });
  //     console.log(`Inserted ${result.count} future contests of codeChef`);
  //   } catch (error) {
  //     console.error("Error inserting contests:", error);
  //   }
  // }
  //
  // let check = true;
  // let num1 = 0;
  //
  // while (check) {
  //   let offset = num1 * 20;
  //
  //   try {
  //     const contestData = await CodeChefFunction(CodeChefEvent.PAST, offset);
  //
  //     if (!contestData || contestData.length === 0) {
  //       check = false;
  //       break;
  //     }
  //
  //     const result = await prisma.contest.createMany({
  //       data: contestData,
  //       skipDuplicates: true,
  //     });
  //
  //     console.log(`Inserted ${result.count} past contests of CodeChef`);
  //
  //     num1++;
  //   } catch (error) {
  //     console.error("Error inserting contests:", error);
  //     check = false;
  //   }
  // }
  //
  // const leetCodeUpcomingContests = await LeetCodeFunctionUpcomingContest();
  // if (leetCodeUpcomingContests) {
  //   try {
  //     const result = await prisma.contest.createMany({
  //       data: leetCodeUpcomingContests,
  //       skipDuplicates: true,
  //     });
  //
  //     console.log(`inserted ${result.count} upcoming contest on leetcode`);
  //   } catch (error) {
  //     console.log("Error while Saving  ");
  //   }
  // }
  //
  // const leetcodeFeaturedContestData = await LeetCodeFeaturedContest();
  // if (leetcodeFeaturedContestData) {
  //   try {
  //     const result = await prisma.contest.createMany({
  //       data: leetcodeFeaturedContestData,
  //       skipDuplicates: true,
  //     });
  //
  //     console.log(`inserted ${result.count} featured contest on leetcode`);
  //   } catch (error) {
  //     console.log("Error while Saving  ");
  //   }
  // }
  //
  // check = true;
  // let pageNo = 1;
  //
  // while (check) {
  //   try {
  //     const contestData = await LeetCodeFunctionPastContests(pageNo);
  //
  //     if (!contestData || contestData.length === 0) {
  //       check = false;
  //       break;
  //     }
  //
  //     const result = await prisma.contest.createMany({
  //       data: contestData,
  //       skipDuplicates: true,
  //     });
  //
  //     console.log(`Inserted ${result.count} past contests of LeetCode`);
  //     pageNo++;
  //   } catch (error) {
  //     console.error("Error inserting contests:", error);
  //     check = false;
  //   }
  // }
  //
  // await prisma.$disconnect();

  const solutions: {
    platfrom: PlatFromEnum;
    playlistcode: string;
  }[] = [
    {
      platfrom: PlatFromEnum.CodeForces,
      playlistcode: "PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB",
    },
    {
      platfrom: PlatFromEnum.LeetCode,
      playlistcode: "PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr",
    },
    {
      platfrom: PlatFromEnum.CodeChef,
      playlistcode: "PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr",
    },
  ];

  for (const data of solutions) {
    await uploadSolutions(data.platfrom, data.playlistcode);
  }
}

main();
