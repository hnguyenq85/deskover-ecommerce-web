import {Subcategory} from "@/entites/subcategory";

export interface SubcategoryDto {
  id: number;
  name: string;
  description: string;
  slug: string;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date;
  actived: boolean;
  categoryId: number;
}
