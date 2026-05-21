import type { Collection } from "@/lib/types";

export const githubCollection: Collection = {
  id: "github",
  name: "GitHub",
  baseUrl: "https://api.github.com",
  authType: "none",
  endpoints: [
    {
      id: "github-get-user",
      name: "Get User",
      category: "Users",
      method: "GET",
      path: "/users/:username",
      params: [{ name: "username", defaultValue: "torvalds", description: "GitHub username" }],
      description: "Get a GitHub user's public profile",
    },
    {
      id: "github-list-repos",
      name: "List User Repos",
      category: "Repos",
      method: "GET",
      path: "/users/:username/repos?per_page=5",
      params: [{ name: "username", defaultValue: "torvalds", description: "GitHub username" }],
      description: "List public repositories for a user",
    },
    {
      id: "github-get-repo",
      name: "Get Repo",
      category: "Repos",
      method: "GET",
      path: "/repos/:owner/:repo",
      params: [
        { name: "owner", defaultValue: "vercel", description: "Repository owner" },
        { name: "repo", defaultValue: "next.js", description: "Repository name" },
      ],
      description: "Get a specific repository",
    },
    {
      id: "github-search-repos",
      name: "Search Repos",
      category: "Search",
      method: "GET",
      path: "/search/repositories?q=:query&per_page=3",
      params: [{ name: "query", defaultValue: "paystack api", description: "Search query" }],
      description: "Search GitHub repositories",
    },
    {
      id: "github-list-commits",
      name: "List Commits",
      category: "Commits",
      method: "GET",
      path: "/repos/:owner/:repo/commits?per_page=3",
      params: [
        { name: "owner", defaultValue: "vercel", description: "Repository owner" },
        { name: "repo", defaultValue: "next.js", description: "Repository name" },
      ],
      description: "List commits for a repository",
    },
  ],
};
