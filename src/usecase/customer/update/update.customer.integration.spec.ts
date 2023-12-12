import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../Infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../Infrastructure/customer/repository/sequelize/customer.repository";
import UpdateCustomerUseCase from "./update.customer.usecase";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";

describe("Integration test update a customer use case", () => {
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

    it("should update a product", async () => {        
        const customerRepository = new CustomerRepository();

        const input = {
            id: "1",
            name: "Customer 1",
            address: {
                street: "Street 1",
                number: 12,
                zip: "Zip",
                city: "City",
            },
        };  
        
        const inputNewValues = {
            id: "1",
            name: "Customer 2",
            address: {
                street: "Street 2",
                number: 24,
                zip: "Zip",
                city: "City",
            },
        };

        const customer = new Customer(input.id, input.name);
        const address = new Address(
            input.address.street,
            input.address.number, 
            input.address.zip, 
            input.address.city
        );
        customer.changeAddress(address);

        await customerRepository.create(customer); 
        
        customer.changeName(inputNewValues.name);
        const address2 = new Address(
            inputNewValues.address.street,
            inputNewValues.address.number, 
            inputNewValues.address.zip, 
            inputNewValues.address.city
        );
        customer.changeAddress(address2);
        await customerRepository.update(customer);           
          
        const usecase = new UpdateCustomerUseCase(customerRepository);

        const output = await usecase.execute(inputNewValues);

        expect(output).toEqual(inputNewValues);        
    });
    
});

