export interface CreateUserDTO {
  fullName: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  fullName?: string;
  profilePic?: string;
}

export interface UserPublicDTO {
  id: string;
  fullName: string;
  email: string;
  profilePic?: string | null;
  role: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
