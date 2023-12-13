import { app, sequelize } from '../express';
import request from "supertest";

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({force: true});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                type: "a",
                name: "Teclado",
                price: 133.33,                
            });
        
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Teclado");
        expect(response.body.price).toBe(133.33);        
    });

    it("should not create a product",async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "",               
            });
        expect(response.status).toBe(500);
    });

    it("should not create a product",async () => {
        const response = await request(app)
            .post("/product")
            .send({
                type: "x",               
            });
        expect(response.status).toBe(500);
    });   

    it("should list all products",async () => {
        const response1 = await request(app)
            .post("/product")
            .send({
                type: "a",
                name: "Mouse",
                price: 33.33,                
            });        
        expect(response1.status).toBe(200);

        const response2 = await request(app)
            .post("/product")
            .send({
                type: "a",
                name: "Teclado",
                price: 133.33,                
            });        
        expect(response2.status).toBe(200);

        const listResponse = await request(app).get("/product").send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);
        const product1 = listResponse.body.products[0];
        expect(product1.name).toBe("Mouse");
        expect(product1.price).toBe(33.33);
        const product2 = listResponse.body.products[1];
        expect(product2.name).toBe("Teclado");
        expect(product2.price).toBe(133.33);        
    });

});
