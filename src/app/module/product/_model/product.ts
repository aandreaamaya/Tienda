import { ProductImage } from "./product-image";

export class Product{
    product_id: number = 0;
    name: string = "";
    surname: string = "";
    rfc: string = "";
    mail: string = "";
    address: string = "";
    category_id: number = 0;
    image: ProductImage = new ProductImage();
    status: number = 0;
}