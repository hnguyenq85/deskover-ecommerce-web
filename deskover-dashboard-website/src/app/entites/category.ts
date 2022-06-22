// Tạo interface danh mục sản phẩm
import {Subcategory} from "@/entites/subcategory";
import {SubcategoryDto} from "@/dtos/subcategory-dto";

export interface Category {
  id: number;
  name: string;
  description: string;
  slug: string;
  createdAt: Date;
  modifiedAt: Date;
  deletedAt: Date;
  actived: boolean;
  subcategory: Subcategory;

}
