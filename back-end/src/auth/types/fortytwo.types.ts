export interface FortytwoImage {
  link: string;
}
export interface FortytwoUser {
  id: number;
  login: string;
  first_name: string;
  last_name: string;
  image: FortytwoImage;
}
