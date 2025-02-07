export interface EventTypeModel {
    eventStatus: string;
    eventType: string;
}
export const eventTypeDropdown = [
    {
        eventStatus: 0,
        eventName: "Sự kiện sắp ra mắt"
    },
    {
        eventStatus: 1,
        eventName: "Sự kiện giao lưu với diễn giả"
    }
]