export const PAGINATOR = {
    URL: "/paginate",
    LIMIT: 9,
    calculatorPageTotals: (totalItems, itemsPerPage = PAGINATOR.LIMIT) => {
        return Math.ceil(totalItems / itemsPerPage)
    }
};
