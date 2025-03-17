"use client";

import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookMarkHook } from "@/hooks/addBookmark";
import { useContesthook } from "@/hooks/contest";
import { PlatFormEnum } from "@/types/types";
import { ContestDataType } from "backend/utilis";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookmarkIcon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Loader2,
  Search,
  Video,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Types

export default function DashboardPage() {
  const router = useRouter();
  const { isLoading, getContest } = useContesthook();
  const { setBookmark } = useBookMarkHook();
  const [contests, setContests] = useState<ContestDataType[]>([]);
  const [filteredContests, setFilteredContests] = useState<ContestDataType[]>(
    [],
  );
  const [pageNo, setPageNo] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [bookmarkingId, setBookmarkingId] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  // Fetch initial contests
  useEffect(() => {
    const fetchContests = async () => {
      setInitialLoading(true);
      const response = await getContest(pageNo);
      if (response) {
        // Sort contests: upcoming first, then past
        const now = Math.floor(Date.now() / 1000);
        const sortedContests = [...response].sort((a, b) => {
          const aIsUpcoming = a.StartTime > now;
          const bIsUpcoming = b.StartTime > now;

          if (aIsUpcoming && !bIsUpcoming) return -1;
          if (!aIsUpcoming && bIsUpcoming) return 1;

          // If both are upcoming or both are past, sort by start time
          return a.StartTime - b.StartTime;
        });

        setContests(sortedContests);
        setFilteredContests(sortedContests);
      }
      setInitialLoading(false);
    };

    fetchContests();
  }, []);

  useEffect(() => {
    let result = [...contests];

    if (searchTerm) {
      result = result.filter((contest) =>
        contest.contestName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (platformFilter !== "all") {
      result = result.filter((contest) => contest.PlatFrom === platformFilter);
    }

    const now = Math.floor(Date.now() / 1000);
    if (timeFilter === "upcoming") {
      result = result.filter((contest) => contest.StartTime > now);
    } else if (timeFilter === "live") {
      result = result.filter(
        (contest) => contest.StartTime <= now && contest.StartTime + 7200 > now,
      ); // Assuming contests last 2 hours
    } else if (timeFilter === "past") {
      result = result.filter((contest) => contest.StartTime + 7200 <= now);
    }

    if (showBookmarkedOnly) {
      result = result.filter((contest) => contest.isBookmarked);
    }

    const sortedResult = [...result].sort((a, b) => {
      const aIsUpcoming = a.StartTime > now;
      const bIsUpcoming = b.StartTime > now;

      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;

      if (aIsUpcoming && bIsUpcoming) {
        return a.StartTime - b.StartTime; // Ascending for upcoming
      } else {
        return b.StartTime - a.StartTime; // Descending for past
      }
    });

    setFilteredContests(sortedResult);
  }, [contests, searchTerm, platformFilter, timeFilter, showBookmarkedOnly]);

  const handlePageChange = async (newPage: number) => {
    if (contests.length <= 0) return;

    setLoading(true);
    const response = await getContest(newPage);

    if (response) {
      const now = Math.floor(Date.now() / 1000);
      const sortedContests = [...response].sort((a, b) => {
        const aIsUpcoming = a.StartTime > now;
        const bIsUpcoming = b.StartTime > now;

        if (aIsUpcoming && !bIsUpcoming) return -1;
        if (!aIsUpcoming && bIsUpcoming) return 1;

        return a.StartTime - b.StartTime;
      });

      setPageNo(newPage);
      setContests(sortedContests);
    }

    setLoading(false);
    window.scroll(0, 0);
  };

  const handleToggleBookmark = async (
    contestId: string,
    isCurrentlyBookmarked: boolean,
  ) => {
    setBookmarkingId(contestId);
    const response = await setBookmark(contestId);
    if (response) {
      // Update local state
      setContests((prev) =>
        prev.map((contest) =>
          contest.id === contestId
            ? { ...contest, isBookmarked: !isCurrentlyBookmarked }
            : contest,
        ),
      );
    }
    setBookmarkingId(null);
  };

  const formatISTTime = (unixTime: number) => {
    return new Date(unixTime * 1000).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCountdown = (startTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = startTime - now;

    if (diff <= 0) {
      // Check if contest is live (assuming 2 hour duration)
      if (diff > -7200) {
        return "LIVE NOW";
      }
      return "Ended";
    }

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;

    return `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m ${seconds}s`;
  };

  const getPlatformUrl = (platform: PlatFormEnum, slug: string) => {
    switch (platform) {
      case PlatFormEnum.CodeForces:
        return `https://codeforces.com/contest/${slug}`;
      case PlatFormEnum.LeetCode:
        return `https://leetcode.com/contest/${slug}`;
      case PlatFormEnum.CodeChef:
        return `https://www.codechef.com/contests/${slug}`;
      default:
        return "#";
    }
  };

  const getPlatformColor = (platform: PlatFormEnum) => {
    switch (platform) {
      case PlatFormEnum.CodeForces:
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case PlatFormEnum.LeetCode:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case PlatFormEnum.CodeChef:
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setFilteredContests((prev) => [...prev]); // Force re-render to update countdown
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 pt-20">
        <div className="container mx-auto max-w-6xl py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Coding Contests</h1>
              <p className="text-muted-foreground">
                Track upcoming contests from various platforms
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search contests..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="relative"
              >
                <Filter className="h-4 w-4" />
                {(platformFilter !== "all" ||
                  timeFilter !== "all" ||
                  showBookmarkedOnly) && (
                  <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-primary" />
                )}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 rounded-lg border bg-card p-4 shadow-sm"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Platform
                    </label>
                    <Select
                      value={platformFilter}
                      onValueChange={setPlatformFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Platforms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value={PlatFormEnum.CodeForces}>
                          CodeForces
                        </SelectItem>
                        <SelectItem value={PlatFormEnum.LeetCode}>
                          LeetCode
                        </SelectItem>
                        <SelectItem value={PlatFormEnum.CodeChef}>
                          CodeChef
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Time
                    </label>
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="live">Live Now</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant={showBookmarkedOnly ? "default" : "outline"}
                      className="w-full gap-2"
                      onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                    >
                      <BookmarkIcon className="h-4 w-4" />
                      {showBookmarkedOnly
                        ? "Showing Bookmarked"
                        : "Show Bookmarked Only"}
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPlatformFilter("all");
                      setTimeFilter("all");
                      setShowBookmarkedOnly(false);
                    }}
                    className="text-xs"
                  >
                    Reset Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {initialLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="h-full overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="mt-2 h-6 w-full" />
                    <Skeleton className="mt-1 h-6 w-3/4" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-2/3" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="mt-2 h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Contest Grid */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={pageNo}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                >
                  {filteredContests.map((contest, index) => (
                    <motion.div
                      key={contest.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: (index % 3) * 0.1 }}
                    >
                      <Card className="h-full overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <Badge
                              variant="outline"
                              className={`${getPlatformColor(contest.PlatFrom as PlatFormEnum)}`}
                            >
                              {contest.PlatFrom}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${contest.isBookmarked ? "text-yellow-500" : "text-muted-foreground"}`}
                              onClick={() =>
                                handleToggleBookmark(
                                  contest.id,
                                  contest.isBookmarked,
                                )
                              }
                              disabled={bookmarkingId === contest.id}
                            >
                              {bookmarkingId === contest.id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <BookmarkIcon className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                          <CardTitle className="line-clamp-2 text-lg">
                            {contest.contestName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {formatISTTime(contest.StartTime)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  getCountdown(contest.StartTime) === "LIVE NOW"
                                    ? "bg-green-500 animate-pulse"
                                    : getCountdown(contest.StartTime) ===
                                        "Ended"
                                      ? "bg-gray-500"
                                      : "bg-yellow-500"
                                }`}
                              />
                              <span
                                className={`font-medium ${
                                  getCountdown(contest.StartTime) === "LIVE NOW"
                                    ? "text-green-500"
                                    : getCountdown(contest.StartTime) ===
                                        "Ended"
                                      ? "text-muted-foreground"
                                      : ""
                                }`}
                              >
                                {getCountdown(contest.StartTime)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex flex-col items-start gap-2">
                          {/* Solution Videos Section - Improved */}
                          {contest.ContestSolutions.length > 0 ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="w-full gap-2"
                                >
                                  <Video className="h-4 w-4" />
                                  {contest.ContestSolutions.length} Solution
                                  {contest.ContestSolutions.length > 1
                                    ? "s"
                                    : ""}{" "}
                                  Available
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2 text-xl">
                                    <Video className="h-5 w-5 text-primary" />
                                    Solution Videos
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="mt-4 space-y-3 pr-1 max-h-[60vh] overflow-y-auto">
                                  {contest.ContestSolutions.map(
                                    (solution, idx) => (
                                      <a
                                        key={idx}
                                        href={solution.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted"
                                      >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                                          <Video className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="font-medium">
                                            Solution Video #{idx + 1}
                                          </p>
                                          <p className="text-sm text-muted-foreground truncate">
                                            {solution.url}
                                          </p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                      </a>
                                    ),
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground"
                            >
                              No solutions available
                            </Badge>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full gap-2"
                            asChild
                          >
                            <a
                              href={getPlatformUrl(
                                contest.PlatFrom as PlatFormEnum,
                                contest.querySlug,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                              View Contest
                            </a>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Pagination Controls */}
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pageNo - 1)}
                  disabled={pageNo === 0 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <span className="mx-2 text-sm">Page {pageNo + 1}</span>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pageNo + 1)}
                  disabled={contests.length <= 0 || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Loading overlay for page changes */}
              {loading ||
                (isLoading && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2 rounded-lg bg-card p-6 shadow-lg">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="font-medium">Loading contests...</p>
                    </div>
                  </div>
                ))}

              {/* Empty state */}
              {filteredContests.length === 0 && !loading && (
                <div className="mt-8 flex flex-col items-center justify-center rounded-lg border bg-card p-8 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">No contests found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or check back later for new
                    contests.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("");
                      setPlatformFilter("all");
                      setTimeFilter("all");
                      setShowBookmarkedOnly(false);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
