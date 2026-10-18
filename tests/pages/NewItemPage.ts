import { type Page, type Locator } from '@playwright/test';

class NewItemPage {
    readonly page: Page;
    readonly nameField: Locator;
    readonly descriptionField: Locator;
    readonly quantityField: Locator;
    readonly addAttributeButton: Locator;

    readonly createItemButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameField = page.getByTestId('new-item-page/name-field');
        this.descriptionField = page.getByTestId('new-item-page/description-field');
        this.quantityField = page.getByTestId('new-item-page/quantity-field');
        this.addAttributeButton = page.getByTestId('new-item-page/add-attribute-button');
        this.createItemButton = page.getByTestId('new-item-page/create-item-button');
    }

    async goto() {
        await this.page.goto('/items/new');
    }

    async fillForm(name: string, description: string, quantity: string) {
        await this.nameField.fill(name);
        await this.descriptionField.fill(description);
        await this.quantityField.fill(quantity);
    }
}

export default NewItemPage;