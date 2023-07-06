const generatePurchase = (id) => {
    fetch(`http://localhost:8080/mongodb/api/carts/${id}/purchase`, {
    method: 'GET',
    mode: "cors",
  })
  .then(result => {
    if(result.status==200){
      alert("Ticket creado!");
    }
    if(result.status==500){
        alert("No se pudo generar el ticket");
    }
  });
}