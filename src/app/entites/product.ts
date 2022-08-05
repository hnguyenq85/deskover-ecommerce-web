import {Subcategory} from "@/entites/subcategory";
import {Brand} from "@/entites/brand";
import {Discount} from "@/entites/discount";

export interface Product {
  id: number
  name: string
  weight: number
  slug: string
  description: string
  price: number
  priceSale: number
  img: string
  imgUrl: string
  quantity: number
  modifiedAt: Date
  modifiedBy: string
  actived: boolean
  spec: string
  utility: string
  design: string
  other: string
  video: string
  subCategory: Subcategory
  brand: Brand
  discount: Discount
  productThumbnails: ProductThumbnail[]
}

export interface ProductThumbnail {
  id: number
  thumbnail: string
  thumbnailUrl: string
  modifiedAt: Date
  modifiedBy: string
}

