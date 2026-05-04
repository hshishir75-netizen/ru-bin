
export interface ResourceButton {
  label: string;
  description: string;
  icon: string;
  link: string;
  color: string;
}

export interface UsefulLink {
  label: string;
  link: string;
  icon: string;
  bgColor: string;
  caption?: string;
}

export interface GalleryImage {
  url: string;
  caption: string;
}

export interface DeveloperInfo {
  name: string;
  bio: string;
  photo: string;
  email: string;
  phone: string;
  facebook: string;
  telegram: string;
  universityBatch: string;
  departmentBatch: string;
}
