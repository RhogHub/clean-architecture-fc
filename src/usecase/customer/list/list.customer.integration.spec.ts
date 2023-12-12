import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../Infrastructure/customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../Infrastructure/customer/repository/sequelize/customer.repository";
import ListCustomerUseCase from "./list.customer.usecase";
import Customer from "../../../domain/customer/entity/customer";
import Address from "../../../domain/customer/value-object/address";

describe("Integration test for listing customer use case", () => {
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

    it("should list a customer", async () => {        
        const customerRepository = new CustomerRepository();
        const usecase = new ListCustomerUseCase(customerRepository);

        const input1 = {
            id: "1",
            name: "Customer 1",
            address: {
                street: "Street",
                number: 12,
                zip: "Zip",
                city: "City",
            },
        };  
        
        const input2 = {
            id: "2",
            name: "Customer 2",
            address: {
                street: "Street",
                number: 24,
                zip: "Zip",
                city: "City",
            },
        };

        const customer1 = new Customer(input1.id, input1.name);
        const address1 = new Address(
            input1.address.street,
            input1.address.number, 
            input1.address.zip, 
            input1.address.city
        );
        customer1.changeAddress(address1);

        await customerRepository.create(customer1);  

        const customer2 = new Customer(input2.id, input2.name);
        const address2 = new Address(
            input2.address.street,
            input2.address.number, 
            input2.address.zip, 
            input2.address.city
        );
        customer2.changeAddress(address2);

        await customerRepository.create(customer2);
 
        const output = await usecase.execute({});

        expect(output.customers.length).toBe(2);

        expect(output.customers[0].id).toBe(customer1.id);
        expect(output.customers[0].name).toBe(customer1.name);
        expect(output.customers[0].address.street).toBe(customer1.Address.street);
        expect(output.customers[0].address.number).toBe(customer1.Address.number);
        expect(output.customers[0].address.city).toBe(customer1.Address.city);
        expect(output.customers[0].address.zip).toBe(customer1.Address.zipcode);    

        expect(output.customers[1].id).toBe(customer2.id);
        expect(output.customers[1].name).toBe(customer2.name);
        expect(output.customers[1].address.street).toBe(customer2.Address.street);
        expect(output.customers[1].address.number).toBe(customer2.Address.number);
        expect(output.customers[1].address.city).toBe(customer2.Address.city);
        expect(output.customers[1].address.zip).toBe(customer2.Address.zipcode);        
    });
    
});
