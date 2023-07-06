const update = (id) => {
    const form = document.getElementById('UpdateProdForm');
    const data = new FormData(form);
    const updatedProd = {};
    data.forEach((value, key) => {updatedProd[key]=value});

    fetch(`http://localhost:8080/mongodb/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedProd),
    mode: "cors",
    headers:{
        'Content-Type':'application/json'
    }
  }).then(result => {
    if(result.status === 200){
        alert("Producto actualizado correctamente");
    }else {
        alert("No se pudo actualizar el producto")
    }
})
}

/*
form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    const updatedProd = {};
    data.forEach((value, key) => {updatedProd[key]=value});
    fetch('/mongodb/api/products', {
        method: "POST",
        body: JSON.stringify(updatedProd),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(result => {
        if(result.status === 200){
            result.json();
            alert("Producto creado!");
        }else if(result.status === 400){
            alert("por favor enviar los datos correctamente");
            location.reload();
        } else {
            alert("Error interno del servidor")
        }
    })

    fetch(`http://localhost:8080/mongodb/api/carts/${cartId}/product/${id}`, {
    method: 'POST',
    mode: "cors",
  })
  .then(result => {
    if(result.status==200){
      alert("producto agregado");
    }
  });
})
*/