import express, { query } from "express";
import ProductManager from "../dao/productManager.js";

const router = express.Router();
//crea una instancia del ProductManager
const productManager = new ProductManager();


//Obtener todos los productos
router.get("/", (req, res) => {
    //se obtiene los parametros
    let limit = parseInt(req.query.limit);
    let page = parseInt(req.query.page);
    let sort = parseInt(req.query.sort);
    let status = req.query.status;
    let category = req.query.category;
    //se asigna un limite por default
    limit = limit ? limit : 10;
    //se asigna una pagina por default
    page = page ? page : 1;
    if (sort) sort = sort == -1 ? "desc" : "asc";
    
    //se guardan los parametros en un objeto
    const params = {
        limit,
        page,
        sort,
        status,
        category,
    };
    
     //Llama el método getProducts
  //si la promesa es exitosa manda el resultado
  //sino manda un mensaje de error
  productManager
  .getProducts(params)
  .then((products) => {
    //se manda el respond con las propiedades del paginate
    res.send({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage
        ? `/products?page=${products.prevPage}`
        : null,
      nextLink: products.hasNextPage
        ? `/products?page=${products.nextPage}`
        : null,
    });
  })
  .catch((error) =>
    res.send({
      status: "error",
      error: "Error al obtener los productos, " + error,
    })
  );
});


export default router;