export const PAGINATOR = {
    URL: "/paginate",
    LIMIT: 10,
    calculatorPageTotals: (totalItems, itemsPerPage = PAGINATOR.LIMIT) => {
        return Math.ceil(totalItems / itemsPerPage)
    }
};
