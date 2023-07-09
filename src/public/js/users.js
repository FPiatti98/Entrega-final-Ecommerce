const deleteUser = (email) => {
    //crear ruta para modificar rol y eliminar usuario
    fetch(`http://localhost:8080/api/users/${email}`, {
    method: 'DELETE',
    mode: "cors",
  })
  .then(result => {
    if(result.status==200){
      alert("usuario eliminado exitosamente");
      location.reload();
    } else {
        alert("No se pudo eliminar el usuario");
    }
  });
}

const updateUser = (email) => {
  fetch(`http://localhost:8080/api/users/${email}`, {
    method: 'PUT',
    mode: "cors",
  })
  .then(result => {
    if(result.status==200){
      alert("usuario promovido a administrador");
      location.reload();
    } else {
        alert("No se pudo promover a el usuario");
    }
  });
}