import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Svg, { Polyline, Line, Circle, Text as SvgText } from "react-native-svg";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import {
  getLast7DaysData,
  getMonthlyStats,
  getStreakData,
  getCompletedByDate,
  getISTDateStringExport,
  DAILY_GOAL,
} from "../store/DataStore";
import { COLORS } from "../styles/theme";
import { useFocusEffect } from "@react-navigation/native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CHART_WIDTH = SCREEN_WIDTH - 64;
const CHART_HEIGHT = 180;
const CHART_PADDING = { top: 25, bottom: 30, left: 45, right: 25 };

export default function AnalyticsScreen() {
  const [activeSubTab, setActiveSubTab] = useState("Analytics");

  // Analytics tab state
  const [last7Days, setLast7Days] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [streakData, setStreakData] = useState(null);

  // Completed tab state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [completedData, setCompletedData] = useState(null);
  const [loadingCompleted, setLoadingCompleted] = useState(false);

  const GOAL = DAILY_GOAL; // 750

  const loadAnalytics = async () => {
    try {
      const days = await getLast7DaysData();
      setLast7Days(days);

      const now = new Date();
      const stats = await getMonthlyStats(now.getFullYear(), now.getMonth());
      setMonthlyStats(stats);

      const streak = await getStreakData();
      setStreakData(streak);
    } catch (e) {
      console.log("Analytics load error:", e);
    }
  };

  const loadCompleted = async (date) => {
    try {
      setLoadingCompleted(true);
      const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
      const formatted = ist.toISOString().slice(0, 10);
      const res = await getCompletedByDate(formatted);
      setCompletedData(res);
    } catch (e) {
      console.log("Completed fetch error:", e);
      setCompletedData(null);
    } finally {
      setLoadingCompleted(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAnalytics();
      loadCompleted(selectedDate);
    }, [selectedDate])
  );

  useEffect(() => {
    loadAnalytics();
    loadCompleted(selectedDate);
  }, []);

  const onDateChange = (_, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      loadCompleted(date);
    }
  };

  // ── Graph Calculations with Dynamic Y-axis beyond GOAL (750) ──
  const pointsList = last7Days.map((d) => d.points);
  const highestPoint = Math.max(0, ...pointsList);

  // Dynamic max for chart: round up above 750
  let chartMax = GOAL;
  if (highestPoint > GOAL) {
    if (highestPoint <= 1500) {
      chartMax = Math.ceil(highestPoint / 250) * 250;
    } else {
      chartMax = Math.ceil(highestPoint / 500) * 500;
    }
  }

  // Generate grid lines and Y-axis indication values
  const yAxisValues = [];
  let yStep = 250;
  if (chartMax > 1500) yStep = 500;
  if (chartMax > 3000) yStep = 1000;

  for (let val = 0; val <= chartMax; val += yStep) {
    yAxisValues.push(val);
  }
  // Ensure GOAL (750) is always in yAxisValues
  if (!yAxisValues.includes(GOAL)) {
    yAxisValues.push(GOAL);
    yAxisValues.sort((a, b) => a - b);
  }

  const plotWidth = CHART_WIDTH - CHART_PADDING.left - CHART_PADDING.right;
  const plotHeight = CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

  const getX = (i) =>
    CHART_PADDING.left + (i / Math.max(last7Days.length - 1, 1)) * plotWidth;
  const getY = (val) =>
    CHART_PADDING.top + plotHeight - (val / chartMax) * plotHeight;

  const polylinePoints = last7Days
    .map((d, i) => `${getX(i)},${getY(d.points)}`)
    .join(" ");

  const goalY = getY(GOAL);

  // Streak Multiplier Tiers
  const streakTiers = [
    { days: 3, multiplier: "1.1x", minDays: 3, maxDays: 4 },
    { days: 5, multiplier: "1.3x", minDays: 5, maxDays: 9 },
    { days: 10, multiplier: "1.8x", minDays: 10, maxDays: 14 },
    { days: 15, multiplier: "2.0x", minDays: 15, maxDays: Infinity },
  ];

  // Active tier helper
  const currentStreak = streakData?.current || 0;
  const getActiveTier = () => {
    if (currentStreak >= 15) return 15;
    if (currentStreak >= 10) return 10;
    if (currentStreak >= 5) return 5;
    if (currentStreak >= 3) return 3;
    return null;
  };
  const activeTierDays = getActiveTier();

  // Negative penalty tiers as requested: -300, -200, -1000
  const negTiers = [
    { days: 3, penalty: "-300 pts", color: "#EF5350" },
    { days: 5, penalty: "-200 pts", color: "#E53935" },
    { days: 10, penalty: "-1000 pts", color: "#C62828" },
  ];

  const currentMonth = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      {/* ── SUB-MENU SWITCH ── */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: COLORS.white,
          marginHorizontal: 16,
          marginTop: 14,
          marginBottom: 10,
          borderRadius: 12,
          padding: 4,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor:
              activeSubTab === "Analytics" ? COLORS.primary : "transparent",
            alignItems: "center",
          }}
          onPress={() => setActiveSubTab("Analytics")}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color:
                activeSubTab === "Analytics" ? COLORS.white : COLORS.textSecondary,
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            Analytics
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 8,
            backgroundColor:
              activeSubTab === "Completed" ? COLORS.primary : "transparent",
            alignItems: "center",
          }}
          onPress={() => setActiveSubTab("Completed")}
          activeOpacity={0.8}
        >
          <Text
            style={{
              color:
                activeSubTab === "Completed" ? COLORS.white : COLORS.textSecondary,
              fontWeight: "700",
              fontSize: 14,
            }}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── SUBTAB 1: ANALYTICS ── */}
      {activeSubTab === "Analytics" && (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 100 }}
        >
          {/* ── 7-Day Points Graph ── */}
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
              elevation: 2,
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Last 7 Days
              </Text>
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                Goal: {GOAL} pts
              </Text>
            </View>

            {last7Days.length > 0 ? (
              <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                {/* Dynamic grid lines & Y-axis indications */}
                {yAxisValues.map((val) => {
                  const yPos = getY(val);
                  const isGoal = val === GOAL;
                  return (
                    <Line
                      key={`grid-${val}`}
                      x1={CHART_PADDING.left}
                      y1={yPos}
                      x2={CHART_WIDTH - CHART_PADDING.right}
                      y2={yPos}
                      stroke={isGoal ? COLORS.primary : COLORS.border}
                      strokeWidth={isGoal ? 1.5 : 0.8}
                      strokeDasharray={isGoal ? "6,3" : "4,4"}
                    />
                  );
                })}

                {/* Y-axis text labels with indications above GOAL */}
                {yAxisValues.map((val) => {
                  const yPos = getY(val);
                  const isGoal = val === GOAL;
                  return (
                    <SvgText
                      key={`ylabel-${val}`}
                      x={CHART_PADDING.left - 6}
                      y={yPos + 4}
                      fontSize={8.5}
                      fill={isGoal ? COLORS.primary : COLORS.textMuted}
                      textAnchor="end"
                      fontWeight={isGoal ? "700" : "400"}
                    >
                      {val}
                    </SvgText>
                  );
                })}

                {/* GOAL Tag Indicator on Right */}
                <SvgText
                  x={CHART_WIDTH - CHART_PADDING.right}
                  y={goalY - 4}
                  fontSize={9}
                  fill={COLORS.primary}
                  textAnchor="end"
                  fontWeight="700"
                >
                  GOAL ({GOAL})
                </SvgText>

                {/* Polyline line chart */}
                {last7Days.length > 1 && (
                  <Polyline
                    points={polylinePoints}
                    fill="none"
                    stroke={COLORS.primary}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Datapoints */}
                {last7Days.map((d, i) => (
                  <Circle
                    key={i}
                    cx={getX(i)}
                    cy={getY(d.points)}
                    r={4.5}
                    fill={d.points >= GOAL ? COLORS.primaryDark : COLORS.accent}
                    stroke={COLORS.white}
                    strokeWidth={2}
                  />
                ))}

                {/* X-axis Day Labels */}
                {last7Days.map((d, i) => (
                  <SvgText
                    key={`day-${i}`}
                    x={getX(i)}
                    y={CHART_HEIGHT - 6}
                    fontSize={9.5}
                    fill={COLORS.textSecondary}
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    {d.shortDate}
                  </SvgText>
                ))}

                {/* Point Value Labels */}
                {last7Days.map((d, i) => {
                  const isAbove = d.points > GOAL;
                  const excess = isAbove ? d.points - GOAL : 0;
                  return (
                    <SvgText
                      key={`val-${i}`}
                      x={getX(i)}
                      y={Math.max(getY(d.points) - 7, 12)}
                      fontSize={8.5}
                      fill={isAbove ? COLORS.primaryDark : COLORS.text}
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      {isAbove ? `${d.points} (+${excess})` : `${d.points}`}
                    </SvgText>
                  );
                })}
              </Svg>
            ) : (
              <Text
                style={{
                  color: COLORS.textMuted,
                  textAlign: "center",
                  marginVertical: 20,
                }}
              >
                No data yet
              </Text>
            )}
          </View>

          {/* ── Monthly Stats ── */}
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
              elevation: 2,
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 14,
              }}
            >
              {currentMonth} Stats
            </Text>

            {monthlyStats && (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <StatCard
                    label="Goals Achieved"
                    value={monthlyStats.goalAchievedDays}
                    color={COLORS.primary}
                  />
                  <StatCard
                    label="Goals Missed"
                    value={monthlyStats.goalMissedDays}
                    color={COLORS.danger}
                  />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <StatCard
                    label="Avg Daily Earnings"
                    value={monthlyStats.averageDailyEarnings}
                    color={COLORS.primaryLight}
                    suffix=" pts"
                  />
                  <StatCard
                    label="Total Earned (>750)"
                    value={monthlyStats.totalEarnings}
                    color={COLORS.primaryDark}
                    suffix=" pts"
                  />
                </View>
              </View>
            )}
          </View>

          {/* ── Streak Rewards & Multipliers ── */}
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
              elevation: 2,
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 3,
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                fontSize: 16,
                fontWeight: "700",
                marginBottom: 14,
              }}
            >
              Daily Streak Rewards
            </Text>

            {streakData && (
              <>
                {/* Current Streak Card */}
                <View
                  style={{
                    backgroundColor: COLORS.surface,
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 14,
                    alignItems: "center",
                    borderWidth: activeTierDays ? 1.5 : 1,
                    borderColor: activeTierDays ? COLORS.primary : COLORS.border,
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: 38,
                      fontWeight: "800",
                    }}
                  >
                    {streakData.current}
                  </Text>
                  <Text
                    style={{
                      color: COLORS.textSecondary,
                      fontSize: 13,
                      fontWeight: "500",
                      marginTop: 2,
                    }}
                  >
                    Day Streak
                  </Text>

                  {/* ACTIVE REWARD HIGHLIGHT */}
                  {activeTierDays && (
                    <View
                      style={{
                        backgroundColor: COLORS.primary,
                        borderRadius: 20,
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                        marginTop: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Ionicons name="sparkles" size={16} color={COLORS.white} />
                      <Text
                        style={{
                          color: COLORS.white,
                          fontWeight: "700",
                          fontSize: 13,
                        }}
                      >
                        {streakData.multiplier}x Multiplier Active!
                      </Text>
                    </View>
                  )}
                </View>

                {/* Multiplier Tiers */}
                <Text
                  style={{
                    color: COLORS.textSecondary,
                    fontSize: 12,
                    fontWeight: "600",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Streak Multiplier Tiers
                </Text>

                {streakTiers.map((tier) => {
                  const isActive = activeTierDays === tier.days;
                  return (
                    <View
                      key={tier.days}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                        marginBottom: 6,
                        backgroundColor: isActive
                          ? COLORS.surfaceAlt
                          : COLORS.bg,
                        borderWidth: isActive ? 2 : 1,
                        borderColor: isActive ? COLORS.primary : COLORS.cardBorder,
                      }}
                    >
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Text
                          style={{
                            color: isActive ? COLORS.primaryDark : COLORS.text,
                            fontWeight: isActive ? "700" : "500",
                            fontSize: 14,
                          }}
                        >
                          {tier.days}+ Days
                        </Text>
                        {isActive && (
                          <View
                            style={{
                              backgroundColor: COLORS.primary,
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 10,
                            }}
                          >
                            <Text
                              style={{
                                color: COLORS.white,
                                fontSize: 10,
                                fontWeight: "700",
                                textTransform: "uppercase",
                              }}
                            >
                              Active
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text
                        style={{
                          color: isActive ? COLORS.primaryDark : COLORS.primary,
                          fontWeight: "800",
                          fontSize: 15,
                        }}
                      >
                        {tier.multiplier}
                      </Text>
                    </View>
                  );
                })}

                {/* Negative Streak Warnings */}
                {streakData.negativeStreak > 0 && (
                  <View
                    style={{
                      marginTop: 14,
                      backgroundColor: "#FFEBEE",
                      padding: 12,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#FFCDD2",
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.danger,
                        fontSize: 13,
                        fontWeight: "700",
                      }}
                    >
                      Current Negative Streak: {streakData.negativeStreak} Days
                    </Text>
                  </View>
                )}

                {/* Penalty Tiers as requested: -300, -200, -1000 */}
                <View style={{ marginTop: 16 }}>
                  <Text
                    style={{
                      color: COLORS.textSecondary,
                      fontSize: 12,
                      fontWeight: "600",
                      marginBottom: 8,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Penalty Tiers (Missed Daily Target)
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      marginBottom: 4,
                      borderRadius: 8,
                      backgroundColor: COLORS.bg,
                    }}
                  >
                    <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>
                      Daily Miss (&lt; {GOAL} pts)
                    </Text>
                    <Text style={{ color: COLORS.danger, fontWeight: "700", fontSize: 13 }}>
                      -10 pts
                    </Text>
                  </View>

                  {negTiers.map((tier) => (
                    <View
                      key={tier.days}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginBottom: 4,
                        borderRadius: 8,
                        backgroundColor:
                          streakData.negativeStreak >= tier.days
                            ? "#FFEBEE"
                            : COLORS.bg,
                        borderWidth: 1,
                        borderColor:
                          streakData.negativeStreak >= tier.days
                            ? "#FFCDD2"
                            : COLORS.cardBorder,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            streakData.negativeStreak >= tier.days
                              ? COLORS.danger
                              : COLORS.text,
                          fontWeight:
                            streakData.negativeStreak >= tier.days
                              ? "700"
                              : "400",
                          fontSize: 13,
                        }}
                      >
                        {tier.days}+ Days Missed
                      </Text>
                      <Text
                        style={{
                          color: tier.color,
                          fontWeight: "700",
                          fontSize: 13,
                        }}
                      >
                        {tier.penalty}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </ScrollView>
      )}

      {/* ── SUBTAB 2: COMPLETED (MERGED) ── */}
      {activeSubTab === "Completed" && (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          {/* Date Picker Button */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={{
              backgroundColor: COLORS.white,
              padding: 12,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderWidth: 1,
              borderColor: COLORS.border,
              marginVertical: 10,
            }}
          >
            <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "500" }}>
              {selectedDate.toDateString()}
            </Text>
            <Ionicons name="calendar" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={onDateChange}
            />
          )}

          {/* Total Points & Earnings for selected day */}
          <View
            style={{
              backgroundColor: COLORS.surface,
              padding: 14,
              borderRadius: 12,
              marginBottom: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: COLORS.primary,
              }}
            >
              Total Points: {completedData?.totalPoints ?? 0} pts
            </Text>
            {completedData?.totalPoints > GOAL ? (
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: COLORS.primaryDark,
                  marginTop: 4,
                }}
              >
                Earnings: +{completedData.totalPoints - GOAL} pts (above {GOAL})
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: COLORS.textSecondary,
                  marginTop: 4,
                }}
              >
                {GOAL - (completedData?.totalPoints ?? 0)} pts needed to reach goal & start earning
              </Text>
            )}
          </View>

          {/* Completed Tasks List */}
          {loadingCompleted ? (
            <ActivityIndicator color={COLORS.primary} size="large" style={{ marginTop: 40 }} />
          ) : completedData?.tasks?.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Ionicons name="calendar-outline" size={48} color={COLORS.textMuted} />
              <Text style={{ color: COLORS.textMuted, marginTop: 12, fontSize: 14 }}>
                No tasks completed on this day
              </Text>
            </View>
          ) : (
            <FlatList
              data={completedData?.tasks || []}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item }) => (
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 14,
                    borderRadius: 12,
                    marginBottom: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: COLORS.cardBorder,
                    elevation: 1,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: COLORS.text, fontSize: 15, fontWeight: "500" }}>
                      {item.name}
                    </Text>
                    <Text style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 2 }}>
                      {item.taskType}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: COLORS.primary,
                      fontWeight: "700",
                      fontSize: 15,
                      marginLeft: 10,
                    }}
                  >
                    +{item.rewardPoints}
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}

// Small stat card helper component
function StatCard({ label, value, color, suffix = "" }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 14,
        marginHorizontal: 4,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <Text
        style={{
          color: color,
          fontSize: 22,
          fontWeight: "800",
        }}
      >
        {value}
        {suffix && (
          <Text style={{ fontSize: 12, fontWeight: "500" }}>{suffix}</Text>
        )}
      </Text>
      <Text
        style={{
          color: COLORS.textSecondary,
          fontSize: 11,
          marginTop: 4,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
