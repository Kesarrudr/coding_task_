"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { showSuccessNotification } from "@/components/success-toast";
import { showErrorNotification } from "@/components/error-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useContesthook } from "@/hooks/contest";
import { PlatFormEnum } from "@/types/types";
import { ContestDataType, UploadSolutionType } from "backend/utilis";
import { useSolutionHook } from "@/hooks/solutions";

export default function UploadPage() {
  const router = useRouter();
  const { getContest } = useContesthook();
  const { isLoading: uploadingLoader, uploadsolution } = useSolutionHook();

  const [contests, setContests] = useState<ContestDataType[]>([]);
  const [filteredContests, setFilteredContests] = useState<ContestDataType[]>(
    [],
  );
  const [pageNo, setPageNo] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploadData, setUploadData] = useState<UploadSolutionType[]>([]);
  const [addingToQueue, setAddingToQueue] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [selectedContestId, setSelectedContestId] = useState<string>("");
  const [newSolutionUrl, setNewSolutionUrl] = useState("");

  // Add a new state for tracking which contest has an open URL input
  const [addingUrlToContestId, setAddingUrlToContestId] = useState<
    string | null
  >(null);
  const [directUrlInput, setDirectUrlInput] = useState("");

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
        const currentTime = Math.floor(Date.now() / 1000);

        const pastContests = response
          .filter((contest) => contest.StartTime < currentTime) // Only keep past events
          .sort((a, b) => b.StartTime - a.StartTime);

        setContests(pastContests);
        setFilteredContests(pastContests);
      }
      setInitialLoading(false);
    };

    fetchContests();
    window.scroll(0, 0);
  }, [pageNo]);

  // Apply filters
  useEffect(() => {
    let result = [...contests];

    // Search filter
    if (searchTerm) {
      result = result.filter((contest) =>
        contest.contestName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Platform filter
    if (platformFilter !== "all") {
      result = result.filter((contest) => contest.PlatFrom === platformFilter);
    }

    // Sort by start time (most recent first)
    const sortedResult = [...result].sort((a, b) => b.StartTime - a.StartTime);

    setFilteredContests(sortedResult);
  }, [contests, searchTerm, platformFilter]);

  // Handle page navigation
  const handlePageChange = async (newPage: number) => {
    if (contests.length <= 0) return;

    setLoading(true);
    const response = await getContest(newPage);

    if (response) {
      // Sort contests by start time (most recent first)
      const sortedContests = [...response].sort(
        (a, b) => b.StartTime - a.StartTime,
      );

      setPageNo(newPage);
      setContests(sortedContests);
    }

    setLoading(false);
  };

  // Format time to IST
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

  // Get countdown timer (for past contests, shows time since contest)
  const getTimeSince = (startTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - startTime;

    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    return `${days}d ${hours}h ${minutes}m ago`;
  };

  // Get platform badge color
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

  // Modify the handleAddSolution function to handle direct URL inputs from cards
  const handleAddSolution = async (
    directContestId?: string,
    directUrl?: string,
  ) => {
    const contestId = directContestId || selectedContestId;
    const url = directUrl || newSolutionUrl;
    const contestName = getContestNameById(contestId);

    if (!contestId) {
      showErrorNotification("Please select a contest first");
      return;
    }

    if (!url) {
      showErrorNotification("Please enter a solution URL");
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      showErrorNotification("Please enter a valid URL");
      return;
    }

    setAddingToQueue(true);

    // Add to upload data
    setUploadData((prev) => [...prev, { contestName, contestId, url }]);

    // Clear inputs
    if (directContestId) {
      setDirectUrlInput("");
      setAddingUrlToContestId(null);
    }
    setSelectedContestId("");
    setNewSolutionUrl("");

    setAddingToQueue(false);
  };

  // Handle removing a solution from the upload data
  const handleRemoveSolution = (index: number) => {
    setUploadData((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle submitting all solutions
  const handleSubmitSolutions = async () => {
    if (uploadData.length === 0) {
      showErrorNotification("No solutions to upload");
      return;
    }

    setAddingUrlToContestId(null);

    const result = await uploadsolution(uploadData);
    if (result) {
      showSuccessNotification(
        `Successfully uploaded ${result?.data.count} solution${result?.data.count !== 1 ? "s" : ""}`,
      );
    }

    setUploadData([]);
    setSelectedContestId("");
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

  const getContestNameById = (contestId: string) => {
    const contest = contests.find((c) => c.id === contestId);
    return contest ? contest.contestName : "Unknown Contest";
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 pt-20">
        <div className="container mx-auto max-w-6xl py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Upload Solutions</h1>
              <p className="text-muted-foreground">
                Add solution videos to past coding contests
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

              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[180px]">
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
          </div>

          {/* Solution Upload Form */}
          <div className="mb-8 rounded-lg border bg-card p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Add Solution Video</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr_auto]">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Select Contest
                </label>
                <Select
                  value={selectedContestId || ""}
                  onValueChange={setSelectedContestId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a contest" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {contests.map((contest) => (
                      <SelectItem key={contest.id} value={contest.id}>
                        {contest.contestName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Solution URL
                </label>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newSolutionUrl}
                  onChange={(e) => setNewSolutionUrl(e.target.value)}
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => {
                    handleAddSolution();
                  }}
                  className="w-full gap-2"
                  disabled={addingToQueue}
                >
                  {addingToQueue ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add Solution
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Upload Queue */}
            {uploadData.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 text-lg font-medium">
                  Upload Queue ({uploadData.length})
                </h3>
                <div className="max-h-[300px] overflow-y-auto rounded-md border">
                  {uploadData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b p-3 last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {item.contestName}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.url}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSolution(index)}
                        disabled={uploadingLoader}
                        className="ml-2 text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleSubmitSolutions}
                    disabled={uploadingLoader}
                    className="gap-2"
                  >
                    {uploadingLoader ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload All Solutions
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {initialLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={index}
                  className="h-full overflow-hidden border border-border/30 bg-card shadow-sm"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="mt-2 h-6 w-full" />
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-2/3" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-2">
                    <Skeleton className="h-10 w-full" />
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
                  className="grid grid-cols-1 gap-4 md:grid-cols-2"
                >
                  {filteredContests.map(
                    (contest: ContestDataType, index: number) => (
                      <motion.div
                        key={contest.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: (index % 2) * 0.1 }}
                      >
                        <Card
                          className={`h-full overflow-hidden border-0 bg-background transition-all ${
                            selectedContestId === contest.id
                              ? "ring-2 ring-primary"
                              : ""
                          }`}
                        >
                          <CardHeader className="pb-2">
                            <Badge
                              variant="outline"
                              className={`w-fit ${getPlatformColor(contest.PlatFrom as PlatFormEnum)}`}
                            >
                              {contest.PlatFrom}
                            </Badge>
                            <CardTitle className="text-xl mt-2">
                              {contest.contestName}
                            </CardTitle>
                            <p className="text-muted-foreground">
                              {formatISTTime(contest.StartTime)}
                            </p>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                <span className="font-medium">
                                  {getTimeSince(contest.StartTime)}
                                </span>
                              </div>

                              {contest.ContestSolutions.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <Video className="h-4 w-4 text-muted-foreground" />
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="link"
                                        className="h-auto p-0"
                                      >
                                        {contest.ContestSolutions.length}{" "}
                                        existing solution
                                        {contest.ContestSolutions.length !== 1
                                          ? "s"
                                          : ""}
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px]">
                                      <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2 text-xl">
                                          <Video className="h-5 w-5 text-primary" />
                                          Existing Solution Videos
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
                                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                                <Video className="h-5 w-5 text-primary" />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <p className="font-medium">
                                                  Solution Video #{idx + 1}
                                                </p>
                                                <p className="text-sm text-muted-foreground truncate">
                                                  {solution.url}
                                                </p>
                                              </div>
                                              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                                            </a>
                                          ),
                                        )}
                                      </div>
                                      <div className="mt-4 flex justify-end">
                                        <DialogClose asChild>
                                          <Button variant="outline">
                                            Close
                                          </Button>
                                        </DialogClose>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              )}

                              <div className="flex items-center gap-2">
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                <a
                                  href={getPlatformUrl(
                                    contest.PlatFrom as PlatFormEnum,
                                    contest.querySlug,
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline"
                                >
                                  View Contest
                                </a>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex flex-col gap-3 ">
                            {addingUrlToContestId === contest.id ? (
                              <div className="flex w-full flex-col gap-2">
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={directUrlInput}
                                    onChange={(e) =>
                                      setDirectUrlInput(e.target.value)
                                    }
                                    className="flex-1"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleAddSolution(
                                        contest.id,
                                        directUrlInput,
                                      )
                                    }
                                    disabled={addingToQueue}
                                    className="shrink-0"
                                  >
                                    {addingToQueue ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Add"
                                    )}
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setAddingUrlToContestId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <div className="flex gap-2 w-full">
                                <Button
                                  variant={
                                    selectedContestId === contest.id
                                      ? "default"
                                      : "outline"
                                  }
                                  className="flex-1"
                                  onClick={() =>
                                    setSelectedContestId(
                                      selectedContestId === contest.id
                                        ? ""
                                        : contest.id,
                                    )
                                  }
                                >
                                  {selectedContestId === contest.id
                                    ? "Selected"
                                    : "Select Contest"}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    setAddingUrlToContestId(contest.id)
                                  }
                                  className="shrink-0"
                                >
                                  Add URL
                                </Button>
                              </div>
                            )}
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ),
                  )}
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
                  disabled={
                    contests.length <= 0 ||
                    loading ||
                    filteredContests.length === 0
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Loading overlay for page changes */}
              {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2 rounded-lg bg-card p-6 shadow-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="font-medium">Loading contests...</p>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {filteredContests.length === 0 && !loading && (
                <div className="mt-8 flex flex-col items-center justify-center rounded-lg border bg-card p-8 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Video className="h-6 w-6 text-primary" />
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
