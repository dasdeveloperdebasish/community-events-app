export type Category = "Music" | "Sports" | "Tech" | "Food" | "Other";

export interface Event {
  id: string;
  title: string;
  category: Category;
  description: string;
  date: string;
  location: string;
  attendeeCount: number;
  hostName: string;
  hostAvatar: string;
  imageUrl: string;
  isRSVPed?: boolean;
  isCustom?: boolean;
}
