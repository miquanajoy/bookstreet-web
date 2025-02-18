export const EVENT_TYPE = {
    None: 0,            // Không xác định   
    Entertainment: 1,       // Sự kiện vui chơi giải trí
    BookLaunch: 2,          // Sự kiện ra mắt sách, ký tặng sách
    SpeakerMeetup: 3,       // Sự kiện giao lưu với diễn giả, tác giả
    DiscountEvent: 4        // Sự kiện giảm giá
}


export const eventTypeDropdown = [
    {
        eventType: EVENT_TYPE.None,
        eventName: "Không xác định"
    },
    {
        eventType: EVENT_TYPE.Entertainment,
        eventName: "Sự kiện vui chơi giải trí"
    },
    {
        eventType: EVENT_TYPE.BookLaunch,
        eventName: "Sự kiện ra mắt sách, ký tặng sách"
    },
    {
        eventType: EVENT_TYPE.SpeakerMeetup,
        eventName: "Sự kiện giao lưu với diễn giả, tác giả"
    },
    {
        eventType: EVENT_TYPE.DiscountEvent,
        eventName: "Sự kiện giảm giá"
    }
]
