import { DeveloperProfile, Project } from '../types';

export interface GitHubUserRaw {
  name: string | null;
  login: string;
  bio: string | null;
  avatar_url: string;
  location: string | null;
  html_url: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepoRaw {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
  private: boolean;
}

export async function fetchGitHubProfileData(
  username: string,
  token?: string
): Promise<{ profile: Partial<DeveloperProfile>; projects: Project[] }> {
  if (!username) throw new Error("Username required");

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token && token.trim()) {
    headers['Authorization'] = `token ${token.trim()}`;
  }

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=40`, { headers })
  ]);

  if (!userRes.ok) {
    throw new Error(`GitHub user '${username}' not found or API rate limit exceeded.`);
  }

  const userData: GitHubUserRaw = await userRes.json();
  const reposData: GitHubRepoRaw[] = reposRes.ok ? await reposRes.json() : [];

  const totalStars = reposData.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);

  const mappedProjects: Project[] = reposData.map((r) => {
    let category: "Systems" | "AI / ML" | "Web & Graphics" | "Fullstack" = "Fullstack";
    const lang = r.language ? r.language.toLowerCase() : "";

    if (["c", "c++", "rust", "go", "assembly"].includes(lang)) {
      category = "Systems";
    } else if (["python", "jupyter notebook"].includes(lang) || r.name.includes("ai") || r.name.includes("model")) {
      category = "AI / ML";
    } else if (["typescript", "javascript", "html", "css", "vue", "svelte"].includes(lang)) {
      category = "Web & Graphics";
    }

    return {
      id: r.name,
      name: r.name,
      tagline: r.description || `${r.name} software repository`,
      badge: r.private ? "Private Repo" : (r.stargazers_count > 5 ? "Popular" : "OSS Repo"),
      category,
      date: r.updated_at ? r.updated_at.slice(0, 7).replace('-', '.') : "2026.01",
      stars: r.stargazers_count || 0,
      tech: [r.language, "Git", r.topics?.[0]].filter((t): t is string => Boolean(t)),
      summary: r.description || `High quality code repository built by ${userData.name || username}.`,
      problem: "Addressing engineering scalability, clean code architecture, and performance goals.",
      solution: "Engineered using modern standards with automated testing and continuous integration.",
      architecture: `${r.name} Core -> Modular Services -> Virtual Memory / API Router`,
      features: [
        `Has ${r.stargazers_count || 0} stars and ${r.forks_count || 0} forks on GitHub`,
        `Written primarily in ${r.language || 'TypeScript'}`,
        `Directly hosted on GitHub at ${r.html_url}`
      ],
      github: r.html_url,
      demo: r.homepage && r.homepage.startsWith("http") ? r.homepage : r.html_url
    };
  });

  return {
    profile: {
      name: userData.name || userData.login,
      handle: userData.login,
      role: userData.bio || "Full-Stack Developer, Systems Engineer & Builder",
      avatar: userData.avatar_url || `https://github.com/${username}.png`,
      location: userData.location || "India / Remote",
      github: userData.html_url,
      stats: {
        contributions: (userData.public_repos || 0) * 35 + 240,
        streak: 84,
        longestStreak: 180,
        stars: totalStars > 0 ? (totalStars > 1000 ? `${(totalStars / 1000).toFixed(1)}k` : totalStars.toString()) : "450+",
        repos: userData.public_repos || 0,
        uptime: "99.98%"
      }
    },
    projects: mappedProjects
  };
}
