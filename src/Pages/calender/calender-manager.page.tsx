import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash } from '../../assets/icon/trash';
import ListComponent from '../../Components/list.component';
import { alertService } from '../../_services/alert.service';
import { fetchWrapper } from '../../_helpers/fetch-wrapper';
import config from '../../config';


export default function CalenderManagerPage() {
  const [data, setData] = useState([[
    { image: "book1.jpg" },
    { event: "GIAO LƯU CÙNG TÁC GIẢ NGUYỄN NHẬT ÁNH" },
    { BOOKSTREET: "THU DUC CITY BOOKSTREET" },
    { ZONE: "ZONE A" },
    { START_DATE: "1/5/2024" },
    { START_TIME: "10:00 AM" },
    { END_DATE: "1/5/2024" },
    { END_TIME: "11:30 AM" },
  ],
  [
    { image: "book1.jpg" },
    { event: "GIAO LƯU CÙNG NGUYỄN NHẬT ÁNH" },
    { BOOKSTREET: "THU DUC" },
    { ZONE: "ZONE A" },
    { START_DATE: "1/5/2024" },
    { START_TIME: "10:00 AM" },
    { END_DATE: "1/5/2024" },
    { END_TIME: "11:30 AM" },
  ],
  [
    { image: "book1.jpg" },
    { event: "GIAO LƯU CÙNG TÁC GIẢ ÁNH" },
    { BOOKSTREET: "THU DUC CITY" },
    { ZONE: "ZONE E" },
    { START_DATE: "1/5/2024" },
    { START_TIME: "10:00 AM" },
    { END_DATE: "1/5/2024" },
    { END_TIME: "11:30 AM" },
  ],
  [
    { image: "book1.jpg" },
    { event: "GIAO LƯU CÙNG TÁC GIẢ NGUYỄN" },
    { BOOKSTREET: "THU DUC BOOKSTREET" },
    { ZONE: "ZONE D" },
    { START_DATE: "1/5/2024" },
    { START_TIME: "10:00 AM" },
    { END_DATE: "1/5/2024" },
    { END_TIME: "11:30 AM" },
  ],
  [
    { image: "book1.jpg" },
    { event: "GIAO LƯU CÙNG TÁC GIẢ NHẬT ÁNH" },
    { BOOKSTREET: "THU DUC CITY" },
    { ZONE: "ZONE C" },
    { START_DATE: "1/5/2024" },
    { START_TIME: "10:00 AM" },
    { END_DATE: "1/5/2024" },
    { END_TIME: "11:30 AM" },
  ]]);
  const headers = [
    "",
    "event",
    "BOOKSTREET",
    "ZONE",
    "START_DATE",
    "START_TIME",
    "END_DATE",
    "END_TIME",
  ]

  async function fetAllData() {
    const result = fetchWrapper.get(config.apiUrl + 'Event')
    result.then(val => {
      console.log('val 75:>> ', val);
    })
  }

  useEffect(() => {
    fetAllData();
  }, []);

  function deleteItem(val) {
    alertService.alert(({
      content: "Remove success"
    }))
  }

  return (
    <><ListComponent
      title="EVENT MANAGEMENT"
      buttonName="Create new account"
      linkEdit=""
      deleteItem={deleteItem}
      header={headers} data={data}></ListComponent></>
  )
}
