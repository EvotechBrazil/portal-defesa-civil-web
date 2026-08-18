import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  CourseDetail,
  CourseListItem,
  CoursePage,
  Enrollment,
} from "../types/catalog.types";

export async function listCourses(params?: { page?: number; pageSize?: number }) {
  const response = await api.get<ApiEnvelope<CourseListItem[]>>("/courses", { params });
  return response.data;
}

export async function getCourse(slug: string) {
  const response = await api.get<ApiEnvelope<CourseDetail>>(`/courses/${slug}`);
  return response.data;
}

export async function getCoursePage(slug: string, pageSlug: string) {
  const response = await api.get<ApiEnvelope<CoursePage>>(
    `/courses/${slug}/pages/${pageSlug}`,
  );
  return response.data;
}

export async function enrollInCourse(slug: string) {
  const response = await api.post<ApiEnvelope<Enrollment>>(`/courses/${slug}/enroll`);
  return response.data;
}
