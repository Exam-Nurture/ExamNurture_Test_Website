/**
 * ExamNurture API client
 *
 * - Stores access token in a JS-readable cookie `en_token` (readable by middleware)
 * - Refresh token is httpOnly (set/cleared by backend automatically)
 * - Auto-refreshes on 401 and retries the original request once
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

const TOKEN_COOKIE = "en_token";

/* ── Token helpers ──────────────────────────────── */

export function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setToken(token: string) {
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${15 * 60}; SameSite=Lax`;
}

export function clearToken() {
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

/* ── Core fetch wrapper ─────────────────────────── */

let refreshing: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json();
    setToken(data.accessToken);
    return true;
  } catch {
    return false;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 && retry) {
    if (!refreshing) refreshing = doRefresh().finally(() => { refreshing = null; });
    const ok = await refreshing;
    if (ok) return apiFetch<T>(path, options, false);
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Session expired");
  }

  if (!res.ok) {
    let body: { error?: { message?: string } } = {};
    try { body = await res.json(); } catch { /* empty */ }
    throw new ApiError(res.status, body?.error?.message ?? res.statusText);
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/* ── Auth endpoints ─────────────────────────────── */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  isVerified: boolean;
  role: "STUDENT" | "ADMIN";
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }, false);
  setToken(data.accessToken);
  return data;
}

export async function apiRegister(body: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  }, false);
  setToken(data.accessToken);
  return data;
}

export async function apiLogout(): Promise<void> {
  try {
    const token = getToken();
    await fetch(`${BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  } finally {
    clearToken();
  }
}

/* ── User endpoints ─────────────────────────────── */

export interface UserProfile extends AuthUser {
  phone?: string;
  hasGoogle?: boolean;
  subscription?: {
    id: string;
    tierLevel: number;
    billingCycle: "MONTHLY" | "YEARLY";
    status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "PAUSED";
    currentPeriodEnd: string;
  } | null;
  stats: {
    attempts: number;
    bookmarks: number;
    streakCurrent: number;
    streakLongest: number;
    attendedTestSeries: number;
    attendedPYQ: number;
  };
}

export async function apiGoogleAuth(credential: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  }, false);
  setToken(data.accessToken);
  return data;
}

export async function apiUpdateProfile(body: {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}): Promise<UserProfile> {
  return apiFetch("/user/profile", { method: "PATCH", body: JSON.stringify(body) });
}

export async function apiGetProfile(): Promise<UserProfile> {
  return apiFetch("/user/profile");
}

export interface DashboardData {
  streak: { current: number; longest: number };
  dailyPractice: { available: boolean; count: number };
  upcomingTests: { id: string; title: string; scheduledAt: string; durationSec: number }[];
  recentAttempts: {
    id: string;
    score: number;
    totalMarks: number;
    timeTakenSec: number;
    completedAt: string;
    test: { id: string; title: string; totalMarks: number };
  }[];
  liveEvents: {
    id: string;
    title: string;
    host: string;
    scheduledAt: string;
    durationMin: number;
    isLive: boolean;
    registeredCount: number;
  }[];
}

export async function apiGetDashboard(): Promise<DashboardData> {
  return apiFetch("/user/dashboard");
}

export interface AnalyticsData {
  weakTopics: { topicName: string; examId: string; strength: number; status: string }[];
  attemptHistory: { id: string; score: number; totalMarks: number; completedAt: string }[];
  scoreProgress: { date: string; score: number; totalMarks: number }[];
  examBreakdown: Record<string, { count: number; avgScore: number }>;
}

export async function apiGetAnalytics(): Promise<AnalyticsData> {
  return apiFetch("/user/analytics");
}

/* ── Subscription endpoints ─────────────────────── */

export interface CheckoutResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string | null;
  tierLevel: number;
  billingCycle: string;
}

export async function apiCheckout(tierLevel: number, billingCycle: "MONTHLY" | "YEARLY"): Promise<CheckoutResponse> {
  return apiFetch("/subscription/checkout", {
    method: "POST",
    body: JSON.stringify({ tierLevel, billingCycle }),
  });
}

export async function apiVerifyPayment(data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  tierLevel: number;
  billingCycle: "MONTHLY" | "YEARLY";
}): Promise<{ success: boolean }> {
  return apiFetch("/subscription/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiGetSubscriptionStatus() {
  return apiFetch<{ active: boolean; subscription: UserProfile["subscription"] }>("/subscription/status");
}

export async function apiCancelSubscription() {
  return apiFetch("/subscription/cancel", { method: "POST" });
}

/* ── Exams / Boards ─────────────────────────────── */

export async function apiGetBoards(params?: { tier?: number }) {
  const qs = params?.tier ? `?tier=${params.tier}` : "";
  return apiFetch(`/boards${qs}`);
}

export async function apiGetExams(params?: { board?: string; tier?: number }) {
  const qs = new URLSearchParams();
  if (params?.board) qs.set("board", params.board);
  if (params?.tier) qs.set("tier", String(params.tier));
  const s = qs.toString();
  return apiFetch(`/exams${s ? `?${s}` : ""}`);
}

/* ── Tests ─────────────────────────────────────── */

export async function apiGetTestSeries(params?: { examId?: string; page?: number; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.examId) qs.set("examId", params.examId);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));
  const s = qs.toString();
  return apiFetch(`/test-series${s ? `?${s}` : ""}`);
}

export async function apiSubmitAttempt(
  testId: string,
  answers: Record<string, number>,
  timeTakenSec: number,
) {
  return apiFetch(`/attempts/${testId}/submit`, {
    method: "POST",
    body: JSON.stringify({ testId, answers, timeTakenSec }),
  });
}



/* ── Daily Practice ─────────────────────────────── */

export async function apiGetDailyPractice() {
  return apiFetch("/daily-practice");
}

export async function apiSubmitDailyPractice(answers: Record<string, number>) {
  return apiFetch("/daily-practice/submit", {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}

/* ── Bookmarks ──────────────────────────────────── */

export async function apiGetBookmarks() { return apiFetch("/bookmarks"); }
export async function apiAddBookmark(questionId: string) {
  return apiFetch("/bookmarks", { method: "POST", body: JSON.stringify({ questionId }) });
}
export async function apiRemoveBookmark(questionId: string) {
  return apiFetch(`/bookmarks/${questionId}`, { method: "DELETE" });
}

/* ── Events ─────────────────────────────────────── */

export async function apiGetEvents(upcoming = true) {
  return apiFetch(`/events${upcoming ? "?upcoming=true" : ""}`);
}

/* ── Admin ──────────────────────────────────────── */

export interface AdminLoginResponse {
  accessToken: string;
  user: AuthUser;
}

export async function apiAdminLogin(email: string, password: string): Promise<AdminLoginResponse> {
  const data = await apiFetch<AdminLoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }, false);
  setToken(data.accessToken);
  return data;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

function buildQS(params: Record<string, string | number | boolean | undefined>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

interface AdminPaymentRow {
  id: string; amountPaise: number; status: string; createdAt: string;
  user?: { name: string; email: string };
}

// Dashboard
export async function apiAdminDashboard() {
  return apiFetch<{
    stats: Record<string, number>;
    recentUsers: AuthUser[];
    recentPayments: AdminPaymentRow[];
  }>("/admin/dashboard");
}

// Users
export async function apiAdminGetUsers(params?: { page?: number; limit?: number; search?: string }) {
  return apiFetch<PaginatedResponse<AuthUser>>(`/admin/users${buildQS(params ?? {})}`);
}
export async function apiAdminUpdateUser(id: string, body: Record<string, unknown>) {
  return apiFetch(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}
export async function apiAdminDeleteUser(id: string) {
  return apiFetch(`/admin/users/${id}`, { method: "DELETE" });
}

// States
export async function apiAdminGetStates() {
  return apiFetch<PaginatedResponse<{ id: number; name: string }>>("/admin/states");
}
export async function apiAdminCreateState(name: string) {
  return apiFetch("/admin/states", { method: "POST", body: JSON.stringify({ name }) });
}
export async function apiAdminDeleteState(id: number) {
  return apiFetch(`/admin/states/${id}`, { method: "DELETE" });
}

// Boards
export interface AdminBoard {
  id: string; name: string; shortName: string; description: string;
  tint: string; colorSoft: string; minTier: number; stateId?: number;
  logoUrl?: string; website?: string; isActive: boolean;
}
export async function apiAdminGetBoards(params?: { page?: number; limit?: number }) {
  return apiFetch<PaginatedResponse<AdminBoard>>(`/admin/boards${buildQS(params ?? {})}`);
}
export async function apiAdminCreateBoard(body: Partial<AdminBoard>) {
  return apiFetch("/admin/boards", { method: "POST", body: JSON.stringify(body) });
}
export async function apiAdminUpdateBoard(id: string, body: Partial<AdminBoard>) {
  return apiFetch(`/admin/boards/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}
export async function apiAdminDeleteBoard(id: string) {
  return apiFetch(`/admin/boards/${id}`, { method: "DELETE" });
}

// Exams
export interface AdminExam {
  id: string; boardId: string; name: string; shortName: string; fullName?: string;
  tier: number; eligibility: string; pattern: string; subjects: string;
  hasTests: boolean; hasPYQ: boolean; hasGuide: boolean; isFeatured: boolean; isActive: boolean;
  upcomingDate?: string; applicationFee?: string; notificationUrl?: string;
}
export async function apiAdminGetExams(params?: { page?: number; limit?: number; boardId?: string }) {
  return apiFetch<PaginatedResponse<AdminExam>>(`/admin/exams${buildQS(params ?? {})}`);
}
export async function apiAdminCreateExam(body: Partial<AdminExam>) {
  return apiFetch("/admin/exams", { method: "POST", body: JSON.stringify(body) });
}
export async function apiAdminUpdateExam(id: string, body: Partial<AdminExam>) {
  return apiFetch(`/admin/exams/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}
export async function apiAdminDeleteExam(id: string) {
  return apiFetch(`/admin/exams/${id}`, { method: "DELETE" });
}

// Test Series
export interface AdminTestSeries {
  id: string; examId: string; title: string; description?: string;
  totalTests: number; tierRequired: number; isPaid: boolean; isFeatured: boolean;
  isActive: boolean; price: number; discountedPrice?: number;
}
export async function apiAdminGetTestSeries(params?: { page?: number; limit?: number; examId?: string }) {
  return apiFetch<PaginatedResponse<AdminTestSeries>>(`/admin/test-series${buildQS(params ?? {})}`);
}
export async function apiAdminCreateTestSeries(body: Partial<AdminTestSeries>) {
  return apiFetch("/admin/test-series", { method: "POST", body: JSON.stringify(body) });
}
export async function apiAdminUpdateTestSeries(id: string, body: Partial<AdminTestSeries>) {
  return apiFetch(`/admin/test-series/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}
export async function apiAdminDeleteTestSeries(id: string) {
  return apiFetch(`/admin/test-series/${id}`, { method: "DELETE" });
}

// Tests
export interface AdminTest {
  id: string; seriesId: string; title: string; durationSec: number;
  totalMarks: number; negMarks: number; tierRequired: number; isActive: boolean;
}
export async function apiAdminGetTests(params?: { page?: number; seriesId?: string }) {
  return apiFetch<PaginatedResponse<AdminTest>>(`/admin/tests${buildQS(params ?? {})}`);
}
export async function apiAdminCreateTest(body: Partial<AdminTest>) {
  return apiFetch("/admin/tests", { method: "POST", body: JSON.stringify(body) });
}
export async function apiAdminUpdateTest(id: string, body: Partial<AdminTest>) {
  return apiFetch(`/admin/tests/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}
export async function apiAdminDeleteTest(id: string) {
  return apiFetch(`/admin/tests/${id}`, { method: "DELETE" });
}
export async function apiAdminAddQuestionsToTest(testId: string, questionIds: string[]) {
  return apiFetch(`/admin/tests/${testId}/questions`, { method: "POST", body: JSON.stringify({ questionIds }) });
}

// Questions
export interface AdminQuestion {
  id: string; text: string; textHindi?: string; options: string; correctIndex: number;
  explanation?: string; subject?: string; topic?: string; difficulty: string;
  language: string; source?: string; year?: number; examId?: string;
}
export async function apiAdminGetQuestions(params?: { page?: number; limit?: number; subject?: string; examId?: string }) {
  return apiFetch<PaginatedResponse<AdminQuestion>>(`/admin/questions${buildQS(params ?? {})}`);
}
export async function apiAdminCreateQuestion(body: Partial<AdminQuestion>) {
  return apiFetch("/admin/questions", { method: "POST", body: JSON.stringify(body) });
}
export async function apiAdminUpdateQuestion(id: string, body: Partial<AdminQuestion>) {
  return apiFetch(`/admin/questions/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}
export async function apiAdminDeleteQuestion(id: string) {
  return apiFetch(`/admin/questions/${id}`, { method: "DELETE" });
}

// PYQ Papers
export interface AdminPYQPaper {
  id: string; examId: string; title: string; year: number; shift?: string;
  totalQs: number; durationMin: number; pdfUrl?: string; type: string;
  hasSolutions: boolean; tierRequired: number; isActive: boolean;
}
export async function apiAdminGetPYQ(params?: { page?: number; examId?: string }) {
  return apiFetch<PaginatedResponse<AdminPYQPaper>>(`/admin/pyq${buildQS(params ?? {})}`);
}
export async function apiAdminCreatePYQ(body: Partial<AdminPYQPaper>) {
  return apiFetch("/admin/pyq", { method: "POST", body: JSON.stringify(body) });
}
export async function apiAdminUpdatePYQ(id: string, body: Partial<AdminPYQPaper>) {
  return apiFetch(`/admin/pyq/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}
export async function apiAdminDeletePYQ(id: string) {
  return apiFetch(`/admin/pyq/${id}`, { method: "DELETE" });
}

// Study Materials
export interface AdminStudyMaterial {
  id: string; examId: string; subject: string; title: string; description?: string;
  buyLink?: string; language: string; pageCount: number; coverUrl?: string;
  tierRequired: number; isActive: boolean; isFeatured: boolean;
}
export async function apiAdminGetStudyMaterials(params?: { page?: number; examId?: string }) {
  return apiFetch<PaginatedResponse<AdminStudyMaterial>>(`/admin/study-materials${buildQS(params ?? {})}`);
}
export async function apiAdminCreateStudyMaterial(body: Partial<AdminStudyMaterial>) {
  return apiFetch("/admin/study-materials", { method: "POST", body: JSON.stringify(body) });
}
export async function apiAdminUpdateStudyMaterial(id: string, body: Partial<AdminStudyMaterial>) {
  return apiFetch(`/admin/study-materials/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}
export async function apiAdminDeleteStudyMaterial(id: string) {
  return apiFetch(`/admin/study-materials/${id}`, { method: "DELETE" });
}

// Mentorship Programs
export interface AdminMentorship {
  id: string; examId: string; title: string; description?: string;
  price: number; discountedPrice?: number; buyUrl?: string;
  mentorName: string; mentorTitle?: string; courseDurationWeeks: number;
  tierRequired: number; isActive: boolean; isFeatured: boolean;
}
export async function apiAdminGetMentorship(params?: { page?: number }) {
  return apiFetch<PaginatedResponse<AdminMentorship>>(`/admin/mentorship${buildQS(params ?? {})}`);
}
export async function apiAdminCreateMentorship(body: Partial<AdminMentorship>) {
  return apiFetch("/admin/mentorship", { method: "POST", body: JSON.stringify(body) });
}
export async function apiAdminUpdateMentorship(id: string, body: Partial<AdminMentorship>) {
  return apiFetch(`/admin/mentorship/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}
export async function apiAdminDeleteMentorship(id: string) {
  return apiFetch(`/admin/mentorship/${id}`, { method: "DELETE" });
}



// Live Events
export interface AdminLiveEvent {
  id: string; title: string; description?: string; host: string; hostRole: string;
  scheduledAt: string; durationMin: number; isLive: boolean;
  meetUrl?: string; tierRequired: number; isActive: boolean;
}
export async function apiAdminGetEvents(params?: { page?: number }) {
  return apiFetch<PaginatedResponse<AdminLiveEvent>>(`/admin/events${buildQS(params ?? {})}`);
}
export async function apiAdminCreateEvent(body: Partial<AdminLiveEvent>) {
  return apiFetch("/admin/events", { method: "POST", body: JSON.stringify(body) });
}
export async function apiAdminUpdateEvent(id: string, body: Partial<AdminLiveEvent>) {
  return apiFetch(`/admin/events/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}
export async function apiAdminDeleteEvent(id: string) {
  return apiFetch(`/admin/events/${id}`, { method: "DELETE" });
}

// Team Members
export interface AdminTeamMember {
  id: string; name: string; role: string; photoUrl?: string; bio?: string;
  linkedinUrl?: string; twitterUrl?: string; email?: string;
  displayOrder: number; isActive: boolean;
}
export async function apiAdminGetTeam(params?: { page?: number }) {
  return apiFetch<PaginatedResponse<AdminTeamMember>>(`/admin/team${buildQS(params ?? {})}`);
}
export async function apiAdminCreateTeamMember(body: Partial<AdminTeamMember>) {
  return apiFetch("/admin/team", { method: "POST", body: JSON.stringify(body) });
}
export async function apiAdminUpdateTeamMember(id: string, body: Partial<AdminTeamMember>) {
  return apiFetch(`/admin/team/${id}`, { method: "PATCH", body: JSON.stringify(body) });
}
export async function apiAdminDeleteTeamMember(id: string) {
  return apiFetch(`/admin/team/${id}`, { method: "DELETE" });
}

/* ── Public contact form ────────────────────────── */

export async function apiSubmitContact(body: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ message: string }> {
  const res = await fetch(`${BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let err = { error: { message: "" } };
    try { err = await res.json(); } catch { /* empty */ }
    throw new ApiError(res.status, err?.error?.message ?? "Failed to send message");
  }
  return res.json();
}

// Contact Messages
export interface AdminContactMessage {
  id: string; name: string; email: string; subject: string; message: string;
  isResolved: boolean; resolvedAt?: string; createdAt: string;
}
export async function apiAdminGetContact(params?: { page?: number; unresolved?: boolean }) {
  return apiFetch<PaginatedResponse<AdminContactMessage>>(`/admin/contact${buildQS(params ?? {})}`);
}
export async function apiAdminResolveContact(id: string) {
  return apiFetch(`/admin/contact/${id}/resolve`, { method: "PATCH" });
}
export async function apiAdminDeleteContact(id: string) {
  return apiFetch(`/admin/contact/${id}`, { method: "DELETE" });
}

// Subscriptions & Payments (read-only)
export async function apiAdminGetSubscriptions(params?: { page?: number }) {
  return apiFetch<PaginatedResponse<unknown>>(`/admin/subscriptions${buildQS(params ?? {})}`);
}
export async function apiAdminGetPayments(params?: { page?: number }) {
  return apiFetch<PaginatedResponse<unknown>>(`/admin/payments${buildQS(params ?? {})}`);
}
