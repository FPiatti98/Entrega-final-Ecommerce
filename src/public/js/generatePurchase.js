const generatePurchase = (id) => {
    fetch(`http://localhost:8080/mongodb/api/carts/${id}/purchase`, {
    method: 'GET',
    mode: "cors",
  })
  .then(result => {
    if(result.status==200){
      alert("Ticket creado!, se le enviara los detalles por mail y las formas de pago, muchas gracias!");
      window.location.replace('/products')
    } else if (result.status==404){
      alert("El carrito esta vacio");
    }
    if(result.status==500){
        alert("No se pudo generar el ticket");
    }
  });
}