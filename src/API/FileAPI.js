import instance, {del, get, post} from '@/utils/request.js'


export const upload = (data) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('description', data.description);
    formData.append('folderId', data.folderId);

    return instance.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data' // 设置为 multipart/form-data
        }
    });
};
export const folderFiles = (id) => {
    return get(`/files/${id}/files`)
}
export const download = (id) => {
    return get(`/files/download/${id}`, {
        responseType: 'blob', // 设置为 'blob'
    })
}

export const allFiles = () => {
    return get(`/files/user`)
}
export const deleteFile = (id) => {
    return del(`/files/${id}`)
}