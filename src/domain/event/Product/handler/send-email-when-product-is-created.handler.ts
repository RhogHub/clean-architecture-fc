import EventHandlerInterface from "../../@shared/event-handler.interface";
import ProductCreatedEvent from "../product-created.event";

export default class SendEmailWhenProductIsCreatedHandler implements 
EventHandlerInterface<ProductCreatedEvent> {
    handle(event: ProductCreatedEvent): void {
        //console.log(`sending email to ${event.eventData.email}`);
        console.log(`sending email to .....`); //Enviando para o Rabbitmq
    }
}