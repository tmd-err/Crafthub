import ArtisanReservations from "./ArtisanReservation";
import ClientReservations from "./ClientReservations";

function Reservations() {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.role ;
  return (
    <div>
      {
        role == "artisan" ? 
        <ArtisanReservations/> :
        <ClientReservations/>
      }
    </div>
  )
}

export default Reservations ;
