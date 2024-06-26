/**
 * Interface representing a user activity record.
 */
interface UserActivity {
  userId: string;
  deviceId: string;
  loggedInAt: Date;
  loggedOutAt: Date;
  lastSeenAt: Date[];
}

/**
 * Checks if a user is active based on the time-based activity criteria.
 * @param activity - The user activity record.
 * @param threshold - The minimum required active time in milliseconds.
 * @returns True if the user is considered active, false otherwise.
 */
function isActive(activity: UserActivity, threshold: number): boolean {
  
  // Need at least 2 lastSeenAt timestamps to calculate active time
  if (activity.lastSeenAt.length < 2) {
    return false;
  }

  // Sort lastSeenAt timestamps in ascending order
  activity.lastSeenAt.sort((a, b) => a.getTime() - b.getTime());

  let totalActiveTime = 0;
  for (let i = 1; i < activity.lastSeenAt.length; i++) {
    const duration =
      activity.lastSeenAt[i].getTime() - activity.lastSeenAt[i - 1].getTime();
    totalActiveTime += duration;
  }

  return totalActiveTime >= threshold;
}

/**
 * Filters user activity data for a specific month and year.
 * @param data - The array of user activity records.
 * @param month - The month to filter by (0-indexed, 0 = January).
 * @param year - The year to filter by.
 * @param includeLastSeen - (Optional) Whether to include last seen activity in the filter. Defaults to false.
 * @returns An array of user activity records that fall within the specified month and year.
 */

function filterByMonthAndYear(
  data: UserActivity[],
  month: number,
  year: number,
  includeLastSeen: boolean = false,
): UserActivity[] {
  return data.filter((activity) => {
    return (
      (activity.loggedInAt.getMonth() === month &&
        activity.loggedInAt.getFullYear() === year) ||
      (includeLastSeen &&
        activity.lastSeenAt.some(
          (timestamp) =>
            timestamp.getMonth() === month && timestamp.getFullYear() === year,
        ))
    );
  });
}

/**
 * Calculates the Monthly Logged-in Users (MLU) and Monthly Active Users (MAU) based on provided criteria.
 * @param data - The array of user activity records.
 * @param month - The month to analyze (0-indexed, 0 = January).
 * @param year - (Optional) The year to analyze. Defaults to the current year.
 * @param activeThreshold - (Optional) The minimum required active time in milliseconds for time-based activity.
 * @param activeDescription - (Optional) The type of active user definition ("lastSeenActivity" or "timeBasedActivity"). Defaults to "lastSeenActivity".
 * @returns An object containing the calculated MLU and MAU values.
 */
function calculateMLUandMAU(
  data: UserActivity[],
  month: number,
  year?: number,
  activeThreshold?: number,
  activeDescripton?: "lastSeenActivity" | "timeBasedActivity",
): { MLU: number; MAU: number } {
  if (!year) {
    year = new Date().getFullYear(); // Default to current year
  }

  if (!activeThreshold) {
    activeThreshold = 0; // Default to 0
  }

  if (!activeDescripton) {
    activeDescripton = "lastSeenActivity"; // Default to "lastSeenActivity"
  }

  const monthlyData = filterByMonthAndYear(data, month, year);
  const uniqueLoggedInUsers = new Set<string>();

  // 1. Calculate the monthly logged in users (MLU)
  for (const activity of monthlyData) {
    uniqueLoggedInUsers.add(activity.userId);
  }

  const mlu = uniqueLoggedInUsers.size;

  const monthlyDataForActiveUsers = filterByMonthAndYear(
    data,
    month,
    year,
    true,
  );

  const activeUsers = new Set<string>();

  for (const activity of monthlyDataForActiveUsers) {
    if (activeDescripton === "lastSeenActivity") {
      if (activity.lastSeenAt.length > 0) {
        activeUsers.add(activity.userId);
      }
    } else if (activeDescripton === "timeBasedActivity") {
      if (isActive(activity, activeThreshold!)) {
        activeUsers.add(activity.userId);
      }
    }
  }

  const mau = activeUsers.size;

  return {
    MLU: mlu, // Monthly Logged In Users
    MAU: mau, // Monthly Active Users
  };
}

export { UserActivity, calculateMLUandMAU, filterByMonthAndYear, isActive };
