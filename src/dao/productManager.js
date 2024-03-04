import fs from "fs";
import productModel from "./models/product.model.js";


export default class ProductManager {
    constructor() {}
  
    /**
     * Método addProduct busca en la base de datos si el producto ya existe con base en
     * el "code", si no existe, lo añade a la BD.
     * @param {*} newProduct un objeto de producto
     * @returns Promise, ya sea el producto o el rechazado con el mensaje de error.
     */
    async addProduct(newProduct) {
      let productDB = await productModel.findOne({ code: newProduct.code });
  
      //Si el codigo del producto ya existe significa que el prodycto ya existe.
      if (productDB) {
        console.log(
          `El producto con el código "${newProduct.code}" ya existe, no se agregará a la base de datos".`
        );
        return Promise.reject(
          `El producto con el código "${newProduct.code}" ya existe, no se agregará a la base de datos".`
        );
      }
  
      //Si hay campos vacíos, rechaza la promesa y manda un mensaje para que se completen todos los campos.
      if (
        !(
          newProduct.title &&
          newProduct.description &&
          newProduct.code &&
          newProduct.price &&
          newProduct.stock &&
          newProduct.category
        )
      ) {
        console.log(
          "Los campos title, description, code, price, stock y category son requeridos."
        );
  
        return Promise.reject(
          "Los campos title, description, code, price, stock y category son requeridos."
        );
      }
  
      //Si no trae un estatus por defecto, entonces el estatus es true
      const status = newProduct.status ? newProduct.status : true;
  
      //Crea un nuevo producto
      const product = { ...newProduct, status };
  
      try {
        //crea el documento en la colección de products con el producto recibido
        return await productModel.create({ ...product });
      } catch (error) {
        console.error("Error al crear el producto en la BD", error);
        return Promise.reject("Error al crear el producto en la BD, " + error);
      }
    }

    async getProducts(params) {
      try {
          const products = await productModel.find();
          return products;
      } catch (error) {
          throw new Error("Error al obtener los productos: " + error.message);
      }
  }
}

