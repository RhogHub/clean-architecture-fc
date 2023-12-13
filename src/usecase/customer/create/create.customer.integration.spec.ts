import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import CreateCustomerUseCase from "./create.customer.usecase";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";

describe("Integration test create a customer use case", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customerCreateUseCase = new CreateCustomerUseCase(customerRepository);

        const input = {
            id: "123",
            name: "Customer 1",
            address: {
                street: "Street",
                number: 1233,
                zip: "Zip",
                city: "City",
            },
        };    
        
        const customer = new Customer(input.id, input.name);
        const address = new Address(input.address.street,input.address.number, input.address.zip, input.address.city);
        customer.changeAddress(address);

        await customerRepository.create(customer);      

        const output = await customerCreateUseCase.execute(input);        

        expect(output).toEqual({
            id: expect.any(String),
            name: input.name,
            address: {
                street: input.address.street,
                number: input.address.number,
                city: input.address.city,
                zip: input.address.zip
            },
        });
    });

});