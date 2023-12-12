import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../Infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../Infrastructure/product/repository/sequelize/product.repository";
import CreateProductUseCase from "./create.product.usecase";
import Product from "../../../domain/product/entity/product";

describe("Integration test create a product use case", () => {
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

    it("should create a product", async () => {
        const productRepository = new ProductRepository();
        const usecase = new CreateProductUseCase(productRepository);

        const input = {
            type: "a",
            id: "3",
            name: "Mouse",
            price: 33.33
        };

        const product = new Product(input.id, input.name, input.price);        

        await productRepository.create(product);

        const output = await usecase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: "Mouse",
            price: 33.33
        });
    });

});
