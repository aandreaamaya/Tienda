import { DtoProductList } from "../../product/_dto/dto-product-list";
import { Product } from "../../product/_model/product";

export class DtoCartDetails {
    cart_id: number = 0;
    gtin: string = "";
    quantity: number = 0;
    product: DtoProductList = new DtoProductList();
    image: string = "";


}