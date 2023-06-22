export const fileToBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.readAsDataURL(file)
    reader.onerror = reject
  })

export const onSelectFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const tempFileList: { fileName: string; base64String: string }[] = []
  await Promise.all(
    [].map.call(e.target.files, async (file: File) => {
      tempFileList.push({
        fileName: file.name,
        base64String:
          file.type.indexOf('image') > -1 ? await fileToBase64(file) : ''
      })
    })
  )

  return tempFileList
  // Do something like updating the component state or redux state.
}
