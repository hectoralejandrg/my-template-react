export const useInputProgressFile = (inputEl, progressUpload, callback) => {
  const progress = 0
  const inputProgressFile = () => {
    const file = inputEl.value.files[0]
    const reader = new FileReader()


    reader.addEventListener(
      'load',
      () => {
        // callback(reader.result)
        console.log(reader.result)
      },
      false
    )



    reader.addEventListener(
      'progress',
      (e) => {
        progressUpload.$options.propsData.value = e.loaded * 100 / e.total
      },
      false
    )
    reader.addEventListener('loadEnd', () => {
      callback()
    })
    if (file) {
      reader.readAsDataURL(file)
    }
  }
  return {
    inputProgressFile,
    progress
  }
}
