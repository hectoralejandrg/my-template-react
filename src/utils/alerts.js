import Swal from 'sweetalert2'

function autofocus (type) {
  // Esto funciona siempre y cuando el dialog se posicione al principio en el DOM
  // En caso contrario, habría que añadir una clase diferente a los modals que sean creados por etiquetas y diferenciarlos en la query
  setTimeout(() => {
    document.querySelector(`.vs-dialog > footer > button.vs-dialog-accept-button.vs-button-${type}`).focus()
  }, 50)
}
function evaluateOption (result, onConfirm, onClose) {
  if (result.isConfirmed) {
    if (onConfirm) onConfirm()
  } else if (
    /* Read more about handling dismissals below */
    result.dismiss === Swal.DismissReason.cancel
  ) {
    if (onClose) onClose()
  }
}
export default function (Vue) {
  Vue.prototype.$confirm = (text, action, title, acceptText, cancelText, outsideClick = true, onClose = null) => {
    Swal.fire({
      icon: 'warning',
      title: title || 'Confirmar',
      html: text,
      // didOpen: () => {
      //   const b = Swal.getHtmlContainer().querySelector('pre.pre')
      //   b.textContent = 'laaaaaaaaaaaaaaaaaaaaa'
      // },
      allowOutsideClick: outsideClick,
      focusConfirm: true,
      showCancelButton: true,
      confirmButtonText: `${acceptText || 'Aceptar'}`,
      cancelButtonText: cancelText || 'Cancelar',
      customClass: {
        confirmButton: 'btn btn-customyesno-success',
        cancelButton: 'btn btn-customyesno-danger mr-1'
      },
      buttonsStyling: false
    }).then(result => {
      evaluateOption(result, action, onClose)
    })
  }
  Vue.prototype.$alert = (text, action, title, acceptText, outsideClick = true) => {
    Swal.fire({
      icon: 'error',
      title: title || 'Alerta',
      html: text,
      // didOpen: () => {
      //   const b = Swal.getHtmlContainer().querySelector('pre.pre')
      //   b.textContent = 'laaaaaaaaaaaaaaaaaaaaa'
      // },
      focusConfirm: true,
      allowOutsideClick: outsideClick,
      confirmButtonText: `${acceptText || 'Aceptar'}`,
      customClass: {
        confirmButton: 'btn btn-outline-danger'
      },
      buttonsStyling: false
    }).then(result => {
      evaluateOption(result, action)
    })
  }
  Vue.prototype.$success = (text, action, title, acceptText) => {
    Swal.fire({
      icon: 'success',
      title: title || 'Completado',
      html: text,
      // didOpen: () => {
      //   const b = Swal.getHtmlContainer().querySelector('pre.pre')
      //   b.textContent = 'laaaaaaaaaaaaaaaaaaaaa'
      // },
      focusConfirm: true,
      confirmButtonText: `${acceptText || 'Aceptar'}`,
      customClass: {
        confirmButton: 'btn btn-outline-success'
      },
      buttonsStyling: false
    }).then(result => {
      evaluateOption(result, action)
    })
  }
  Vue.prototype.$info = (text, action, title, acceptText) => {
    Swal.fire({
      icon: 'info',
      title: title || 'Completado',
      html: text,
      // didOpen: () => {
      //   const b = Swal.getHtmlContainer().querySelector('pre.pre')
      //   b.textContent = 'laaaaaaaaaaaaaaaaaaaaa'
      // },
      focusConfirm: true,
      confirmButtonText: `${acceptText || 'Aceptar'}`,
      customClass: {
        confirmButton: 'btn btn-outline-info'
      },
      buttonsStyling: false
    }).then(result => {
      evaluateOption(result, action)
    })
  }
  Vue.prototype.$warning = (text, action, title, acceptText) => {
    Swal.fire({
      icon: 'warning',
      title: title || 'Completado',
      html: text,
      // didOpen: () => {
      //   const b = Swal.getHtmlContainer().querySelector('pre.pre')
      //   b.textContent = 'laaaaaaaaaaaaaaaaaaaaa'
      // },
      focusConfirm: true,
      confirmButtonText: `${acceptText || 'Aceptar'}`,
      customClass: {
        confirmButton: 'btn btn-outline-warning'
      },
      buttonsStyling: false
    }).then(result => {
      evaluateOption(result, action)
    })
  }
  Vue.prototype.$yesno = (text, action, title) => {
    Vue.prototype.$confirm(text, action, title || 'Confirmar', 'Sí', 'No')
  }
}
