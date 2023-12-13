import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import UpdateProductUseCase from "./update.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Integration test update a product use case", () => {
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

    it("should update a product", async () => {        
        const productRepository = new ProductRepository();

        const input = {
            id: "3",
            name: "Mouse",
            price: 33.33
        };

        const newValues = {
            id: "3",
            name: "Teclado",
            price: 150.00
        };

        const product = new Product(input.id, input.name, input.price);
        await productRepository.create(product);
        
        const usecase = new UpdateProductUseCase(productRepository);

        const output = await usecase.execute(newValues);

        expect(output).toEqual(newValues);        
    });
    
});

