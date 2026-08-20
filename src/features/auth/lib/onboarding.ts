const PENDING_KEY = "lgnd-onboarding-pending";
const PREFS_KEY = "lgnd-onboarding-prefs";

export type OnboardingTrack = "ESSENTIAL" | "FULL";
export type OnboardingGoal = 10 | 20 | 30;
export type OnboardingReminder = "19:00" | "21:30" | "22:30" | "none";

export type OnboardingPrefs = {
  track: OnboardingTrack;
  baseId: string;
  goal: OnboardingGoal;
  reminder: OnboardingReminder;
};

export function markOnboardingPending(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(PENDING_KEY, "1");
}

export function isOnboardingPending(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(PENDING_KEY) === "1";
}

export function clearOnboardingPending(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(PENDING_KEY);
}

export function saveOnboardingPrefs(prefs: OnboardingPrefs): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  window.localStorage.removeItem(PENDING_KEY);
}

export function loadOnboardingPrefs(): OnboardingPrefs | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(PREFS_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as OnboardingPrefs;
  } catch {
    return null;
  }
}

export function skipOnboarding(): void {
  saveOnboardingPrefs({
    track: "ESSENTIAL",
    baseId: "teorico",
    goal: 20,
    reminder: "21:30",
  });
}
