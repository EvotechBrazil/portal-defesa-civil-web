export interface CourseListItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sourcePlatform: string | null;
  isEnrolled: boolean;
}

export interface CourseModule {
  id: string;
  code: string;
  title: string;
  ord: number;
  summaryMd: string | null;
  quizCount: number;
  questionCount: number;
}

export interface CoursePageIndex {
  slug: string;
  title: string;
  ord: number;
}

export interface CourseDetail {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sourcePlatform: string | null;
  isEnrolled: boolean;
  modules: CourseModule[];
  pages: CoursePageIndex[];
}

export interface CoursePage {
  slug: string;
  title: string;
  bodyMd: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  tenantId: string;
  courseId: string;
  startedAt: string;
  completedAt: string | null;
}
