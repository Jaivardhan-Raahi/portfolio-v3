import { DeveloperProfile, Project } from '../types';

export function getAIReplyingText(
  query: string,
  profile: DeveloperProfile,
  projects: Project[]
): string {
  const lower = query.toLowerCase();

  if (lower.includes("who is") || lower.includes("about") || lower.includes("background") || lower.includes("jaivardhan")) {
    return `${profile.name} (@${profile.handle}) is a ${profile.role} based in ${profile.location}. He builds high-performance web applications, AI execution runtimes, and clean software architecture.`;
  }

  if (lower.includes("built") || lower.includes("project") || lower.includes("repo") || lower.includes("work")) {
    if (projects.length > 0) {
      const top = projects[0];
      return `${profile.name}'s top active repository on GitHub is "${top.name}" (${top.tagline}). It has ${top.stars} stars and is written in ${top.tech.join(", ")}. You can explore all ${projects.length} fetched repositories in the Projects app!`;
    }
    return `${profile.name} has built multiple open-source and full-stack projects including vector database engines, multi-agent orchestrators, and WebGPU applications.`;
  }

  if (lower.includes("tech") || lower.includes("stack") || lower.includes("skill") || lower.includes("language")) {
    return `His primary technical stack includes ${profile.systemProfile.favoriteStack.join(", ")}. He focuses on ${profile.systemProfile.focus}.`;
  }

  if (lower.includes("contact") || lower.includes("email") || lower.includes("hire") || lower.includes("reach") || lower.includes("social")) {
    return `You can reach ${profile.name} directly via email at ${profile.email} or visit his GitHub at ${profile.github}. You can also open the Contact app on this desktop to send a direct message!`;
  }

  if (lower.includes("experience") || lower.includes("role") || lower.includes("job") || lower.includes("career")) {
    return `${profile.name} has experience architecting full-stack applications, optimizing system performance, and leading software engineering initiatives. Check out the Experience app for a complete timeline.`;
  }

  return `Regarding "${query}": ${profile.name} approaches software engineering with a focus on intuitive UI design, performance optimization, and robust system architecture. Feel free to launch the Terminal, Projects, or Skills apps on this desktop to learn more!`;
}
