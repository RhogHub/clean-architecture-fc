import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../Infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../Infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Integration test for listing product use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list a product", async () => {        
        const productRepository = new ProductRepository();
        const usecase = new ListProductUseCase(productRepository);

        const product1 = new Product("3", "Mouse", 33.33);
        await productRepository.create(product1);

        const product2 = new Product("5", "Teclado", 150.00);       
        await productRepository.create(product2);
 
        const output = await usecase.execute({});

        expect(output.products.length).toBe(2);

        expect(output.products[0].id).toBe(product1.id);
        expect(output.products[0].name).toBe(product1.name);
        expect(output.products[0].price).toBe(product1.price);
        expect(output.products[1].id).toBe(product2.id);
        expect(output.products[1].name).toBe(product2.name);
        expect(output.products[1].price).toBe(product2.price);
    });
    
});
