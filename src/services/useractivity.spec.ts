import {
  UserActivity,
  calculateMLUandMAU,
  isActive,
  filterByMonthAndYear,
} from "./useractivity.services";

describe("User Activity Functions", () => {
  const userActivityData: UserActivity[] = [
    {
      userId: "user1",
      deviceId: "device1",
      loggedInAt: new Date("2022-01-01T08:00:00"), // Example: January 1, 2022, 08:00:00 AM
      loggedOutAt: new Date("2022-01-01T08:30:00"), // Example: January 1, 2022, 08:30:00 AM
      lastSeenAt: [
        new Date("2022-01-01T08:15:00"), // Example: January 1, 2022, 08:15:00 AM
        new Date("2022-01-01T08:20:00"), // Example: January 1, 2022, 08:20:00 AM
      ],
    },
    {
      userId: "user2",
      deviceId: "device2",
      loggedInAt: new Date("2022-01-15T09:00:00"), // Example: January 15, 2022, 09:00:00 AM
      loggedOutAt: new Date("2022-01-15T09:30:00"), // Example: January 15, 2022, 09:30:00 AM
      lastSeenAt: [
        new Date("2022-01-15T09:15:00"), // Example: January 15, 2022, 09:15:00 AM
        new Date("2022-01-20T10:00:00"), // Example: January 20, 2022, 10:00:00 AM
      ],
    },
    {
      userId: "user3",
      deviceId: "device3",
      loggedInAt: new Date("2022-02-01T08:00:00"), // Example: February 1, 2022, 08:00:00 AM
      loggedOutAt: new Date("2022-02-01T08:30:00"), // Example: February 1, 2022, 08:30:00 AM
      lastSeenAt: [], // No last seen activity
    },
  ];

  test("isActive function - user active", () => {
    const activity: UserActivity = {
      userId: "user1",
      deviceId: "device1",
      loggedInAt: new Date("2022-01-01T08:00:00"),
      loggedOutAt: new Date("2022-01-01T08:30:00"),
      lastSeenAt: [
        new Date("2022-01-01T08:15:00"),
        new Date("2022-01-01T08:20:00"),
      ],
    };
    const threshold = 0;
    expect(isActive(activity, threshold)).toBe(true);
  });

  test("filterByMonth function - filter January 2022", () => {
    const filteredData = filterByMonthAndYear(userActivityData, 0, 2022);
    expect(filteredData.length).toBe(2);
  });

  test("calculateMLUandMAU function - calculate MLU and MAU for January 2022", () => {
    const { MLU, MAU } = calculateMLUandMAU(userActivityData, 0, 2022);
    expect(MLU).toBe(2);
    expect(MAU).toBe(2);
  });

  test("calculateMLUandMAU function - calculate MLU and MAU with time-based activity", () => {
    const { MLU, MAU } = calculateMLUandMAU(
      userActivityData,
      1, // for february
      2022,
      2, // No threshold for testing
      "timeBasedActivity",
    );

    console.log(MLU, MAU);

    expect(MLU).toBe(1);
    expect(MAU).toBe(0); // Only user3 has no last seen activity
  });
});
