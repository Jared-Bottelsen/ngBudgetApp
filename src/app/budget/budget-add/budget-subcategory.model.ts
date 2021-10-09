export class BudgetSubcategory {

    subCategoryTitle: string;
    subCategoryValue: number;

    constructor(title: string, amount: number) {
        this.subCategoryTitle = title;
        this.subCategoryValue = amount;
    }
}
