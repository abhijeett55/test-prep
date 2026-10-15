import { client } from "../../client";
import type { AnnouncementRow } from "../../types";

export interface AnnouncementCreate {
  title: string;
  body: string;
  scope: "INSTITUTE" | "BATCH";
  batch_id?: string | null;
}

export interface AnnouncementUpdate {
  title?: string;
  body?: string;
  batch_id?: string | null;
}

export interface ListAnnouncementsParams {
  scope?: "INSTITUTE" | "BATCH";
  batch_id?: string;
  limit?: number;
  offset?: number;
}

export async function listAnnouncements(
  params: ListAnnouncementsParams = {}
): Promise<AnnouncementRow[]> {
  const { data } = await client.get<AnnouncementRow[]>("/announcements", {
    params,
  });
  return data;
}

export async function getAnnouncement(id: string): Promise<AnnouncementRow> {
  const { data } = await client.get<AnnouncementRow>(`/announcements/${id}`);
  return data;
}

export async function createAnnouncement(
  payload: AnnouncementCreate
): Promise<AnnouncementRow> {
  const { data } = await client.post<AnnouncementRow>("/announcements", payload);
  return data;
}

export async function updateAnnouncement(
  id: string,
  payload: AnnouncementUpdate
): Promise<AnnouncementRow> {
  const { data } = await client.patch<AnnouncementRow>(
    `/announcements/${id}`,
    payload
  );
  return data;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await client.delete(`/announcements/${id}`);
}

export async function publishAnnouncement(id: string): Promise<AnnouncementRow> {
  const { data } = await client.post<AnnouncementRow>(
    `/announcements/${id}/publish`
  );
  return data;
}