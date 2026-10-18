import { type Page, type Locator } from '@playwright/test';

class ItemsPage {
    readonly page: Page;
    readonly newItemButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.newItemButton = page.getByTestId('items-page/new-item-button');
    }

    async goto() {
        await this.page.goto('/items');
    }
}

export default ItemsPage;